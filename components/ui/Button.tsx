import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-gold-400)] text-[var(--color-ink-950)] hover:bg-[var(--color-gold-500)] shadow-[0_0_40px_-15px_var(--color-gold-400)]",
  ghost:
    "text-[var(--fg)] hover:text-[var(--color-gold-400)]",
  outline:
    "border border-[var(--line)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-400)]",
};

const base =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, styles[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, styles[variant], className)} {...rest}>
      {children}
    </Link>
  );
}
