import NavigationHeader from "@/components/nav/admin-nav-header";
import React from "react";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavigationHeader />
      <main className="max-w-5xl mx-auto px-4">{children}</main>
    </div>
  );
}