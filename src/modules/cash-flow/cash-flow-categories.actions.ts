"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { cashFlowCategoryService } from "./cash-flow-category.service";
import { CashFlowCategoryForm } from "./schemas/cash-flow-catefory-form.schema";

export const handledDeleteCashFlowCategory = handleServerErrors(
  async (id: string) => {
    const categoryId = parseInt(id, 10);
    return await cashFlowCategoryService.delete(categoryId);
  }
);

export const handledCreateCashFlowCategory = handleServerErrors(
  async (dto: CashFlowCategoryForm) => {
    return await cashFlowCategoryService.create(dto.name, dto.type);
  }
);

export const handledUpdateCashFlowCategory = handleServerErrors(
  async ({ id, ...dto }: CashFlowCategoryForm & { id: string }) => {
    const categoryId = parseInt(id, 10);
    return await cashFlowCategoryService.update(categoryId, dto.name);
  }
);

export const handledGetAllCashFlowCategory = handleServerErrors(async () => {
  return await cashFlowCategoryService.getAll();
});
