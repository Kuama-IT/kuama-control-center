import NextAuth from "next-auth";
import { serverEnv } from "@/env/server-env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "youtrack", // signIn("my-provider") and will be part of the callback URL
      name: "YouTrack", // optional, used on the default login page as the button text.
      type: "oauth", //"oidc", // or "oauth" for OAuth 2 providers
      issuer: serverEnv.youtrackAuthIssuer, // to infer the .well-known/openid-configuration URL
      clientId: serverEnv.youtrackAuthClientId, // from the provider's dashboard
      clientSecret: serverEnv.youtrackAuthClientSecret, // from the provider's dashboard
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
  debug: true,
});
