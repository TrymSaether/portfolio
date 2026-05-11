import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface SectionProps {
  kicker?: string;
  index?: string;
  title?: ReactNode;
  lede?: ReactNode;
  className?: string;
  children?: ReactNode;
  align?: "left" | "center";
}

export function Section({
  kicker,
  index,
  title,
  lede,
  className,
  children,
  align = "left",
}: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        "py-20 sm:py-28",
        className,
      )}
    >
      {(kicker || index) && (
        <div
          className={cn(
            "flex items-center gap-3 mb-8",
            align === "center" && "justify-center",
          )}
        >
          {index && (
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)]">
              {index}
            </span>
          )}
          {kicker && (
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
              {kicker}
            </p>
          )}
          <span aria-hidden className="flex-1 hairline" />
        </div>
      )}
      {title && (
        <h2
          className={cn(
            "font-display text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-4xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {title}
        </h2>
      )}
      {lede && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-lg text-[var(--text)]",
            align === "center" && "mx-auto text-center",
          )}
        >
          {lede}
        </p>
      )}
      {children && <div className={cn(title || lede ? "mt-12 sm:mt-16" : "")}>{children}</div>}
    </section>
  );
}
