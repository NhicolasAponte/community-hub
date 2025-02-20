"use client";
import { HomePage, NavHeaderRoutes } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Header() {
  const pathName = usePathname();
  return (
    <header className="flex justify-between items-center p-4 bg-zinc-500 text-white">
      <div>
        <Link href={HomePage.href}>Home</Link>
      </div>
      <nav className="flex items-center space-x-4 lg:space-x-6 md:block">
        {NavHeaderRoutes.map((route, index) => (
          <Button
            key={index}
            asChild
            variant={pathName === route.href ? "default" : "ghost"}
          >
            <Link href={route.href}>
              <h2 className="text-lg font-medium transition-colors">
                {route.label}
              </h2>
            </Link>
          </Button>
        ))}
      </nav>
      <div>
        <Link href="/login" className=" hover:text-blue-300">
          Login
        </Link>
      </div>
    </header>
  );
}
