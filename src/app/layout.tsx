import { type Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { UserProfile } from "@/modules/auth/components/user-profile";
import { NavBar } from "@/modules/ui/components/navbar";
import Providers from "@/modules/ui/components/providers";

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
                <Providers>
                    <div className="pb-32 print:pb-0">{children}</div>
                </Providers>
                <NavBar />
                <Toaster />
            </body>
        </html>
    );
}
