"use server";
import { employeesServer } from "./employees.server";
import { serverActionUtils } from "@/utils/server-actions.utils";

export const deleteAction = serverActionUtils.createSafeAction(
  employeesServer.deleteEmployee,
);

export const importFromDipendentiInCloudAndYouTrackAction =
  serverActionUtils.createSafeAction(
    employeesServer.importFromDipendentiInCloudAndYouTrack,
  );

// TODO mah...
export type EmployeesListAllActionResult = Awaited<
  ReturnType<typeof employeesServer.all>
>;
// TODO mah...
export type EmployeeByIdActionResult = Awaited<
  ReturnType<typeof employeesServer.get>
>;
