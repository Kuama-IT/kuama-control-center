"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { employeesServer } from "./employees.server";

export const listAllAction = handleServerErrors(employeesServer.listAll);
export const byIdAction = handleServerErrors(employeesServer.byId);
export const deleteAction = handleServerErrors(
  employeesServer.deleteEmployee,
);

export type EmployeesListAllActionResult = Awaited<
  ReturnType<typeof employeesServer.listAll>
>;
export type EmployeeByIdActionResult = Awaited<
  ReturnType<typeof employeesServer.byId>
>;
