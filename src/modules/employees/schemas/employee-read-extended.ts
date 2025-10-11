import { PayslipRead } from "@/modules/payslips/schemas/payslip-read";
import { EmployeeRead } from "@/modules/employees/schemas/employee-read";

export type EmployeeReadExtended = Omit<
  EmployeeRead,
  "birthdate" | "hiredOn"
> & {
  birthdate: Date | null;
  hiredOn: Date | null;
  payslips: PayslipRead[];
  age: number | null;
  averageNet: number;
  averageCost: number;
  yearsWithCompany: number | null;
};
