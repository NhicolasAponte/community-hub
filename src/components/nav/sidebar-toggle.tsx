"use client";

import { Button } from "@/components/ui/button"; // assuming you have one or want to make one
import { Menu, X } from "lucide-react";

interface SidebarToggleProps {
  onToggle: () => void;
  isOpen?: boolean;
}

export default function SidebarToggle({ onToggle, isOpen = false }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      onClick={onToggle}
      className="lg:hidden"
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}