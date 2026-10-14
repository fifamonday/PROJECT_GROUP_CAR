console.log("GOOGLE CLIENT ID =", process.env.AUTH_GOOGLE_ID);
console.log(
  "GOOGLE SECRET EXISTS =",
  Boolean(process.env.AUTH_GOOGLE_SECRET)
);

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// ตั้งค่า Login ด้วย Google (NextAuth)
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // ตอน login: อีเมลตรงกับ admin → role = admin ไม่งั้นเป็น user
    async jwt({ token, profile }) {
      if (profile?.email) {
        token.role =
          profile.email === "fifanattapol2549@gmail.com"
            ? "admin"
            : "user";
      }

      return token;
    },

    // ส่ง role จาก token ไปไว้ใน session ให้หน้าเว็บใช้
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