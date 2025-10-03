"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { cashFlowCategoryServer } from "./cash-flow-category.server";
import {
  cashFlowCategoryFormSchema,
  CashFlowCategoryForm,
} from "./schemas/cash-flow-catefory-form.schema";
import { cashFlowCategoryUpdateSchema } from "./schemas/cash-flow-category.update.schema";

export const handledDeleteCashFlowCategory = handleServerErrors(
  async (id: string) => {
    const categoryId = cashFlowCategoryUpdateSchema.shape.id.parse(
      Number(id),
    );
    await cashFlowCategoryServer.remove(categoryId);
  }
);

export const handledCreateCashFlowCategory = handleServerErrors(
  async (dto: CashFlowCategoryForm) => {
    const input = cashFlowCategoryFormSchema.parse(dto);
    await cashFlowCategoryServer.create(input);
  }
);

export const handledUpdateCashFlowCategory = handleServerErrors(
  async ({ id, ...dto }: CashFlowCategoryForm & { id: string }) => {
    const data = cashFlowCategoryUpdateSchema.parse({
      id: Number(id),
      name: dto.name,
    });
    await cashFlowCategoryServer.update(data);
  }
);

export const handledGetAllCashFlowCategory = handleServerErrors(async () => {
  return await cashFlowCategoryServer.list();
});
