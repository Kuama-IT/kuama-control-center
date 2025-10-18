import { type Metadata } from "next";
import SignIn from "@/modules/auth/components/sign-in";

export const metadata: Metadata = {
    title: "Sign in | K1 App",
    description: "Sign in | Kuama Control Center",
};

export default async function Page() {
    return <SignIn />;
}
