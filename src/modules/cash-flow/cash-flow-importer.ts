import { db } from "@/drizzle/drizzle-db";
import {
  cashFlowEntry,
  cashFlowCategory,
  cashFlowClient,
  cashFlowImport,
} from "@/drizzle/schema";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { DipendentiInCloudApi } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import { serverEnv } from "@/env/server-env";

// Funzione di import da Fatture in Cloud
export async function importFromFattureInCloud(fatture: Array<any>) {
  // Mapping: fatture inviate = entrate, ricevute = uscite
  for (const fattura of fatture) {
    const isIncome = fattura.tipo === "inviata";
    // Trova/crea categoria
    const categoryName = isIncome ? "Fatture emesse" : "Fatture ricevute";
    let [category] = await db
      .select()
      .from(cashFlowCategory)
      .where(cashFlowCategory.name.eq(categoryName));
    if (!category) {
      [category] = await db
        .insert(cashFlowCategory)
        .values({ name: categoryName, type: isIncome ? "income" : "expense" })
        .returning();
    }
    // Trova/crea cliente
    let client = null;
    if (isIncome && fattura.cliente) {
      [client] = await db
        .select()
        .from(cashFlowClient)
        .where(cashFlowClient.name.eq(fattura.cliente));
      if (!client) {
        [client] = await db
          .insert(cashFlowClient)
          .values({ name: fattura.cliente, externalId: fattura.cliente_id })
          .returning();
      }
    }
    // Inserisci voce cash flow
    await db.insert(cashFlowEntry).values({
      date: new Date(fattura.data),
      amount: fattura.importo,
      description: fattura.descrizione || fattura.numero,
      categoryId: category.id,
      clientId: client?.id,
      source: "fatture_in_cloud",
      externalId: fattura.id,
      isIncome,
    });
  }
}

// Funzione di import da Pubblica Web (stipendi)
export async function importFromPubblicaWeb(stipendi: Array<any>) {
  // Categoria stipendi
  let [category] = await db
    .select()
    .from(cashFlowCategory)
    .where(cashFlowCategory.name.eq("Stipendi"));
  if (!category) {
    [category] = await db
      .insert(cashFlowCategory)
      .values({ name: "Stipendi", type: "expense" })
      .returning();
  }
  for (const stipendio of stipendi) {
    await db.insert(cashFlowEntry).values({
      date: new Date(stipendio.data),
      amount: stipendio.importo,
      description: stipendio.descrizione || stipendio.nome,
      categoryId: category.id,
      source: "pubblica_web",
      externalId: stipendio.id,
      isIncome: false,
    });
  }
}

// Funzione di import da Excel
export async function importFromExcel(
  rows: Array<any>,
  filename: string,
  importedBy?: string,
) {
  // Traccia import
  const [importRecord] = await db
    .insert(cashFlowImport)
    .values({
      filename,
      importedAt: new Date(),
      importedBy,
    })
    .returning();
  for (const row of rows) {
    // Mapping: row.type ('income'/'expense'), row.category, row.amount, row.date, row.description, row.client
    let [category] = await db
      .select()
      .from(cashFlowCategory)
      .where(cashFlowCategory.name.eq(row.category));
    if (!category) {
      [category] = await db
        .insert(cashFlowCategory)
        .values({ name: row.category, type: row.type })
        .returning();
    }
    let client = null;
    if (row.client) {
      [client] = await db
        .select()
        .from(cashFlowClient)
        .where(cashFlowClient.name.eq(row.client));
      if (!client) {
        [client] = await db
          .insert(cashFlowClient)
          .values({ name: row.client })
          .returning();
      }
    }
    await db.insert(cashFlowEntry).values({
      date: new Date(row.date),
      amount: row.amount,
      description: row.description,
      categoryId: category.id,
      clientId: client?.id,
      source: "excel",
      externalId: importRecord.id.toString(),
      isIncome: row.type === "income",
    });
  }
}

// Sincronizza fatture e clienti da Fatture in Cloud
export async function syncCashFlowFromFattureInCloud() {
  const fatture = await fattureInCloudApiClient.getInvoices();
  await importFromFattureInCloud(fatture);
}

// Sincronizza clienti da k-clients
export async function syncCashFlowFromKClients() {
  const clienti = await kClientsServer.listAll();
  for (const c of clienti) {
    let [client] = await db
      .select()
      .from(cashFlowClient)
      .where(cashFlowClient.name.eq(c.name));
    if (!client) {
      await db.insert(cashFlowClient).values({ name: c.name });
    }
  }
}

// Sincronizza stipendi da Dipendenti in Cloud
export async function syncCashFlowFromDipendentiInCloud() {
  const api = new DipendentiInCloudApi(
    serverEnv.dipendentiInCloudPersistentToken,
    serverEnv.dipendentiInCloudApiEndpoint,
  );
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  // Recupera payrolls per gli ultimi 2 anni
  const payrollsHistory = await api.getPayrollsHistory([
    previousYear,
    currentYear,
  ]);
  // Categoria stipendi
  let [category] = await db
    .select()
    .from(cashFlowCategory)
    .where(cashFlowCategory.name.eq("Stipendi"));
  if (!category) {
    [category] = await db
      .insert(cashFlowCategory)
      .values({ name: "Stipendi", type: "expense" })
      .returning();
  }
  for (const employee of payrollsHistory) {
    for (const year of Object.keys(employee.salaries)) {
      for (const stipendio of employee.salaries[year]) {
        await db.insert(cashFlowEntry).values({
          date: new Date(stipendio.date),
          amount: stipendio.net,
          description: `Stipendio netto ${employee.employeeName}`,
          categoryId: category.id,
          source: "dipendenti_in_cloud",
          externalId: stipendio.dipendentiInCloudPayrollId?.toString(),
          isIncome: false,
        });
      }
    }
  }
}

// Sincronizza stipendi da Pubblica Web
export async function syncCashFlowFromPubblicaWeb() {
  const api = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword,
  );
  await api.authenticate();
  // TODO: implementa recupero stipendi/costi e import come uscite
}
