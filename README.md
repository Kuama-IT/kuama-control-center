
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODOs

- [x] YouTrack client integration (projects, issues, time reports)
- [x] Project tables (k-clients, k-employees, k-projects)
- [ ] Sync data
- [x] Authentication: Login with YouTrack
- [ ] Gitlab client integration (projects, issues, time reports)
- [x] Dashboard: who is absent this week?
- [x] payroll ocr?
- [ ] payroll estimates
- [ ] estimated annual turnover
- [ ] estimated annual profit
- [ ] fatture in cloud integration (generate invoices based on time reports & tasks & and send them)
- [ ] k-employee profile: remember a field that allows to set the hourly cost of the employee
- [ ] GitHub stats: pr stats? line of code stats?
- [ ] YouTrack stats: issues stats? time reports stats? open issues stats? closed issues stats?
- [ ] k-employee stats: earned until today? worked hours until today? reported worked hours until today? vacanze? malattie? ferie? expected worked hours from contract?

## Gotchas

A project may have

- [x] a monthly amount to invoice (with invoice row description)
- [x] a daily rate to be multiplied by the number of days worked (with invoice row description)
  Invoices should be managed by client, and should propose a first version of the rows of the invoice, that can be edited by the user before sending the invoice.
- [x] If invoicing for a given project is based on time spent not reported to YT, we should be able to say "hey, this is the provider, go reading the time reports from this provider and generate the invoice based on that". Current providers that need support are easyredmine and Jira. Otherwise, spent time should be read from YT

## ROADMAP

- [x] Authentication: Login with YouTrack
- [x] Authentication: User role (admin|employee)
- [x] Authentication: Allow only admin & dipendenti in cloud users to login
- [x] Make prettier check only relevant files
- [x] Employee list
- [x] Dashboard: who is absent this week?
- [ ] Overall Year selector?
- [ ] Dashboard: monthly overall commits graphs
- [ ] Dashboard: monthly overall time reports graphs
- [ ] Dashboard: monthly expected expenses graphs
- [ ] Dashboard: monthly expected revenues graphs
- [ ] Dashboard: yearly expected revenues (compare v/s previous years)
- [ ] Dashboard: yearly expected turnover (compare v/s previous years)
- [ ] Rework sync logics: each client should provide a set of credentials to be used to sync data. Logical flow should be -> get all spent time by credentials -> understand which project and which issue (we probably don't care to sync them over YT) -> import to db
- [ ] Client profile: List of credentials. Do we need to associate credentials to projects/employee/client? hmmmm
- [ ] Employee profile: provide credentials? hmmm
- [x] Employee profile: sync data button
- [ ] Employee profile: reported hours until today
- [ ] Employee profile: performed commits until today
- [ ] Employee profile: list of payrolls
- [ ] Employee profile: total amount earned until today
- [ ] Employee profile: total cost for the company until today
- [ ] Employee profile: total earnings for company until today
- [ ] Employee profile: List of projects he's been working on
- [x] Client profile: List of projects
- [ ] Client profile: Contract settings (see gotchas)
- [ ] Client profile: List of invoices
- [ ] Client profile: Earned until today (by year)
- [ ] Client profile: Spent (by employee) until today (by year)
- [ ] Client profile: Generate invoice button
- [ ] Client profile: Reports button
- [x] Projects: Team
- [x] Projects: previews slider
- [ ] Site Navigation (header, menu...)
- [ ] Fix missing clients / projects (archived on YouTrack are not imported hence we get mismatch in invoices history)
- [x] Pubblicaweb integration
- [ ] Sync pubblicaweb and dipendentincloud
- [ ] Sync also presence (not only absence) to verify monthly timesheets
- [x] Should invoices be linked to projects? yes

Iniziamo dal valore della RAL: 2.000 x 12 = 24.000 €
Aggiungiamo ora la tredicesima: RAL = 24.000 + 2.000 = 26.000 €
Calcoliamo ora i contributi a carico dell’azienda, applicando la percentuale media del 30%: 26.000 x 30%= 7.800 €
A questo punto, calcoliamo la quota di TFR da accantonare: 26.000 : 13,5 = 1.926 € (arrotondato)
Per finire, sommiamo i dati ricavati per capire quanto costa un dipendente a tempo indeterminato full-time: 26.000 + 7.800 + 1.926 = 35.726 euro
A questo importo dovremo poi aggiungere i vari costi diretti e indiretti che abbiamo analizzato nel corso dell’articolo.
