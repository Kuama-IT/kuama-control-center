import { serverEnv } from "@/env/server-env";
import {
  ClientsApi,
  Configuration,
  IssuedDocument,
  IssuedDocumentsApi,
  ListIssuedDocumentsResponse,
  ListSuppliersResponse,
  ReceivedDocument,
  Supplier,
  SuppliersApi,
} from "@fattureincloud/fattureincloud-ts-sdk";
import type { ListClientsResponse } from "@fattureincloud/fattureincloud-ts-sdk/src/models";
import type { Client } from "@fattureincloud/fattureincloud-ts-sdk/src/models/client";

export class FattureInCloudApi {
  private readonly suppliersApi: SuppliersApi;
  private readonly clientsApi: ClientsApi;
  private readonly baseEndpoint = "https://api-v2.fattureincloud.it/c/";
  private readonly baseHeaders: Headers;

  constructor(
    public readonly apiToken: string,
    public readonly companyId: string
  ) {
    const apiConfig = new Configuration({
      accessToken: apiToken,
    });
    this.suppliersApi = new SuppliersApi(apiConfig);
    this.clientsApi = new ClientsApi(apiConfig);
    this.baseHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiToken}`,
    });
  }

  async getSuppliers(): Promise<Supplier[]> {
    const suppliers: Supplier[] = [];
    let hasNextPage = true;
    let url = `${this.baseEndpoint}${this.companyId}/entities/suppliers?per_page=100`;
    while (hasNextPage) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.baseHeaders,
      });
      const data: ListSuppliersResponse = await res.json();
      suppliers.push(...(data.data ?? []));
      hasNextPage = data.next_page_url !== null;
      url = data.next_page_url ?? "";
    }

    return suppliers;
  }

  async getClients(): Promise<Client[]> {
    const clients: Client[] = [];
    let hasNextPage = true;
    let url = `${this.baseEndpoint}${this.companyId}/entities/clients?per_page=100`;
    while (hasNextPage) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.baseHeaders,
      });
      const data: ListClientsResponse = await res.json();
      clients.push(...(data.data ?? []));
      hasNextPage = data.next_page_url !== null;
      url = data.next_page_url ?? "";
    }

    return clients;
  }

  async getIssuedInvoices(params?: {
    date_from?: Date;
    date_to?: Date;
  }): Promise<Array<IssuedDocument>> {
    const invoices: Array<IssuedDocument> = [];

    // format dates: YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const p = new IssuedDocumentsApi();
    // Build query parameters (note: issued documents API doesn't support date filtering)
    const queryParams = new URLSearchParams({
      type: "invoice",
      per_page: "100",
      fieldset: "detailed",
    });
    if (params?.date_from && params?.date_to) {
      queryParams.append(
        "q",
        `date>='${formatDate(params.date_from)}' AND date<='${formatDate(params.date_to)}'`
      );
    }

    let url: string | undefined | null =
      `${this.baseEndpoint}${this.companyId}/issued_documents?${queryParams.toString()}`;

    while (url) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.baseHeaders,
      });
      const data: ListIssuedDocumentsResponse = await res.json();
      invoices.push(...(data.data ?? []));
      url = data.next_page_url;
    }

    // Filter by date after fetching (since API doesn't support date filtering)
    if (params?.date_from || params?.date_to) {
      return invoices.filter((invoice) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date);

        if (params.date_from) {
          const fromDate = new Date(params.date_from);
          if (invoiceDate < fromDate) return false;
        }

        if (params.date_to) {
          const toDate = new Date(params.date_to);
          if (invoiceDate > toDate) return false;
        }

        return true;
      });
    }

    return invoices;
  }

  async getReceivedInvoices(params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<Array<ReceivedDocument>> {
    const receivedInvoices: Array<ReceivedDocument> = [];

    // Build query parameters (note: received documents API doesn't support date filtering)
    const queryParams = new URLSearchParams({
      type: "expense",
      per_page: "100",
    });

    let url: string | undefined | null =
      `${this.baseEndpoint}${this.companyId}/received_documents?${queryParams.toString()}`;

    while (url) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.baseHeaders,
      });
      const data: any = await res.json();
      receivedInvoices.push(...(data.data ?? []));
      url = data.next_page_url;
    }

    // Filter by date after fetching (since API doesn't support date filtering)
    if (params?.date_from || params?.date_to) {
      return receivedInvoices.filter((invoice) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date);

        if (params.date_from) {
          const fromDate = new Date(params.date_from);
          if (invoiceDate < fromDate) return false;
        }

        if (params.date_to) {
          const toDate = new Date(params.date_to);
          if (invoiceDate > toDate) return false;
        }

        return true;
      });
    }

    return receivedInvoices;
  }
}

export const fattureInCloudApiClient = new FattureInCloudApi(
  serverEnv.fattureInCloudApiPersistentToken,
  serverEnv.fattureInCloudCompanyId
);
