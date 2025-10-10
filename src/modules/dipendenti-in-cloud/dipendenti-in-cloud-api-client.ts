import { serverEnv } from "@/env/server-env";
import {
  absenceReasonsResponseSchema,
  closuresResponseSchema,
  DipendentiInCloudEmployeeDetail,
  dipendentiInCloudEmployeeDetailResponseSchema,
  dipendentiInCloudEmployeesSchema,
  dipendentiInCloudTimesheetResponseSchema,
} from "@/modules/dipendenti-in-cloud/schemas/dipendenti-in-cloud-schemas";
import { format } from "date-fns";

export class DipendentiInCloudApi {
  constructor(
    public readonly apiToken: string,
    public readonly endpoint: string,
  ) {}

  private get authenticationHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.apiToken}`,
      },
    };
  }

  async getEmployees() {
    const endpoint = `${this.endpoint}employees?`;
    const encodedMagicSearchParams =
      "filter%5B0%5D%5Bfield%5D=active&filter%5B0%5D%5Bop%5D==&filter%5B0%5D%5Bvalue%5D=1";
    const rawResponse = await fetch(
      endpoint + encodedMagicSearchParams,
      this.authenticationHeaders,
    );
    const jsonResponse = await rawResponse.json();

    const parsed = dipendentiInCloudEmployeesSchema.parse(jsonResponse);

    const employees: DipendentiInCloudEmployeeDetail[] = [];
    for (const employee of parsed.data) {
      const endpoint = `${this.endpoint}employees/${employee.id}`;

      const rawResponse = await fetch(endpoint, this.authenticationHeaders);
      const jsonResponse = await rawResponse.json();

      const employeeDetail =
        dipendentiInCloudEmployeeDetailResponseSchema.parse(jsonResponse).data;
      employees.push(employeeDetail);
    }
    return employees;
  }

  async getMonthlyTimesheet(from: Date, to: Date, employees: { id: string }[]) {
    const formattedStartOfMonth = format(from, "yyyy-MM-dd");
    const formattedEndOfMonth = format(to, "yyyy-MM-dd");
    const employeesIds = employees.map((employee) => employee.id);
    const endpoint = `${this.endpoint}timesheet?`;
    const params = new URLSearchParams({
      employees: employeesIds.join(","),
      version: "2",
      date_from: formattedStartOfMonth,
      date_to: formattedEndOfMonth,
    });

    const rawResponse = await fetch(
      endpoint + params,
      this.authenticationHeaders,
    );

    const jsonResponse = await rawResponse.json();

    const parsed = dipendentiInCloudTimesheetResponseSchema.parse(jsonResponse);

    return parsed.data.timesheet;
  }

  /**
   * Sends payrolls to DipendentiInCloud. Be aware that this will still require manual confirmation from the user.
   */
  async sendPayrolls({
    fileName,
    content,
  }: {
    fileName: string;
    content: Uint8Array<ArrayBufferLike>;
  }) {
    const fileContentBase64 = Buffer.from(content).toString("base64");
    const res = await fetch(`${this.endpoint}payrolls/pending`, {
      ...this.authenticationHeaders,
      body: JSON.stringify({
        data: {
          files: [
            {
              filename: fileName,
              content: fileContentBase64,
              extension: "pdf", // because "we know"
              mimeType: "application/pdf", // because "we know"
              rawFile: {},
            },
          ],
        },
      }),
      method: "POST",
    });

    return res.ok;
  }

  async getAbsenceReasons() {
    const endpoint = `${this.endpoint}reasons`;
    const res = await fetch(endpoint, this.authenticationHeaders);
    const jsonResponse = await res.json();

    return absenceReasonsResponseSchema
      .parse(jsonResponse)
      .data.list.filter((it) => it.active === 1);
  }

  async getClosures() {
    const endpoint = `${this.endpoint}closures?`;
    const params = new URLSearchParams({
      per_page: "50",
      page: "1",
    });

    const rawResponse = await fetch(
      endpoint + params,
      this.authenticationHeaders,
    );

    const jsonResponse = await rawResponse.json();

    return closuresResponseSchema.parse(jsonResponse).data;
  }
}

// TODO would be better to create a factory that fetches data from client credentials
export const dipendentiInCloudApiClient = new DipendentiInCloudApi(
  serverEnv.dipendentiInCloudApiPersistentToken,
  serverEnv.dipendentiInCloudApiEndpoint,
);
