import NextAuth from "next-auth";
import { serverEnv } from "@/env/server-env";
import "next-auth/jwt";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface User {
    /** Whether the user is admin inside YouTrack. */
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    isAdmin: boolean;
  }
}

export const { handlers, signIn, auth } = NextAuth({
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

      profile: (profile) => {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          isAdmin: profile.permissions?.includes("SYSTEM_ADMIN"),
        };
      },
    },
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }

      return token;
    },

    signIn: async ({ user }) => {
      if (!user.email) {
        return false;
      }
      if (user.isAdmin) {
        return true;
      }

      const employees = await dipendentiInCloudApiClient.getEmployees();
      return employees.some((employee) => employee.email === user.email);
    },

    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  debug: false,
});
