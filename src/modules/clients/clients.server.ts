import type { ClientRead, VatRead } from "./schemas/clients-schemas";
import type { EmployeesRead } from "@/modules/employees/schemas/employees-read";
import { db } from "@/drizzle/drizzle-db";
import {
  clients,
  clientsVats,
  employees,
  invoices,
  organizations,
  projects as projectsTable,
  spentTimes,
  teams,
  vats,
  tasks,
} from "@/drizzle/schema";
import { and, asc, eq, gte, lte, sum, sql } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
// Error handling is done in .actions; keep .server methods plain
import { firstOrThrow } from "@/utils/array-utils";
import { endOfMonth, format, startOfMonth } from "date-fns";
import parsePostgresInterval from "postgres-interval";
import { unstable_cache } from "next/cache";
import { auth } from "@/modules/auth/auth";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { clientsDb } from "./clients.db";
import { distance as levenshteinDistance } from "fastest-levenshtein";

export type ProjectWithTeam = {
  id: number;
  name: string | null;
  team: EmployeesRead[];
};

export type ClientListItem = ClientRead & {
  projectsCount: number;
  employeesWorkingForClientCount: number;
  vats: Array<VatRead>;
  projects: ProjectWithTeam[];
};

// Internal readers and mappers
const readClientsWithDetails = async () =>
  db
    .select({
      clientId: clients.id,
      clientName: clients.name,
      clientAvatarUrl: organizations.avatarUrl,
      youTrackRingId: organizations.youTrackRingId,
      vatId: clientsVats.vatId,
      vat: vats,
      projectId: projectsTable.id,
      projectName: projectsTable.name,
      teamEmployeeId: teams.employeeId,
      employeeId: employees.id,
      employee: employees,
    })
    .from(clients)
    .leftJoin(organizations, eq(organizations.clientId, clients.id))
    .leftJoin(clientsVats, eq(clients.id, clientsVats.clientId))
    .leftJoin(vats, eq(clientsVats.vatId, vats.id))
    .leftJoin(projectsTable, eq(clients.id, projectsTable.clientId))
    .leftJoin(teams, eq(projectsTable.id, teams.projectId))
    .leftJoin(employees, eq(teams.employeeId, employees.id))
    .orderBy(asc(clients.name));

const toClientsWithProjectsAndTeam = async (): Promise<ClientListItem[]> => {
  const data = await readClientsWithDetails();
  const clientsMap = new Map<number, ClientListItem>();

  for (const row of data) {
    if (!clientsMap.has(row.clientId)) {
      clientsMap.set(row.clientId, {
        id: row.clientId,
        name: row.clientName,
        avatarUrl: row.clientAvatarUrl,
        vats: [],
        projects: [],
        projectsCount: 0,
        employeesWorkingForClientCount: 0,
        youTrackRingId: row.youTrackRingId,
      } as ClientListItem);
    }

    const client = clientsMap.get(row.clientId)!;

    // VATs
    if (row.vatId && !client.vats.some((v) => v.id === row.vatId)) {
      client.vats.push(row.vat!);
    }

    // Projects
    if (row.projectId && !client.projects.some((p) => p.id === row.projectId)) {
      client.projects.push({
        id: row.projectId,
        name: row.projectName,
        team: [],
      });
      client.projectsCount++;
    }

    // Employees per project
    const project = client.projects.find((p) => p.id === row.projectId);
    if (
      project &&
      row.employeeId &&
      row.employee &&
      !project.team.some((e) => e.id === row.employeeId)
    ) {
      project.team.push({
        id: row.employee.id!,
        email: row.employee.email as any,
        name: row.employee.name as any,
        surname: row.employee.surname as any,
        fullName: row.employee.fullName as any,
        birthdate: row.employee.birthdate as any,
        phoneNumber: row.employee.phoneNumber as any,
        avatarUrl: row.employee.avatarUrl as any,
        iban: row.employee.iban as any,
        dipendentiInCloudId: row.employee.dipendentiInCloudId as any,
        hiredOn: row.employee.hiredOn as any,
        payrollRegistrationNumber: row.employee
          .payrollRegistrationNumber as any,
        cf: row.employee.cf as any,
      });
    }

    // Unique employees counter
    if (
      row.employeeId &&
      !client.projects.some((p) => p.team.some((e) => e.id === row.employeeId))
    ) {
      client.employeesWorkingForClientCount++;
    }
  }

  return Array.from(clientsMap.values());
};

// Public API (server layer)
const listAll = async (): Promise<ClientListItem[]> => {
  const list = await toClientsWithProjectsAndTeam();
  return list.filter((c) => c.projectsCount > 0 || c.name === "Kuama");
};

// Basic unfiltered list for admin tools (e.g., mappings manual link)
const listAllBasic = async () => {
  return clientsDb.list();
};

const getOne = async ({
  id,
  date = new Date(),
}: {
  id: string;
  date?: Date;
}) => {
  const clientId = parseInt(id);
  const queryResult = await db.query.clients.findFirst({
    where: eq(clients.id, clientId),
    with: {
      projects: {
        with: {
          teams: { with: { employee: true } },
          projectMedias: true,
          tasks: {
            with: {
              spentTimes: {
                where: and(
                  gte(
                    spentTimes.date,
                    format(startOfMonth(date), "yyyy-MM-dd")
                  ),
                  lte(spentTimes.date, format(endOfMonth(date), "yyyy-MM-dd"))
                ),
              },
            },
          },
        },
      },
    },
  });

  if (!queryResult) throw new Error("Client not found");

  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.clientId, clientId),
  });

  const allTimeTasksCount = queryResult?.projects.reduce(
    (acc, p) => acc + p.tasks.length,
    0
  );
  const projects = queryResult?.projects.map((project) => ({
    ...project,
    teams: project.teams.map((team) => ({
      ...team,
      employee: { ...team.employee, avatarUrl: team.employee.avatarUrl },
    })),
  }));
  return {
    ...queryResult,
    projects,
    avatarUrl: organization?.avatarUrl ?? null,
    youTrackRingId: organization?.youTrackRingId ?? null,
    allTimeTasksCount,
  };
};

const getTotalInvoicedAmount = async ({ clientId }: { clientId: number }) => {
  const session = await auth();
  if (!session || !session.user?.isAdmin)
    throw new Error("Only admin is allowed to invoke this action");

  const clientWithVatsRecords = await db.query.clients.findMany({
    with: { clientsVats: { with: { kVat: true } } },
    where: eq(clients.id, clientId),
  });

  const clientWithVats = firstOrThrow(clientWithVatsRecords);
  const vatIds = clientWithVats.clientsVats.map(({ kVat }) => kVat.id);
  const amounts = await db
    .select({ value: sum(invoices.amountGross) })
    .from(invoices)
    .where(inArray(invoices.vat, vatIds));
  const amount = firstOrThrow(amounts);
  if (!amount.value) return 0;
  const parsed = parseFloat(amount.value);
  if (isNaN(parsed))
    throw new Error("Could not compute client total invoiced amount");
  return parsed;
};

const getOverallInvoicedAmount = async () => {
  const session = await auth();
  if (!session || !session.user?.isAdmin)
    throw new Error("Only admin is allowed to invoke this action");
  const amounts = await db
    .select({ value: sum(invoices.amountGross) })
    .from(invoices);
  const amount = firstOrThrow(amounts);
  if (!amount.value) return 0;
  const parsed = parseFloat(amount.value);
  if (isNaN(parsed))
    throw new Error("Could not compute overall invoiced amount");
  return parsed;
};

const getMonthlySpentTimes = async (
  clientId: number,
  date: Date = new Date()
) => {
  const cached = unstable_cache(
    async () => {
      const projectIds = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(eq(projectsTable.clientId, clientId));
      const queryResult = await getAllClientSpentTimesByProjectAndDateQuery(
        projectIds.map((it) => it.id),
        date
      );
      if (!queryResult || queryResult.length === 0)
        return [] as Array<{ date: string; duration: number }>;

      const allSpentTimes = queryResult
        .map(
          (it: {
            spentTimes: Array<{
              date: string | null;
              duration: string | null;
            }>;
          }) => it.spentTimes
        )
        .flat();
      const reduced = allSpentTimes.reduce(
        (
          acc: Map<string, number>,
          st: { date: string | null; duration: string | null }
        ) => {
          if (!st.date || !st.duration) return acc;
          if (!acc.has(st.date)) acc.set(st.date, 0);
          const parsedDuration = parsePostgresInterval(st.duration);
          const { days, hours, minutes } = parsedDuration;
          const minutesInHours = Math.floor(minutes / 60);
          const daysInHours = days * 8;
          const currentValue = acc.get(st.date) ?? 0;
          acc.set(st.date, currentValue + daysInHours + hours + minutesInHours);
          return acc;
        },
        new Map<string, number>()
      );
      const entries: Array<[string, number]> = Array.from(reduced.entries());
      return entries.map(([d, duration]) => ({ date: d, duration }));
    },
    [clientId.toString(), date.toISOString()],
    { revalidate: 60 * 60 * 24, tags: ["clientGetMonthlySpentTimesAction"] }
  );
  return cached();
};

const getAllClientSpentTimesByProjectAndDateQuery = async (
  projectIds: number[],
  date: Date
) => {
  // Keep using existing utility to avoid duplication
  const { getAllClientSpentTimesByProjectAndDateQuery } = await import(
    "@/modules/clients/utils/get-all-client-spent-times-by-project-and-date"
  );
  return getAllClientSpentTimesByProjectAndDateQuery(projectIds, date);
};

const getTasksAndSpentTimes = async ({
  projectIds,
  date,
}: {
  projectIds: number[];
  date: Date;
}) => {
  const cached = unstable_cache(
    async () => {
      const queryResult = await getAllClientSpentTimesByProjectAndDateQuery(
        projectIds,
        date
      );
      if (!queryResult || queryResult.length === 0) {
        return {
          humanReadableDuration: "0 minutes",
          spentTimes: [] as any[],
        };
      }
      type Duration = {
        years: number;
        months: number;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;
      };
      const initialDuration: Duration = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      };
      const monthSpentTime: Duration = queryResult.reduce<Duration>(
        (
          acc: Duration,
          task: { spentTimes: Array<{ duration: string | null }> }
        ) => {
          const taskSpentTime: Duration = task.spentTimes.reduce<Duration>(
            (accInner: Duration, st: { duration: string | null }) => {
              if (!st.duration) return accInner;
              const parsed = parsePostgresInterval(st.duration);
              return {
                years: accInner.years + parsed.years,
                months: accInner.months + parsed.months,
                days: accInner.days + parsed.days,
                hours: accInner.hours + parsed.hours,
                minutes: accInner.minutes + parsed.minutes,
                seconds: accInner.seconds + parsed.seconds,
                milliseconds: accInner.milliseconds + parsed.milliseconds,
              };
            },
            { ...initialDuration }
          );
          return {
            years: acc.years + taskSpentTime.years,
            months: acc.months + taskSpentTime.months,
            days: acc.days + taskSpentTime.days,
            hours: acc.hours + taskSpentTime.hours,
            minutes: acc.minutes + taskSpentTime.minutes,
            seconds: acc.seconds + taskSpentTime.seconds,
            milliseconds: acc.milliseconds + taskSpentTime.milliseconds,
          };
        },
        { ...initialDuration }
      );

      const { days, hours, minutes } = monthSpentTime;
      const numberOfHours = minutes / 60;
      const remainingMinutes = minutes % 60;
      const numberOfDays = (hours + numberOfHours) / 8;
      const remainingHours = (hours + 8) % 24;
      const { formatDuration } = await import("date-fns");
      const humanReadableDuration = formatDuration(
        {
          days: Math.ceil(numberOfDays + days),
          hours: Math.ceil(remainingHours),
          minutes: Math.ceil(remainingMinutes),
        },
        { format: ["days", "hours", "minutes"] }
      );
      return {
        humanReadableDuration,
        monthSpentTime,
        spentTimes: queryResult,
      };
    },
    [...projectIds.map((it) => it.toString()), date.toISOString()],
    {
      revalidate: 60 * 8 * 24,
      tags: ["clientGetTasksAndSpentTimesByProjects"],
    }
  );
  return cached();
};

// Fatture in Cloud import: create/upsert clients by name and attach VATs via existing associate flow
const importFromFattureInCloud = async () => {
  const ficClients = await fattureInCloudApiClient.getClients();

  await db.transaction(async (tx) => {
    for (const c of ficClients) {
      if (!c.name) continue;

      // Ensure client exists
      const clientRow = await clientsDb.upsertByName(c.name);
      if (!clientRow?.id) continue;

      // Upsert VAT when available and link to client
      if (c.vat_number) {
        const vatRecords = await tx
          .insert(vats)
          .values({
            vat: c.vat_number,
            companyName: c.name,
            fattureInCloudId: c.id?.toString(),
          })
          .onConflictDoUpdate({
            target: vats.vat,
            set: { companyName: c.name, fattureInCloudId: c.id?.toString() },
          })
          .returning({ vatId: vats.id });
        const vatId = vatRecords[0]?.vatId;
        if (vatId) {
          await tx
            .insert(clientsVats)
            .values({ clientId: clientRow.id, vatId })
            .onConflictDoNothing({
              target: [clientsVats.vatId, clientsVats.clientId],
            });
        }
      }
    }
  });

  return { count: ficClients.length };
};

// YouTrack mapping helpers (name-only similarity in server layer will be added later together with UI)
// Placeholder for future mapping UI endpoints
const listUnlinked = async () => {
  // Organizations with no client linked
  const rows = await db
    .select()
    .from(organizations)
    .where(sql`${organizations.clientId} IS NULL`);
  return rows;
};

export const clientsServer = {
  listAll,
  listAllBasic,
  getOne,
  getTasksAndSpentTimes,
  getMonthlySpentTimes,
  getTotalInvoicedAmount,
  getOverallInvoicedAmount,
  importFromFattureInCloud,
  listUnlinked,

  // List organizations with current client mapping (if any)
  async listOrganizationsWithClient() {
    const rows = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        clientId: organizations.clientId,
        clientName: clients.name,
        avatarUrl: organizations.avatarUrl,
        youTrackRingId: organizations.youTrackRingId,
      })
      .from(organizations)
      .leftJoin(clients, eq(organizations.clientId, clients.id))
      .orderBy(asc(organizations.name));
    return rows;
  },

  async suggestYouTrackOrgMatches({
    minScore = 0.6,
    limitPerOrg = 3,
  }: { minScore?: number; limitPerOrg?: number } = {}): Promise<
    OrgSuggestion[]
  > {
    const allClients = await clientsDb.list();
    const orgs = await db.select().from(organizations);
    const suggestions: OrgSuggestion[] = [];

    for (const org of orgs) {
      const candidates = allClients
        .map((c) => ({
          clientId: c.id!,
          clientName: c.name!,
          score: similarity(org.name ?? "", c.name ?? ""),
        }))
        .filter((x) => x.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, limitPerOrg);
      suggestions.push({
        organizationId: org.id!,
        organizationName: org.name ?? "",
        candidates,
      });
    }

    return suggestions;
  },

  async linkOrganization({
    organizationId,
    clientId,
  }: {
    organizationId: number;
    clientId: number;
  }) {
    const rows = await db
      .update(organizations)
      .set({ clientId })
      .where(eq(organizations.id, organizationId))
      .returning();
    return rows[0] ?? null;
  },

  async unlinkOrganization({ organizationId }: { organizationId: number }) {
    const rows = await db
      .update(organizations)
      .set({ clientId: null as unknown as number })
      .where(eq(organizations.id, organizationId))
      .returning();
    return rows[0] ?? null;
  },

  async autoLinkYouTrackOrgs({
    threshold = 0.8,
  }: {
    threshold?: number;
  } = {}) {
    const allClients = await clientsDb.list();
    const orgs = await db.select().from(organizations);
    const results: Array<{
      organizationId: number;
      organizationName: string;
      clientId?: number;
      clientName?: string;
      score?: number;
    }> = [];

    for (const org of orgs) {
      const ranked = allClients
        .map((c) => ({
          clientId: c.id!,
          clientName: c.name!,
          score: similarity(org.name ?? "", c.name ?? ""),
        }))
        .sort((a, b) => b.score - a.score);
      const best = ranked[0];
      if (best && best.score >= threshold) {
        await db
          .update(organizations)
          .set({ clientId: best.clientId })
          .where(eq(organizations.id, org.id!));
        results.push({
          organizationId: org.id!,
          organizationName: org.name ?? "",
          clientId: best.clientId,
          clientName: best.clientName,
          score: best.score,
        });
      } else {
        results.push({
          organizationId: org.id!,
          organizationName: org.name ?? "",
        });
      }
    }

    return results;
  },
};

// ---------- YouTrack mapping helpers ----------
// Normalization and optimized Levenshtein-based similarity using fastest-levenshtein
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const similarity = (a: string, b: string) => {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  const dist = levenshteinDistance(na, nb);
  return 1 - dist / maxLen;
};

type OrgSuggestion = {
  organizationId: number;
  organizationName: string;
  candidates: Array<{ clientId: number; clientName: string; score: number }>;
};
