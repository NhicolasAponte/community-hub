"use client";

import { useState } from "react";
import AdminSidebar from "@/components/nav/admin-sidebar";
import SidebarToggle from "@/components/nav/sidebar-toggle";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      {showSidebar && (
        <AdminSidebar className="fixed z-40 lg:static lg:block" />
      )}

      {/* Content area */}
      <div
        className={`flex-1 flex flex-col transition-all ${
          showSidebar ? "ml-64" : "ml-0"
        }`}
      >
        {/* Sidebar toggle button (visible on small screens) */}
        <div className="p-4 lg:hidden">
          <SidebarToggle onToggle={() => setShowSidebar((prev) => !prev)} />
        </div>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}