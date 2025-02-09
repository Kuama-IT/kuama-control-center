export { auth as middleware } from "@/modules/auth/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - sign-in
     * - /_next/*
     * - /favicon.ico
     *
     */
    "/((?!sign-in|_next/static|_next/image|.*\\.svg$|api\/auth|favicon.ico).*)",
  ],
};
