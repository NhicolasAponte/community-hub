import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/layouts/admin-layout-client";

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
  if (session.user.role !== "admin") {
    redirect("/auth/error?error=AccessDenied");
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
