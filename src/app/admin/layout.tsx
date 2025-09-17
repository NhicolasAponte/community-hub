import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/layouts/admin-layout-client";
import { UserRoles } from "@/lib/data-model/enum-types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Redirect if not admin
  if (session.user.role !== UserRoles.ADMIN) {
    redirect("/auth/error?error=AccessDenied");
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
