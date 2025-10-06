# Payrolls, DIC, and Multi‑source Orchestration

This document captures the clarified flow for payrolls and employees, and the orchestration across Pubblica Web (payroll PDFs), Dipendenti in Cloud (employees + timesheets + payroll upload), and other sources (YouTrack/EasyRedmine/Jira/FattureInCloud/GitHub/GitLab).

## Sources of truth

- Pubblica Web: monthly PDFs
  - payrolls bundle PDF (all employees, plus final totals page)
  - company expenses PDF (taxes, contributions, etc.)
- Dipendenti in Cloud (DIC):
  - employee anagraphics (IBAN, DoB, etc.) and monthly timesheets (attendance/absence codes and hours)
  - payroll distribution to employees (accepts a single monthly payrolls PDF upload; requires manual confirmation UI in DIC)

We will store raw documents and parsed rows in our DB to power analytics and cashflow, and derive normalized payroll records per employee/month.

---

## Monthly flows

1. Fetch DIC monthly timesheets → Generate consultant report

   - Input: {year, month}
   - Steps:
     - Fetch DIC timesheet entries for all active employees (pagination if needed)
     - Store entries (upsert, idempotent)
     - Generate a consultant PDF report (existing DIC component) and persist it as a document
   - Output: {pdfId, url, employees, entriesCount}

1. Import Pubblica Web documents → Parse and derive payrolls

   - Input: {year, month, dryRun?}
   - Steps:
     - Download payrolls bundle PDF and company expenses PDF from Pubblica Web
     - Store documents (bytea) with sha256 and metadata
     - Parse payrolls PDF into rows (one per employee page) and totals page
     - Attempt to match parsed rows to employees via mappings (taxCode, full name, DIC id); leave unmatched rows for manual mapping UI
     - Derive normalized `payrolls` per employee/month (gross/net/cost) with FK to source document
   - Output: {documents: {payrollsPdfId, expensesPdfId}, parsed: {imported, updated, skipped}, unmatchedEmployees, totals}

1. Upload payrolls PDF to DIC

   - Input: {year, month, documentId}
   - Steps:
     - Upload the original payrolls bundle PDF to DIC via API
     - Persist an `dic_uploads` record with status=uploaded and external upload id if available
     - Operator completes manual confirmation in DIC UI; we can optionally poll status if API supports it, else remain in uploaded
   - Output: {uploaded: true, requiresManualConfirmation: true, dicUploadId?}

1. Profitability analytics (year‑scoped)

   - Combine:
     - Revenue: FattureInCloud invoices (sent) linked to clients/projects
     - Cost: payrolls (employer cost) per employee; allocate by client/project using time sources
     - Time: YouTrack/EasyRedmine/Jira spent times per employee by project/org
   - Outputs: margin by client/project and by employee; trends and KPIs

---

## Contracts (server actions)

- importPubblicaWeb({year, month, dryRun}) →
  - { documents: { payrollsPdfId, expensesPdfId }, parsed: { imported, updated, skipped }, unmatchedEmployees: Array<{ displayName, taxCode?, net, pageIndex }>, totals: { gross, net, contributions, employeesCount } }

- publishPayrollsToDIC({year, month, documentId}) →
  - { uploaded: boolean, requiresManualConfirmation: boolean, dicUploadId?: string, status: 'uploaded'|'failed' }

- fetchDICMonthlyTimesheet({year, month, force?}) →
  - { employees: number, entries: number, pdfReportId?: string }

- generateConsultantReport({year, month}) →
  - { pdfId, url }

- profitabilitySync({year}) →
  - { clients: Array<{ clientId, revenue, cost, margin }>, employees: Array<{ employeeId, cost, allocatedRevenue, margin }> }

Shared concerns: dryRun support where meaningful, idempotent upserts, year/month filters, admin gating.

---

## DB schema additions (Drizzle)

Tables to add (names are indicative; implement in `drizzle/schema.ts`):

- pubblica_web_documents
  - id (PK), year, month, type: 'payrolls'|'company_expenses'
  - providerFileId (text), sha256 (text), size (int), content (bytea), fetchedAt (timestamptz)

- pubblica_web_payrolls_raw
  - documentId (FK), employeeDisplayName (text), taxCode (text?)
  - gross (numeric), net (numeric), contributions (numeric), items (jsonb), pageIndex (int)

- payrolls
  - employeeId (FK), year, month, gross, net, employerCost, contributions, sourceDocumentId (FK)
  - unique (employeeId, year, month)

- dic_timesheet_entries
  - employeeId (FK), date, code (enum/text), hours (numeric), notes (text?)
  - unique(employeeId, date, code)

- dic_uploads
  - id (PK), year, month, documentId (FK->pubblica_web_documents), status: 'uploaded'|'confirmed'|'failed', dicUploadId (text)
  - createdAt, updatedAt, error (text?)

- identity_mappings
  - employeeId (FK), provider: 'youtrack'|'dic'|'github'|'gitlab'|'easyredmine'|'jira', externalId (text)
  - unique(provider, externalId)

- organization_mappings
  - ficClientId (FK), youtrackOrganizationId (FK), easyredmineProjectId (FK?)
  - unique pairs as relevant

- sync_cursors
  - source (text), scope (e.g., 'payrolls', 'dic-timesheets', 'youtrack'), cursor (text/json), updatedAt

- import_runs
  - id (PK), source (text), params (jsonb), startedAt, finishedAt, status, counters (jsonb), error (text?)

---

## Module layout

- src/modules/pubblica-web/
  - pubblica-web.db.ts: documents + raw payrolls persistence
  - pubblica-web.server.ts: parsing pipeline, derivation to normalized payrolls
  - pubblica-web.actions.ts: importPubblicaWeb (wrapped with standard error handler)
  - schemas/: Zod schemas for parsed rows and action payloads

- src/modules/dipendenti-in-cloud/
  - dic.server.ts: timesheets fetch/store, upload handler (no wrapper)
  - dic.actions.ts: fetchDICMonthlyTimesheet, publishPayrollsToDIC, generateConsultantReport (wrapped)
  - schemas/: Zod schemas for timesheet entries and upload contracts

- src/modules/sync-data/
  - orchestrator.ts: schedules, sync cursors, backfills
  - mappings.ts: identity/org mappings helpers

- src/modules/analytics/
  - profitability.server.ts: aggregates across FIC + time sources + payrolls
  - profitability.actions.ts: profitabilitySync

---

## UI surfaces (year‑scoped)

- Admin → Payrolls
  - Import month: run importPubblicaWeb; show results, unmatched rows with mapping UI
  - Upload to DIC: pick a document, upload, show status and manual confirmation note
  - DIC timesheets: fetch current month; generate and download consultant report
  - Company expenses: view monthly taxes, cashflow impact

- Admin → Profitability
  - Year filter; margin by client/project and by employee; drill‑down into time and invoices

- Employees → My payrolls
  - List/download my monthly payrolls and view basic totals

- Sync dashboard
  - Per source last run, counters, status, retry/backfill actions

---

## Scheduling, idempotency, and security

- API cron endpoints with secret (import current month; fetch DIC timesheets; optional profitability refresh)
- Idempotent upserts via unique constraints; `import_runs` records for auditability
- Admin‑only for imports and uploads; employees can only read their own payrolls
- Secrets via platform‑credentials; consider encrypting stored PDF content or migrate to object storage later

---

## Rollout

1) Read‑only imports (Pubblica Web + DIC timesheets) and admin visibility
2) DIC upload flow with manual confirmation tracking
3) Profitability analytics across sources
4) Add Jira + code stats (GitHub/GitLab) and enrich mappings
5) Automatic crons and full backfills

---

## Open questions

- Best unique identifiers to map parsed payroll rows to employees (tax code availability and reliability)
- Polling ability for DIC upload status vs manual confirmation being the terminal state
- Whether to store PDFs in DB (bytea) vs object storage (S3) long‑term
