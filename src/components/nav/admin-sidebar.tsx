// components/nav/admin-sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // helper to join class names
import { AdminSidebarRoutes } from "@/lib/routes";

const links = AdminSidebarRoutes;
// [
//   // { href: "/admin/dashboard", label: "Dashboard" },
//   { href: "/admin/vendors", label: "Manage Vendors" },
//   { href: "/admin/events", label: "Manage Events" },
//   // { href: "/admin/settings", label: "Settings" },
// ];

export default function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "w-64 min-h-screen border-r border-border bg-card text-card-foreground p-4 transition-colors",
        className
      )}
      aria-label="Admin navigation"
    >
      <ul className="space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "block px-3 py-2 rounded-md hover:bg-muted hover:text-foreground transition-colors",
                pathname.startsWith(href) && "bg-muted text-foreground font-medium"
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
