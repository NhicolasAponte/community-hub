import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { UserRoles, UserRole } from "@/lib/data-model/enum-types";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use JWT strategy (no database adapter needed)
  session: {
    strategy: "jwt",
  },

  providers: [
    // Simple credentials provider for admin access
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Simple validation schema
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        try {
          // Look up user in database
          const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

          if (!user || !user.hashedPassword) {
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            password,
            user.hashedPassword
          );

          if (!passwordMatch) {
            return null;
          }

          // Return user data for session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),

    // Configure Google OAuth
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                role: determineUserRole(profile.email),
              };
            },
          }),
        ]
      : []),

    // Configure GitHub OAuth
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            profile(profile) {
              return {
                id: profile.id.toString(),
                name: profile.name || profile.login,
                email: profile.email,
                image: profile.avatar_url,
                role: determineUserRole(profile.email),
              };
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    // Persist role in JWT token
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    // Expose role in session for client-side access
    session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    // Control access at middleware level
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isAdmin = auth?.user?.role === UserRoles.ADMIN;

      // Allow access to non-admin routes
      if (!isAdminRoute) {
        return true;
      }

      // For admin routes, require authentication and admin role
      return isLoggedIn && isAdmin;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
});

/**
 * Helper function to determine user role based on email
 */
function determineUserRole(email: string | null): UserRole {
  if (!email) return UserRoles.USER;

  // Get admin emails from environment variable
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  return adminEmails.includes(email) ? UserRoles.ADMIN : UserRoles.USER;
}
