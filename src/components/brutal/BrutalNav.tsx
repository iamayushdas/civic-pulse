"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BrutalButton } from "./BrutalButton";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/report", label: "REPORT" },
  { href: "/map", label: "MAP" },
  { href: "/area", label: "AREA" },
  { href: "/login", label: "LOGIN" },
];

export function BrutalNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-b-2 border-civic-black bg-civic-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <span className="font-black text-xl sm:text-2xl tracking-tight leading-none">
              DELHI
            </span>
            <span className="hidden sm:block font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-civic-muted border-l-2 border-civic-black pl-3">
              CIVIC
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2 font-black uppercase text-xs sm:text-sm tracking-widest border-b-2 transition-colors",
                  isActive(l.href)
                    ? "border-civic-accent text-civic-accent"
                    : "border-transparent text-civic-black hover:text-civic-accent"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="/report">
              <BrutalButton variant="primary" className="!px-4 !py-2 text-xs">
                REPORT A PROBLEM →
              </BrutalButton>
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 border-2 border-civic-black bg-civic-white"
          >
            <span
              className={cn(
                "block w-5 h-0.5 bg-civic-black transition-transform duration-200",
                open && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-civic-black mt-1 transition-transform duration-200",
                open && "-translate-y-1 -rotate-45"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t-2 border-civic-black bg-civic-white transition-all duration-200 overflow-hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-3 font-black uppercase text-sm tracking-widest border-b-2 border-civic-black",
                isActive(l.href)
                  ? "bg-civic-accent text-civic-white"
                  : "text-civic-black"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}