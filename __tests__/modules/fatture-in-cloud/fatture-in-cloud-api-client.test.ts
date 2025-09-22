import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { describe, expect, test } from "vitest";

describe("fatture-in-cloud-api", () => {
  test("fake test", () => {
    expect(1).toBe(1);
  });

  // test("get clients", async () => {
  //   const clients = await fattureInCloudApiClient.getClients();
  //
  //   expect(clients.length).gt(15);
  // });
  //
  // test("get issued invoices", async () => {
  //   const invoices = await fattureInCloudApiClient.getIssuedInvoices();
  //
  //   expect(invoices.length).gt(15);
  // });
  test("get issued invoices with date range", async () => {
    const invoices = await fattureInCloudApiClient.getIssuedInvoices({
      date_from: new Date("2025-08-01"),
      date_to: new Date("2025-08-31"),
    });

    expect(invoices.length).gt(0);
  });
});
