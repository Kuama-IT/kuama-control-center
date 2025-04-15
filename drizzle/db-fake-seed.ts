import { drizzle } from "drizzle-orm/postgres-js";
import { faker } from "@faker-js/faker";
import {
  kClients,
  kClientsVats,
  kEmployees,
  kInvoices,
  kInvoicesToProjects,
  kPayrolls,
  kProjects,
  kSpentTimes,
  kTasks,
  kTeams,
  kVats,
} from "./schema";
import path from "path";
import * as dotenv from "dotenv";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("🛑  DATABASE_URL is missing. Suit up your .env file, bro!");
  process.exit(1);
}

const postgresClient = postgres(connectionString, {
  prepare: false, // Disable prefetch as it is not supported for "Transaction" pool mode
});

export const db = drizzle({
  casing: "snake_case",
  client: postgresClient,
  schema: { ...schema, ...relations },
});

async function seedDatabase() {
  console.log("Seeding database...");

  console.log("Seeding employees...");
  const employees = [];
  for (let i = 0; i < 10; i++) {
    employees.push({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      birthdate: faker.date
        .past({ years: 30, refDate: new Date("2000-01-01") })
        .toISOString(),
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      hiredOn: faker.date.past({ years: 5 }).toISOString(),
      nationalInsuranceNumber: faker.string.alphanumeric(10),
      phoneNumber: faker.phone.number(),
      iban: faker.finance.iban(),
    });
  }
  const employeesIds = await db
    .insert(kEmployees)
    .values(employees)
    .returning({ id: kEmployees.id });

  const clients = [];
  for (let i = 0; i < 5; i++) {
    clients.push({
      name: faker.company.name(),
      avatarUrl: faker.image.avatar(),
    });
  }
  const clientIds = await db
    .insert(kClients)
    .values(clients)
    .returning({ id: kClients.id });

  console.log("Seeding vats...");
  const vats = [];
  for (let i = 0; i < 10; i++) {
    vats.push({
      vat: `${faker.location.countryCode("alpha-2")}${faker.number.int({ min: 100000000, max: 999999999 })}`,
      companyName: faker.company.name(),
      fattureInCloudId: faker.string.uuid(),
    });
  }
  const vatIds = await db
    .insert(kVats)
    .values(vats)
    .returning({ id: kVats.id });

  const clientsVats = [];
  for (const client of clientIds) {
    clientsVats.push({
      vatId: faker.helpers.arrayElement(vatIds).id,
      clientId: client.id,
    });
  }
  await db.insert(kClientsVats).values(clientsVats);

  console.log("Seeding invoices...");
  const invoices = [];
  for (let i = 0; i < 20; i++) {
    const vat = faker.helpers.arrayElement(vatIds);
    const amountNet = faker.number.float({
      min: 100,
      max: 10000,
      fractionDigits: 2,
    });
    const amountVat = amountNet * 0.22;
    const amountGross = amountNet + amountVat;

    invoices.push({
      vat: vat.id,
      subject: faker.commerce.productName(),
      amountNet,
      amountGross,
      amountVat,
      date: faker.date.past({ years: 1 }).toISOString(),
      number: faker.number.int({ min: 1, max: 1000 }),
    });
  }
  const invoiceIds = await db
    .insert(kInvoices)
    .values(invoices)
    .returning({ id: kInvoices.id });

  console.log("Seeding projects...");
  const projects = [];
  for (let i = 0; i < 10; i++) {
    projects.push({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      clientId: faker.helpers.arrayElement(clientIds).id,
      startDate: faker.date.past({ years: 2 }).toISOString(),
      endDate: faker.date.future({ years: 1 }).toISOString(),
    });
  }
  const projectIds = await db.insert(kProjects).values(projects).returning({
    id: kProjects.id,
  });

  const invoicesToProjects = [];
  for (const invoice of invoiceIds) {
    invoicesToProjects.push({
      invoiceId: invoice.id,
      projectId: faker.helpers.arrayElement(projectIds).id,
    });
  }
  await db.insert(kInvoicesToProjects).values(invoicesToProjects);

  console.log("Seeding tasks...");
  const tasks = [];
  for (let i = 0; i < 2000; i++) {
    tasks.push({
      name: faker.hacker.verb(),
      description: faker.lorem.sentence(),
      platform: faker.helpers.arrayElement(["github", "gitlab", "jira"]),
      projectId: faker.helpers.arrayElement(projectIds).id,
      employeeId: faker.helpers.arrayElement(employeesIds).id,
      externalTrackerId: faker.string.uuid(),
      creationDate: faker.date.past({ years: 1 }).toISOString(),
    });
  }
  const taskIds = await db.insert(kTasks).values(tasks).returning({
    id: kTasks.id,
  });

  console.log("Seeding spent times...");
  const spentTimes = [];
  for (const { id: taskId } of taskIds) {
    const platform = faker.helpers.arrayElement(["github", "gitlab", "jira"]);
    spentTimes.push({
      duration: `${faker.number.int({ min: 1, max: 8 })} hours`,
      date: faker.date.past({ years: 1 }).toISOString(),
      description: faker.lorem.sentence(),
      platform,
      taskId,
      externalTrackerId: faker.string.uuid(),
    });
    spentTimes.push({
      duration: `${faker.number.int({ min: 1, max: 8 })} hours`,
      date: faker.date.past({ years: 1 }).toISOString(),
      description: faker.lorem.sentence(),
      platform,
      taskId,
      externalTrackerId: faker.string.uuid(),
    });
  }

  await db.insert(kSpentTimes).values(spentTimes);

  console.log("Seeding teams...");
  const teams = [];
  for (let i = 0; i < 10; i++) {
    teams.push({
      employeeId: faker.helpers.arrayElement(employeesIds).id,
      projectId: faker.helpers.arrayElement(projectIds).id,
    });
  }
  await db.insert(kTeams).values(teams);

  // seed employees payrolls
  console.log("Seeding employees payrolls...");
  const payrolls = [];
  const today = new Date();

  for (const employee of employeesIds) {
    for (let month = 0; month < 12; month++) {
      const payrollDate = new Date(today.getFullYear(), month, 1);
      const net = faker.number.float({
        min: 1700,
        max: 1800,
        fractionDigits: 2,
      });
      const gross = net * 1.3;

      payrolls.push({
        employeeId: employee.id,
        net,
        gross,
        date: payrollDate.toISOString(),
        payrollNumber: month + 1, // 1 per gennaio, 2 per febbraio, ecc.
        url: faker.internet.url(),
        dipendentiInCloudPayrollId: faker.string.uuid(),
      });
    }
  }

  await db.insert(kPayrolls).values(payrolls);
  console.log("Employees payrolls seeded successfully!");

  console.log("Database seeded successfully!");
}

async function clearDatabase() {
  console.log("Clearing database...");

  await db.delete(kSpentTimes).execute();
  await db.delete(kTasks).execute();
  await db.delete(kInvoicesToProjects).execute();
  await db.delete(kInvoices).execute();
  await db.delete(kProjects).execute();
  await db.delete(kTeams).execute();
  await db.delete(kClientsVats).execute();
  await db.delete(kVats).execute();
  await db.delete(kClients).execute();
  await db.delete(kPayrolls).execute();
  await db.delete(kEmployees).execute();

  console.log("Database cleared successfully!");
}

clearDatabase()
  .then(seedDatabase)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
