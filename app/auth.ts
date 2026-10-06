console.log("GOOGLE CLIENT ID =", process.env.AUTH_GOOGLE_ID);
console.log(
  "GOOGLE SECRET EXISTS =",
  Boolean(process.env.AUTH_GOOGLE_SECRET)
);

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.email) {
        token.role =
          profile.email === "fifanattapol2549@gmail.com"
            ? "admin"
            : "user";
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role ?? "user",
        },
      };
    },
  },
});