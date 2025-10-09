"use server";
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
import { and, asc, eq, gte, lte, sum } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { endOfMonth, format, startOfMonth } from "date-fns";
import parsePostgresInterval from "postgres-interval";
import { auth } from "@/modules/auth/auth";
import type { ClientListItem } from "./clients.server";
import { getAllClientSpentTimesByProjectAndDateQuery } from "@/modules/clients/utils/get-all-client-spent-times-by-project-and-date";
import { unstable_cache } from "next/cache";

// list all clients with projects, vats, team sizes
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

const clientsWithProjectsAndTeam = async () => {
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

		// Add VATs
		if (row.vatId && !client.vats.some((vat) => vat.id === row.vatId)) {
			client.vats.push(row.vat!);
		}

		// Add Projects
			if (row.projectId && !client.projects.some((p) => p.id === row.projectId)) {
			client.projects.push({
				id: row.projectId,
				name: row.projectName,
				team: [],
			});
			client.projectsCount++;
		}

		// Add Employees to Projects
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
					payrollRegistrationNumber: row.employee.payrollRegistrationNumber as any,
					cf: row.employee.cf as any,
				});
		}

		// Count unique employees working for the client
		if (
			row.employeeId &&
			!client.projects.some((p) => p.team.some((e) => e.id === row.employeeId))
		) {
			client.employeesWorkingForClientCount++;
		}
	}

	return Array.from(clientsMap.values());
};

const clientsListAllAction = async (): Promise<ClientListItem[]> => {
	const list = await clientsWithProjectsAndTeam();
	return list.filter((client) => client.projectsCount > 0 || client.name === "Kuama");
};
export const listAllAction = handleServerErrors(clientsListAllAction);

// get one client with nested relations and month spent times
const clientGetOneAction = async ({ id, date = new Date() }: { id: string; date?: Date }) => {
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
									gte(spentTimes.date, format(startOfMonth(date), "yyyy-MM-dd")),
									lte(spentTimes.date, format(endOfMonth(date), "yyyy-MM-dd"))
								),
							},
						},
					},
				},
			},
		},
	});

	if (!queryResult) {
		throw new Error("Client not found");
	}

	// Fetch organization info (avatarUrl, youTrackRingId) associated to this client
	const organization = await db.query.organizations.findFirst({
		where: eq(organizations.clientId, clientId),
	});

	const allTimeTasksCount = queryResult?.projects.reduce((acc, project) => acc + project.tasks.length, 0);
	const projects = queryResult?.projects.map((project) => ({
		...project,
		teams: project.teams.map((team) => ({
			...team,
			employee: {
				...team.employee,
				avatarUrl: team.employee.avatarUrl,
			},
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
export const getOneAction = handleServerErrors(clientGetOneAction);

// total invoiced for a client (admin only)
async function clientGetTotalInvoicedAmount({ clientId }: { clientId: number }) {
	const session = await auth();
	if (!session || !session.user?.isAdmin) {
		throw new Error("Only admin is allowed to invoke this action");
	}

	const clientWithVatsRecords = await db.query.clients.findMany({
		with: { clientsVats: { with: { kVat: true } } },
		where: eq(clients.id, clientId),
	});

	const clientWithVats = firstOrThrow(clientWithVatsRecords);
	const vatIds = clientWithVats.clientsVats.map(({ kVat }) => kVat.id);
	const amounts = await db.select({ value: sum(invoices.amountGross) }).from(invoices).where(inArray(invoices.vat, vatIds));
	const amount = firstOrThrow(amounts);
	if (!amount.value) {
		return 0;
	}
	const parsed = parseFloat(amount.value);
	if (isNaN(parsed)) {
		throw new Error("Could not compute client total invoiced amount");
	}
	return parsed;
}
export const getTotalInvoicedAmountAction = handleServerErrors(clientGetTotalInvoicedAmount);

// overall invoiced (admin only)
async function clientGetOverallInvoicedAmount() {
	const session = await auth();
	if (!session || !session.user?.isAdmin) {
		throw new Error("Only admin is allowed to invoke this action");
	}
	const amounts = await db.select({ value: sum(invoices.amountGross) }).from(invoices);
	const amount = firstOrThrow(amounts);
	if (!amount.value) {
		return 0;
	}
	const parsed = parseFloat(amount.value);
	if (isNaN(parsed)) {
		throw new Error("Could not compute overall invoiced amount");
	}
	return parsed;
}
export const getOverallInvoicedAmountAction = handleServerErrors(clientGetOverallInvoicedAmount);

// monthly spent times for a client
const clientGetMonthlySpentTimesAction = async (clientId: number, date: Date = new Date()) => {
	const cached = unstable_cache(
		async () => {
			const projectIds = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.clientId, clientId));
			const queryResult = await getAllClientSpentTimesByProjectAndDateQuery(projectIds.map((it) => it.id), date);
			if (!queryResult || queryResult.length === 0) {
				return [] as Array<{ date: string; duration: number }>;
			}
					const allSpentTimes = queryResult.map((it: { spentTimes: Array<{ date: string | null; duration: string | null }> }) => it.spentTimes).flat();
					const reduced = allSpentTimes.reduce((acc: Map<string, number>, st: { date: string | null; duration: string | null }) => {
				if (!st.date || !st.duration) return acc;
				if (!acc.has(st.date)) acc.set(st.date, 0);
				const parsedDuration = parsePostgresInterval(st.duration);
				const { days, hours, minutes } = parsedDuration;
				const minutesInHours = Math.floor(minutes / 60);
				const daysInHours = days * 8;
				const currentValue = acc.get(st.date) ?? 0;
				acc.set(st.date, currentValue + daysInHours + hours + minutesInHours);
				return acc;
			}, new Map<string, number>());
					const entries: Array<[string, number]> = Array.from(reduced.entries());
					return entries.map(([date, duration]) => ({ date, duration }));
		},
		[clientId.toString(), date.toISOString()],
		{ revalidate: 60 * 60 * 24, tags: ["clientGetMonthlySpentTimesAction"] }
	);
	return cached();
};
export const getMonthlySpentTimesAction = handleServerErrors(clientGetMonthlySpentTimesAction);

// tasks and spent times by project
const clientGetTasksAndSpentTimesByProjects = async ({ projectIds, date }: { projectIds: number[]; date: Date }) => {
		const cached = unstable_cache(
			async () => {
				const queryResult = await getAllClientSpentTimesByProjectAndDateQuery(projectIds, date);
				if (!queryResult || queryResult.length === 0) {
					return { humanReadableDuration: "0 minutes", spentTimes: [] as any[] };
				}
				type Duration = { years: number; months: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number };
				const initialDuration: Duration = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
				const monthSpentTime: Duration = queryResult.reduce<Duration>((acc: Duration, task: { spentTimes: Array<{ duration: string | null }> }) => {
					const taskSpentTime: Duration = task.spentTimes.reduce<Duration>((accInner: Duration, st: { duration: string | null }) => {
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
					}, { ...initialDuration });
					return {
						years: acc.years + taskSpentTime.years,
						months: acc.months + taskSpentTime.months,
						days: acc.days + taskSpentTime.days,
						hours: acc.hours + taskSpentTime.hours,
						minutes: acc.minutes + taskSpentTime.minutes,
						seconds: acc.seconds + taskSpentTime.seconds,
						milliseconds: acc.milliseconds + taskSpentTime.milliseconds,
					};
				}, { ...initialDuration });

				const { days, hours, minutes } = monthSpentTime;
				const numberOfHours = minutes / 60;
				const remainingMinutes = minutes % 60;
				const numberOfDays = (hours + numberOfHours) / 8;
				const remainingHours = (hours + 8) % 24;
				const { formatDuration } = await import("date-fns");
				const humanReadableDuration = formatDuration(
					{ days: Math.ceil(numberOfDays + days), hours: Math.ceil(remainingHours), minutes: Math.ceil(remainingMinutes) },
					{ format: ["days", "hours", "minutes"] }
				);
				return { humanReadableDuration, monthSpentTime, spentTimes: queryResult };
			},
		[...projectIds.map((it) => it.toString()), date.toISOString()],
		{ revalidate: 60 * 8 * 24, tags: ["clientGetTasksAndSpentTimesByProjects"] }
	);
	return cached();
};
export const getTasksAndSpentTimesAction = handleServerErrors(clientGetTasksAndSpentTimesByProjects);

