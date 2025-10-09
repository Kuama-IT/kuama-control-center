"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { employeesServer } from "./employees.server";

export const listAllAction = handleServerErrors(employeesServer.all);
export const byIdAction = handleServerErrors(employeesServer.get);
export const deleteAction = handleServerErrors(employeesServer.deleteEmployee);

export type EmployeesListAllActionResult = Awaited<
  ReturnType<typeof employeesServer.all>
>;
export type EmployeeByIdActionResult = Awaited<
  ReturnType<typeof employeesServer.get>
>;
