import {
    cashFlowCategoryFormSchema,
    CashFlowCategoryForm,
} from "./schemas/cash-flow-catefory-form.schema";
import {
    cashFlowCategoryUpdateSchema,
    CashFlowCategoryUpdate,
} from "./schemas/cash-flow-category.update.schema";
import { cashFlowCategoryDb } from "./cash-flow-category.db";
import { CashFlowCategoryRead } from "./schemas/cash-flow-category-read";

export const cashFlowCategoryServer = {
    async list(): Promise<CashFlowCategoryRead[]> {
        return await cashFlowCategoryDb.findAll();
    },

    async create(input: CashFlowCategoryForm): Promise<void> {
        const data = cashFlowCategoryFormSchema.parse(input);
        await cashFlowCategoryDb.insert(data);
    },

    async remove(id: number): Promise<void> {
        const parsedId = cashFlowCategoryUpdateSchema.shape.id.parse(id);
        await cashFlowCategoryDb.deleteById(parsedId);
    },

    async update(input: CashFlowCategoryUpdate): Promise<void> {
        const data = cashFlowCategoryUpdateSchema.parse(input);
        await cashFlowCategoryDb.updateName(data);
    },
};
