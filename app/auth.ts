import NextAuth, { type DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import Google from "next-auth/providers/google";
// *DO NOT* create a `Pool` here, outside the request handler.

declare module "next-auth" {
  interface Session {
    user: {
      userId: string
    } & DefaultSession["user"]
  }
}







export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

  return {
    adapter: NeonAdapter(pool),
    trustHost: true,
    providers: [Google],
    callbacks: {
      session({ session, user }) {
        session.user.userId = user.id;
        return session;
      },
    },
  };
});
