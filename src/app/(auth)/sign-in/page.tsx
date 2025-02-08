import SignIn from "@/modules/auth/components/sign-in";
import { auth } from "@/modules/auth/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <h1>Sign In</h1>

      {JSON.stringify(session)}

      <SignIn />
    </div>
  );
}
