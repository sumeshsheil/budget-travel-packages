"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BlogHeader() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Blogs", href: "/blogs" },
    { name: "Domestic", href: "/blogs/domestic" },
    { name: "International", href: "/blogs/international" },
    { name: "Travel insights", href: "/blogs/insights" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container-box px-4">
        <div className="flex flex-row items-center justify-center lg:justify-between h-14 md:h-16 gap-3 md:gap-10 overflow-hidden">
          {/* Blogs Button Section */}
          <div className="shrink-0">
            {navLinks
              .filter((link) => link.name === "Blogs")
              .map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    <Home className="w-4 h-4 text-black" />
                    <span className="hidden text-black md:inline">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
          </div>

          {/* Categories Section */}
          <nav className="flex flex-1 items-center justify-between md:justify-start lg:justify-end gap-x-3 sm:gap-x-4 md:gap-x-8">
            {navLinks
              .filter((link) => link.name !== "Blogs")
              .map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[13px] xs:text-[12px] sm:text-[13px] md:text-sm font-bold transition-all whitespace-nowrap pb-1 border-b-2 ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-gray-500 border-transparent hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>
    </header>
  );
}
