import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/modules/auth/auth";
import { routes } from "@/modules/ui/routes";

export default async function SignIn() {
    const session = await auth();
    if (session?.user) {
        redirect(routes.dashboard());
    }
    return (
        <div className="flex min-h-[calc(100svh-(--spacing(32)))] flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-8 rounded-lg p-12 shadow-2xl">
                <h1 className="font-bold text-2xl uppercase">
                    {"Welcome, you are."} <br />
                    {"Sign in, you must."}
                </h1>
                <form
                    action={async () => {
                        "use server";
                        await signIn("youtrack", {
                            redirectTo: routes.dashboard(),
                        });
                    }}
                >
                    <Button size="lg" type="submit" className="flex gap-4 p-8">
                        <Image
                            alt="You Track"
                            width={32}
                            height={32}
                            src="/youtrack-logo.svg"
                        />
                        {"Sign in with YouTrack"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
