import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { UserProfile } from "@/modules/auth/components/user-profile";
import type { ReactNode } from "react";
import { NavBar } from "@/modules/ui/components/navbar";

const appFont = Roboto_Flex({
  variable: "--app-font",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "K1 App",
  description: "Kuama Control Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${appFont.variable} antialiased`}>
        <UserProfile />
        <div className="pb-32">{children}</div>
        <NavBar />
        <Toaster />
      </body>
    </html>
  );
}
