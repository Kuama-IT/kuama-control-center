import { serverEnv } from "@/env/server-env";
import {
  dipendentiInCloudEmployeesSchema,
  dipendentiInCloudPayrollsSchema,
  dipendentiInCloudTimesheetResponseSchema,
  EmployeeSalaryHistory,
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

  async getPayrollsHistory(years: number[]) {
    const employees = await this.getEmployees();
    const payrolls: EmployeeSalaryHistory[] = [];

    for (const employee of employees) {
      const employeePayrolls: EmployeeSalaryHistory = {
        name: employee.full_name,
        salaries: {},
      };
      for (const year of years) {
        employeePayrolls.salaries[year] = [];

        const payrolls = await this.getPayrolls(employee.id, year);
        for (const payroll of payrolls) {
          for (const attachment of payroll.attachments) {
            employeePayrolls.salaries[year].push({
              net: payroll.net,
              url: attachment.url,
              date: payroll.date,
            });
          }
        }
      }

      payrolls.push(employeePayrolls);
    }

    return payrolls;
  }
}

export const dipendentiInCloudApiClient = new DipendentiInCloudApi(
  serverEnv.dipendentiInCloudApiPersistentToken,
  serverEnv.dipendentiInCloudApiEndpoint,
);
