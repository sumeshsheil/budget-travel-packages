import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side auth guard for customer dashboard pages.
 * Redirects to /dashboard/login if not authenticated or not a customer.
 * Returns the session if valid.
 */
export async function requireCustomerAuth() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/?login=true");
  }

  if (
    session.user.role !== "customer" &&
    session.user.role !== "agent" &&
    session.user.role !== "admin"
  ) {
    redirect("/?login=true");
  }

  return session;
}
