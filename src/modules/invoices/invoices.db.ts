import { endOfYear, format, startOfYear } from "date-fns";
import { and, between, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { db } from "@/drizzle/drizzle-db";
import { invoices, invoicesSuppliers } from "@/drizzle/schema";

export const invoicesDb = {
    async getAllBySupplierIdAndYear(supplierId: number, year?: Date) {
        const res = await db
            .select({ invoiceId: invoicesSuppliers.invoiceId })
            .from(invoicesSuppliers)
            .where(eq(invoicesSuppliers.supplierId, supplierId));

        let start: Date | undefined;
        let end: Date | undefined;
        if (year) {
            start = startOfYear(year);
            end = endOfYear(year);
        }

        const wheres = [
            inArray(
                invoices.id,
                res.map((it) => it.invoiceId),
            ),
            start && end
                ? between(
                      invoices.date,
                      format(start, "yyyy-MM-dd"),
                      format(end, "yyyy-MM-dd"),
                  )
                : undefined,
        ].filter(Boolean);
        const condition = and(...wheres);
        return db.select().from(invoices).where(condition);
    },
};
