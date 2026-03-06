import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "customer";
};

/**
 * Verifies the user is authenticated.
 * Used in Server Components and Server Actions.
 * Redirects to login if not authenticated.
 */
export async function verifySession(): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return session.user as SessionUser;
}
