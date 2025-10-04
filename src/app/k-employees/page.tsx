import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/employees");
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
