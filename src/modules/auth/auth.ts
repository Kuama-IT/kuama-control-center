import NextAuth from "next-auth";
import { serverEnv } from "@/env/server-env";

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
      // profile: (profile) => {
      //   console.log("profile", profile);
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: profile.email,
      //     emailVerified: profile.email_verified,
      //   };
      // },
      wellKnown: `${serverEnv.youtrackAuthIssuer}/.well-known/openid-configuration`,
      token: `${serverEnv.youtrackAuthIssuer}/api/rest/oauth2/token`,
      userinfo: `${serverEnv.youtrackAuthIssuer}/api/rest/oauth2/userinfo`,
    },
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // async session({ session, token }) {
    //   session.user = token.user;
    //   console.log("callbacks.session", session, token);
    //   return session;
    // },
    // async jwt({ token, user }) {
    //   console.log("callbacks.jwt", token, user);
    //   if (user) {
    //     token.user = user;
    //   }
    //   return token;
    // },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  debug: true, // TODO should be true only in dev mode
});
