"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
    return (
        <Button
            className="w-full"
            onClick={async () => {
                await signOut({ redirectTo: "/sign-in" });
            }}
        >
            {"Logout"}
        </Button>
    );
};
