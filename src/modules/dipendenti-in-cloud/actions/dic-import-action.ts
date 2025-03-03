"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees, lower } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";

export default handleServerErrors(async () => {
  const dicEmployees = await dipendentiInCloudApiClient.getEmployees();

  await db.transaction(async (tx) => {
    for (const employee of dicEmployees) {
      const existingEmployee = await tx
        .select()
        .from(kEmployees)
        .where(eq(lower(kEmployees.email), employee.email.toLowerCase()));

      if (existingEmployee.length === 0) {
        await tx.insert(kEmployees).values({
          dipendentiInCloudId: employee.id.toString(),
          birthdate: employee.birth_date,
          name: employee.first_name,
          surname: employee.last_name,
          fullName: employee.full_name,
          hiredOn: employee.current_contract?.valid_from,
          email: employee.email,
        });
        continue;
      }
      await tx
        .update(kEmployees)
        .set({
          dipendentiInCloudId: employee.id.toString(),
          birthdate: employee.birth_date,
          name: employee.first_name,
          surname: employee.last_name,
          fullName: employee.full_name,
          hiredOn: employee.current_contract?.valid_from,
        })
        .where(eq(lower(kEmployees.email), employee.email.toLowerCase()));
    }
  });

  const query = await db.select({ count: count() }).from(kEmployees);
  const result = firstOrThrow(query);

  return {
    message: `Now you have ${result.count} employees`,
  };
});
