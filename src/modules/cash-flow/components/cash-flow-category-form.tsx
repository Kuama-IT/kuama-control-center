"use client";

import { useForm, Controller } from "react-hook-form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cashFlowCategoryFormSchema,
  type CashFlowCategoryForm,
} from "../schemas/cash-flow-catefory-form.schema";
import { type CashFlowCategoryRead } from "../schemas/cash-flow-category-read";
import {
  handledCreateCashFlowCategory,
  handledUpdateCashFlowCategory,
} from "../cash-flow-categories.actions";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CashFlowCategoryFormProps {
  category?: CashFlowCategoryRead;
}

export function CashFlowCategoryForm({ category }: CashFlowCategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CashFlowCategoryForm>({
    resolver: zodResolver(cashFlowCategoryFormSchema),
    defaultValues: category
      ? { name: category.name, type: category.type }
      : undefined,
  });

  const onSubmit = (data: CashFlowCategoryForm) => {
    startTransition(async () => {
      if (category) {
        // Update existing category
        const result = await handledUpdateCashFlowCategory({
          id: category.id.toString(),
          ...data,
        });

        if (isFailure(result)) {
          notifyError(result.message);
          return;
        }

        notifySuccess("Category updated successfully");
        router.refresh();
      } else {
        // Create new category
        const result = await handledCreateCashFlowCategory(data);

        if (isFailure(result)) {
          notifyError(result.message);
          return;
        }

        notifySuccess("Category created successfully");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter category name"
          className="mt-1"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? "Saving..."
          : category
            ? "Update Category"
            : "Create Category"}
      </Button>
    </form>
  );
}
