import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { UserProfile } from "@/modules/auth/components/user-profile";
import type { ReactNode } from "react";
import { NavBar } from "@/modules/ui/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProfile />
        <div className="p-4 pb-32">{children}</div>
        <NavBar />
        <Toaster />
      </body>
    </html>
  );
}
