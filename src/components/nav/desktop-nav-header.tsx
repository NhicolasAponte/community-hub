"use client";
import { HomePage, NavRoutes } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function DesktopNavHeader() {
  const pathName = usePathname();

  return (
    <header className="w-full px-6 py-4 bg-card text-card-foreground shadow-sm border-b border-border">
      <div className="flex items-center max-w-7xl mx-auto">
        <div className="flex space-x-2">
          <Link
            href={HomePage.href}
            className="p-2 rounded-md hover:bg-muted hover:text-accent transition"
          >
            Home
          </Link>

        </div>

        <nav className="flex items-center space-x-2l mx-auto">
          {NavRoutes.map((route, index) => (
            <Button
              key={index}
              asChild
              variant={pathName === route.href ? "default" : "ghost"}
            >
              <Link href={route.href}>
                <span className="text-sm font-medium">{route.label}</span>
              </Link>
            </Button>
          ))}
        </nav>


      </div>
    </header>
  );
}
