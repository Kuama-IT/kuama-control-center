"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <Button
      className="w-full"
      onClick={async () => {
        await signOut({ redirectTo: "/sign-in" });
      }}
    >
      Logout
    </Button>
  );
};
