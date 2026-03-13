import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "customer";
};

export async function verifySession(): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return session.user as SessionUser;
}
