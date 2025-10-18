import {
    Configuration,
    type IssuedDocument,
    type ListIssuedDocumentsResponse,
    type ListReceivedDocumentsTypeEnum,
    type ListSuppliersResponse,
    type ReceivedDocument,
    ReceivedDocumentsApi,
    type Supplier,
} from "@fattureincloud/fattureincloud-ts-sdk";
import { type ListClientsResponse } from "@fattureincloud/fattureincloud-ts-sdk/src/models";
import { type Client } from "@fattureincloud/fattureincloud-ts-sdk/src/models/client";
import { format } from "date-fns";

import { serverEnv } from "@/env/server-env";

const _formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
};

export class FattureInCloudApi {
    private readonly baseEndpoint = "https://api-v2.fattureincloud.it/c/";
    private readonly baseHeaders: Headers;

    constructor(
        public readonly apiToken: string,
        public readonly companyId: string,
    ) {
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
    }): Promise<IssuedDocument[]> {
        const invoices: IssuedDocument[] = [];

        // format dates: YYYY-MM-DD

        // Build query parameters (note: issued documents API doesn't support date filtering)
        const queryParams = new URLSearchParams({
            type: "invoice",
            per_page: "100",
            fieldset: "detailed",
        });
        if (params?.date_from && params?.date_to) {
            queryParams.append(
                "q",
                `date>='${_formatDate(params.date_from)}' AND date<='${_formatDate(params.date_to)}'`,
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

        // // Filter by date after fetching (since API doesn't support date filtering)
        // if (params?.date_from || params?.date_to) {
        //     return invoices.filter((invoice) => {
        //         if (!invoice.date) return false;
        //
        //         const invoiceDate = new Date(invoice.date);
        //
        //         if (params.date_from) {
        //             const fromDate = new Date(params.date_from);
        //             if (invoiceDate < fromDate) return false;
        //         }
        //
        //         if (params.date_to) {
        //             const toDate = new Date(params.date_to);
        //             if (invoiceDate > toDate) return false;
        //         }
        //
        //         return true;
        //     });
        // }

        return invoices;
    }

    async getReceivedInvoices(params: {
        from: Date;
        to: Date;
    }): Promise<ReceivedDocument[]> {
        const receivedInvoices: ReceivedDocument[] = [];

        const apiConfig = new Configuration({
            accessToken: this.apiToken,
        });

        const api = new ReceivedDocumentsApi(apiConfig);

        const requests = (
            [
                "expense",
                "passive_credit_note",
                "passive_delivery_note",
                "self_invoice",
            ] as ListReceivedDocumentsTypeEnum[]
        ).map(async (type) => {
            let responses: ReceivedDocument[] = [];
            let total = Number.MAX_SAFE_INTEGER;
            let page = 1;
            while (responses.length !== total) {
                const res = await api.listReceivedDocuments(
                    Number(this.companyId),
                    type,
                    undefined,
                    undefined,
                    undefined,
                    page,
                    100,
                    `date>='${_formatDate(params.from)}' AND date<='${_formatDate(params.to)}'`,
                    {
                        adapter: "fetch",
                    },
                );
                responses.push(...(res.data.data ?? []));
                if (!res.data.total) {
                    break;
                }
                page += 1;
                total = res.data.total;
            }
            return responses;
        });

        const responses = await Promise.all(requests);

        for (const response of responses) {
            receivedInvoices.push(...response);
        }

        return receivedInvoices;
    }
}

export const fattureInCloudApiClient = new FattureInCloudApi(
    serverEnv.fattureInCloudApiPersistentToken,
    serverEnv.fattureInCloudCompanyId,
);
