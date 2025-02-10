import NextAuth, { type DefaultSession } from "next-auth";
import { serverEnv } from "@/env/server-env";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Whether the user is admin inside YouTrack. */
      isAdmin: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "youtrack",
      name: "YouTrack",
      type: "oauth",
      issuer: serverEnv.youtrackAuthIssuer,
      clientId: serverEnv.youtrackAuthClientId,
      clientSecret: serverEnv.youtrackAuthClientSecret,

      authorization: {
        params: {
          scope: "openid",
        },
      },
      wellKnown: `${serverEnv.youtrackAuthIssuer}/.well-known/openid-configuration`,
      token: `${serverEnv.youtrackAuthIssuer}/api/rest/oauth2/token`,
      userinfo: `${serverEnv.youtrackAuthIssuer}/api/rest/oauth2/userinfo`,
    },
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session }) {
      session.user.isAdmin = await youtrackApiClient.checkIsAdmin(
        session.user.email,
      );
      console.log("session", session.user.isAdmin);
      return session;
    },

    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  debug: serverEnv.isDev,
});
