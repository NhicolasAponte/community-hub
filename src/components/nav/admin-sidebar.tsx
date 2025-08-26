// components/nav/admin-sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // helper to join class names
import { AdminSidebarRoutes } from "@/lib/routes";
import { X } from "lucide-react";

const links = AdminSidebarRoutes;
// [
//   // { href: "/admin/dashboard", label: "Dashboard" },
//   { href: "/admin/vendors", label: "Manage Vendors" },
//   { href: "/admin/events", label: "Manage Events" },
//   // { href: "/admin/settings", label: "Settings" },
// ];

interface AdminSidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ className, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "w-64 min-h-screen border-r border-border bg-card text-card-foreground transition-colors",
        className
      )}
      aria-label="Admin navigation"
    >
      <div className="p-4 border-b border-border flex items-center justify-between lg:justify-center">
        <h2 className="text-lg font-semibold text-foreground">Admin Menu</h2>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => {
                  // Close sidebar on mobile when navigating
                  if (onClose && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={cn(
                  "block px-3 py-3 rounded-md hover:bg-muted hover:text-foreground transition-colors text-sm font-medium",
                  pathname.startsWith(href) && "bg-muted text-foreground font-semibold border-l-4 border-primary"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
