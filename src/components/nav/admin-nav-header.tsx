"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navTabs = [
  { name: "Home", href: "/misty-mountain" },
  { name: "Vendors", href: "/misty-mountain/vendors" },
  { name: "Events", href: "/misty-mountain/events" },
  { name: "About", href: "/misty-mountain/about" },
  { name: "Resources", href: "/misty-mountain/resources" },
];

function NavigationHeader() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 px-6 py-4 mb-8">
      <ul className="flex space-x-6">
        {navTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <li key={tab.name}>
              <Link
                href={tab.href}
                className={`px-3 py-2 rounded text-white transition ${
                  isActive
                    ? "bg-green-500 font-bold"
                    : "hover:bg-slate-700"
                }`}
              >
                {tab.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default NavigationHeader;