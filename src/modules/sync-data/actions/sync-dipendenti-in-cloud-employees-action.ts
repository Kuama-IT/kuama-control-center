"use server";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees, lower } from "@/drizzle/schema";
import { eq, isNotNull } from "drizzle-orm";
import { z } from "zod";

export default async function syncDipendentiInCloudEmployees() {
  const employees = await dipendentiInCloudApiClient.getEmployees();
  for (const employee of employees) {
    await db
      .update(kEmployees)
      .set({
        dipendentiInCloudId: employee.id.toString(),
        birthdate: employee.birth_date,
        name: employee.first_name,
        surname: employee.last_name,
        hiredOn: employee.current_contract?.valid_from,
      })
      .where(eq(lower(kEmployees.email), employee.email.toLowerCase()));
  }
}
