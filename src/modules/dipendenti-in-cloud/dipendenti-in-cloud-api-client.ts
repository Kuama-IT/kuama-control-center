import { serverEnv } from "@/env/server-env";
import {
  DipendentiInCloudEmployee,
  dipendentiInCloudEmployeesSchema,
  dipendentiInCloudPayrollsSchema,
  dipendentiInCloudTimesheetResponseSchema,
} from "@/modules/dipendenti-in-cloud/schemas/dipendenti-in-cloud-schemas";
import { endOfMonth, startOfMonth, format } from "date-fns";

class DipendentiInCloudApi {
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

    return parsed.data;
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

  async getPayrolls(id: number, year: number) {
    const endpoint = `${this.endpoint}payrolls?`;
    const params = new URLSearchParams({
      employee_id: id.toString(),
      year: year.toString(),
    });

    const rawResponse = await fetch(
      endpoint + params,
      this.authenticationHeaders,
    );

    const jsonResponse = await rawResponse.json();
    const parsed = dipendentiInCloudPayrollsSchema.parse(jsonResponse);

    return parsed.data;
  }
}

export const dipendentiInCloudApiClient = new DipendentiInCloudApi(
  serverEnv.dipendentiInCloudApiPersistentToken,
  serverEnv.dipendentiInCloudApiEndpoint,
);
