"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // or your icon system of choice
import { Button } from "../ui/button"; // shadcn button
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/misty-mountain", label: "Admin" },
  { href: "/vendors", label: "Vendors" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/moving", label: "Moving to the Area" },
  // { href: "/login", label: "Login" },
];

export default function MobileNavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(()=>{
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="w-full px-4 py-3 border-b border-border bg-background text-foreground relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* TODO : Change this to be a logo instead of just a title */}
        <div className="text-lg font-semibold">The Queer Connection</div>

        {/* Hamburger toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="p-2 rounded-md hover:bg-muted transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-card border-t border-border shadow-md">
          <nav className="flex flex-col space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start">
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
