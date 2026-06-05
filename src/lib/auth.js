import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import { getRoleHome } from "@/lib/roles";
import { User } from "@/models";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        // --- DEMO CREDENTIALS BYPASS ---
        if (email === "tenant@demo.com" && password === "demo") {
          return { id: "60d5ecb8b392d700153ee101", name: "Hospital IT Admin", email: "tenant@demo.com", role: "tenant" };
        }
        if (email === "admin@demo.com" && password === "demo") {
          return { id: "60d5ecb8b392d700153ee102", name: "Dispatch Control", email: "admin@demo.com", role: "admin" };
        }
        if (email === "vendor@demo.com" && password === "demo") {
          return { id: "60d5ecb8b392d700153ee103", name: "Field Engineer", email: "vendor@demo.com", role: "vendor" };
        }
        // -------------------------------

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user || !await verifyPassword(password, user.passwordHash)) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "bioguard-local-development-secret",
};

export { getRoleHome };
