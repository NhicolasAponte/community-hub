"use client";

import { useState } from "react";
import AdminSidebar from "@/components/nav/admin-sidebar";
import SidebarToggle from "@/components/nav/sidebar-toggle";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false); // Start closed on mobile

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile backdrop overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        className={`
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        onClose={() => setShowSidebar(false)}
      />

      {/* Content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header with sidebar toggle */}
        <header className="flex items-center p-4 border-b border-border lg:hidden">
          <SidebarToggle
            isOpen={showSidebar}
            onToggle={() => setShowSidebar((prev) => !prev)}
          />
          <h1 className="ml-4 text-lg font-semibold text-foreground">Admin Panel</h1>
        </header>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}