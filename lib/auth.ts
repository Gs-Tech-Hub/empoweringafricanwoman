import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

function getAllowedAdminEmails(): string[] {
  const envEmails = (process.env.ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(
    new Set([
      ...envEmails,
      ...(DEFAULT_ADMIN_EMAIL ? [DEFAULT_ADMIN_EMAIL] : []),
    ]),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailInput = credentials?.email as string | undefined;
        const passwordInput = credentials?.password as string | undefined;
        console.log("[auth] credentials authorize start", { emailInput, passwordProvided: Boolean(passwordInput) });

        if (!emailInput || !passwordInput) {
          console.log("[auth] credentials authorize missing input");
          return null;
        }

        const email = emailInput.toLowerCase();
        const allowedEmails = getAllowedAdminEmails();
        console.log("[auth] credentials authorize allowed emails", allowedEmails);

        if (!allowedEmails.includes(email)) {
          console.log("[auth] credentials authorize email not allowed", { email });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          console.log("[auth] credentials authorize user not found or no password", { email });
          return null;
        }

        const passwordMatch = await compare(passwordInput, user.password);
        console.log("[auth] credentials authorize password match", { email, passwordMatch });
        if (!passwordMatch) {
          return null;
        }

        const result = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
        console.log("[auth] credentials authorize success", result);
        return result;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      const allowed = getAllowedAdminEmails();
      console.log("[auth] signIn callback", { email, allowed });
      if (!email) return false;
      return allowed.includes(email);
    },
    async session({ session, token, user }) {
      const userId = user?.id ?? token?.sub ?? token?.id ?? token?.userId;
      if (session.user) {
        if (typeof userId === "string" && userId.length > 0) {
          session.user.id = userId;
        }
        console.log("[auth] session callback", { email: session.user.email, userId });
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export async function requireAdminSession() {
  const session = await auth();
  console.log("[auth] requireAdminSession", { hasSession: Boolean(session), email: session?.user?.email });
  if (!session?.user?.email) {
    return null;
  }

  const email = session.user.email.toLowerCase();
  if (!getAllowedAdminEmails().includes(email)) {
    console.log("[auth] requireAdminSession email not allowed", { email });
    return null;
  }

  return session;
}
