import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

declare module "next-auth" {
  interface User {
    role: "admin" | "agent" | "customer";
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: "male" | "female" | "other";
    age?: number;
    mustChangePassword: boolean;
    isPhoneVerified: boolean;
    aadhaarNumber?: string;
    passportNumber?: string;
    plan: string;
    subscriptionStatus: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      gender?: "male" | "female" | "other";
      age?: number;
      role: "admin" | "agent" | "customer";
      mustChangePassword: boolean;
      isPhoneVerified: boolean;
      aadhaarNumber?: string;
      passportNumber?: string;
      plan: string;
      subscriptionStatus: string;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    role: "admin" | "agent" | "customer";
    userId: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: "male" | "female" | "other";
    age?: number;
    mustChangePassword: boolean;
    isPhoneVerified: boolean;
    aadhaarNumber?: string;
    passportNumber?: string;
    plan: string;
    subscriptionStatus: string;
  }
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate input with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // 2. Connect to database
        await connectDB();

        // 3. Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          throw new Error("No account found with this email address.");
        }

        // 4. Check user is active
        if (user.status !== "active") {
          throw new Error("This account has been deactivated.");
        }

        // 5. Customers must have activated their account
        if (user.role === "customer" && !user.isActivated) {
          throw new Error(
            "Please verify your email address to activate your account.",
          );
        }

        // 6. Compare password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        // 7. Return user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          gender: user.gender,
          age: user.age,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
          isPhoneVerified: user.isPhoneVerified,
          aadhaarNumber: user.aadhaarNumber,
          passportNumber: user.passportNumber,
          plan: user.plan || "free",
          subscriptionStatus: user.subscriptionStatus || "active",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 365 days
  },
  // NOTE: Do NOT set pages.signIn here.
  // The proxy middleware handles admin login redirects for /admin routes,
  // and customer login is handled separately at /dashboard/login.
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id!;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.gender = user.gender;
        token.age = user.age;
        token.mustChangePassword = user.mustChangePassword;
        token.isPhoneVerified = user.isPhoneVerified;
        token.aadhaarNumber = user.aadhaarNumber;
        token.passportNumber = user.passportNumber;
        token.plan = (user as any).plan;
        token.subscriptionStatus = (user as any).subscriptionStatus;
      }

      // If trigger is "update", prioritize data passed from the client for instant UI response
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.firstName) token.firstName = session.firstName;
        if (session.lastName) token.lastName = session.lastName;
        if (session.phone) token.phone = session.phone;
        if (session.image) token.image = session.image;
        if (session.gender) token.gender = session.gender;
        if (session.age) token.age = session.age;
        return token;
      }

      // Refresh from DB if mid-session phone verification happens
      if (token.userId && !token.isPhoneVerified) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.userId)
            .select("name firstName lastName phone gender age isPhoneVerified image aadhaarNumber passportNumber plan subscriptionStatus")
            .lean();
          
          if (dbUser) {
            token.name = dbUser.name;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.phone = dbUser.phone;
            token.gender = dbUser.gender;
            token.age = dbUser.age;
            token.isPhoneVerified = dbUser.isPhoneVerified;
            token.image = dbUser.image;
            token.aadhaarNumber = dbUser.aadhaarNumber;
            token.passportNumber = dbUser.passportNumber;
            token.plan = dbUser.plan;
            token.subscriptionStatus = dbUser.subscriptionStatus;
          }
        } catch (error) {
          console.error("JWT Session refresh error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "admin" | "agent" | "customer";
        session.user.name = token.name as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.gender = token.gender as "male" | "female" | "other";
        session.user.age = token.age as number;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
        session.user.isPhoneVerified = token.isPhoneVerified as boolean;
        session.user.aadhaarNumber = token.aadhaarNumber as string;
        session.user.passportNumber = token.passportNumber as string;
        session.user.plan = token.plan as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        (session.user as any).image = token.image as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        // Allow same origin
        if (urlObj.origin === baseObj.origin) return url;
      } catch {
        // Invalid URL, fall through to baseUrl
      }
      return baseUrl;
    },
  },
});
