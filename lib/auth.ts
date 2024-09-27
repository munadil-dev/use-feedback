import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./db";

interface GoogleProviderOptions {
  clientId: string;
  clientSecret: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    } as GoogleProviderOptions),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider !== "google") {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              image: user.image!,
            },
          });
        }

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    async jwt({ token }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: token.email!,
          },
        });

        if (existingUser) {
          token.uid = existingUser.id;
        }
      } catch (err) {
        console.error(err);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
      }

      return session;
    },
  },
});
