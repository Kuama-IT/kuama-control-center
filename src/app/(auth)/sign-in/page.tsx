import SignIn from "@/modules/auth/components/sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | K1 App",
  description: "Sign in | Kuama Control Center",
};

export default async function Page() {
  return <SignIn />;
}
