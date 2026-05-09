"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "/", label: "Home", glyph: "○" },
  { href: "/about", label: "About", glyph: "I" },
  { href: "/work", label: "Work", glyph: "II" },
  { href: "/notes", label: "Notes", glyph: "III" },
  { href: "/projects", label: "Selected", glyph: "IV" },
  { href: "/personal", label: "Personal", glyph: "V" },
  { href: "/contact", label: "Contact", glyph: "VI" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            href="/"
            className="group flex items-center gap-2 text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
            aria-label="Trym Sæther — home"
          >
            <span className="font-display text-xl tracking-tight">
              Trym Sæther
            </span>
            <span className="hidden sm:inline-block opacity-50 text-xs font-mono mt-2">
              63°25′N · 10°23′E
            </span>
          </Link>

          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-1 px-1 py-1 rounded-full border border-[var(--line)] backdrop-blur-md bg-[color-mix(in_oklab,var(--bg-elevated)_70%,transparent)]">
              {links.map((l) => {
                const active =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                        active
                          ? "text-[var(--on-accent)]"
                          : "text-[var(--fg-soft)] hover:text-[var(--accent)]",
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-0 z-0 rounded-full bg-[var(--accent)]"
                        />
                      )}
                      <span className="relative z-10 font-mono text-[10px] opacity-60">
                        {l.glyph}
                      </span>
                      <span className="relative z-10">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm border border-[var(--line)] rounded-full px-3.5 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
              Available for work
            </Link>
          </div>

          {/* Mobile glyph row */}
          <nav className="md:hidden flex items-center gap-1">
            <ul className="flex items-center gap-0.5 rounded-full border border-[var(--line)] backdrop-blur-md bg-[color-mix(in_oklab,var(--bg-elevated)_70%,transparent)] px-1 py-1">
              {links.map((l) => {
                const active =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-label={l.label}
                      className={cn(
                        "inline-flex w-7 h-7 items-center justify-center rounded-full text-[10px] font-mono transition-colors",
                        active ? "bg-[var(--accent)] text-[var(--on-accent)]" : "text-[var(--fg-soft)]",
                      )}
                    >
                      {l.glyph}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
