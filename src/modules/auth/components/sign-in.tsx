import { auth, signIn } from "@/modules/auth/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Image from "next/image";
export default async function SignIn() {
  const session = await auth();
  if (session?.user) {
    redirect("/k-dashboard");
  }
  return (
    <div className="h-svh w-svw flex flex-col items-center justify-center">
      <div className="p-12 rounded-lg shadow-2xl flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold uppercase">
          Welcome, you are. <br />
          Sign in, you must.
        </h1>
        <form
          action={async () => {
            "use server";
            await signIn("youtrack", { redirectTo: "/k-dashboard" });
          }}
        >
          <Button size="lg" type="submit" className="flex gap-4 p-8">
            <Image
              alt="You Track"
              width={32}
              height={32}
              src="/youtrack-logo.svg"
            />
            Sign in with YouTrack
          </Button>
        </form>
      </div>
    </div>
  );
}
