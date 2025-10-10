import { PayslipRead } from "@/modules/payslips/schemas/payslip-read";
import { EmployeeRead } from "@/modules/employees/schemas/employee-read";

export type EmployeeReadExtended = Omit<
  EmployeeRead,
  "birthdate" | "hiredOn"
> & {
  birthdate: Date | null;
  hiredOn: Date | null;
  payslips: Array<PayslipRead>;
  age: number | null;
  averagePayroll: number;
  yearsWithCompany: number | null;
};
