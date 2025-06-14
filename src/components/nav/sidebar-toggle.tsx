"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // assuming you have one or want to make one
import { Menu, X } from "lucide-react";

export default function SidebarToggle({
  onToggle,
}: {
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Button
      variant="ghost"
      onClick={() => {
        setOpen(!open);
        onToggle();
      }}
      className="lg:hidden"
      aria-label="Toggle sidebar"
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}