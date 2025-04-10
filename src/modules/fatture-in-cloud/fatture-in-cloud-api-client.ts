import { serverEnv } from "@/env/server-env";
import {
  ClientsApi,
  Configuration,
  IssuedDocument,
  ListIssuedDocumentsResponse,
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
    public readonly companyId: string,
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

  async getSuppliers() {
    const res = await fetch(
      `${this.baseEndpoint}${this.companyId}/entities/suppliers`,
      {
        method: "GET",
        headers: this.baseHeaders,
      },
    );
    return await res.json();
  }

  async getClients(): Promise<Array<Client>> {
    const clients: Array<Client> = [];
    let hasNextPage = true;
    while (hasNextPage) {
      const res = await fetch(
        `${this.baseEndpoint}${this.companyId}/entities/clients?per_page=100`,
        {
          method: "GET",
          headers: this.baseHeaders,
        },
      );
      const data: ListClientsResponse = await res.json();
      clients.push(...(data.data?.filter((it) => !!it.vat_number) ?? []));
      hasNextPage = data.next_page_url !== null;
    }

    return clients;
  }

  async getInvoices(): Promise<Array<IssuedDocument>> {
    const invoices: Array<IssuedDocument> = [];
    let url: string | undefined | null =
      `${this.baseEndpoint}${this.companyId}/issued_documents?type=invoice&per_page=100`;
    while (url) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.baseHeaders,
      });
      const data: ListIssuedDocumentsResponse = await res.json();
      invoices.push(...(data.data ?? []));
      url = data.next_page_url;
    }

    return invoices;
  }
}

export const fattureInCloudApiClient = new FattureInCloudApi(
  serverEnv.fattureInCloudApiPersistentToken,
  serverEnv.fattureInCloudCompanyId,
);
