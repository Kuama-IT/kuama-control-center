"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
// todo move out from here
export default function Dashboard() {
  return (
    <div>
      Hey dashboard{" "}
      <Button
        onClick={() => {
          signOut({ redirectTo: "/sign-in" });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
