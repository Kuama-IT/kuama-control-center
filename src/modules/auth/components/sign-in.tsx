import { signIn } from "@/modules/auth/auth";
import { Button } from "@/components/ui/button";

export default async function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("youtrack", { redirectTo: "/k-dashboard" });
      }}
    >
      <Button size="lg" type="submit">
        Sign in with YouTrack
      </Button>
    </form>
  );
}
