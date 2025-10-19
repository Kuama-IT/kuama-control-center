import { type EmployeeRead } from "@/modules/employees/schemas/employee-read";
import { type PlatformCredentialsRead } from "@/modules/platform-credentials/schemas/platform-credentials.schemas";
import { type ProjectRead } from "@/modules/projects/schemas/projects.read.schema";

export type PlatformCredentialReadExtended = PlatformCredentialsRead & {
    employee?: EmployeeRead;
    project?: ProjectRead;
};
