"use client";

import Link from "next/link";
import { stations } from "@/content/stations";
import { motion } from "motion/react";
import { TopoSVG } from "./TopoSVG";

const motifSymbols: Record<string, string> = {
  observatory: "◐",
  cabin: "⌂",
  radio: "Ⲁ",
  crystal: "◇",
  compass: "✦",
  notebook: "≣",
};

export function MobileMap() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 -z-10">
        <TopoSVG />
      </div>

      <div className="px-4 pt-28 pb-6">
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-gold-400)]">
          Atlas · sheet 01
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] text-balance">
          Mathematics<br />into <span className="font-display-italic text-[var(--color-gold-400)]">software.</span>
        </h1>
        <p className="mt-4 text-[var(--muted)] text-base">
          A small atlas of how a mathematician thinks, what an engineer ships,
          and the routes between them. Pick a station to explore.
        </p>
      </div>

      <ol className="px-4 space-y-3 pb-12">
        {stations.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={s.href} className="block">
              <div className="glow-card rounded-2xl p-4 active:scale-[0.99] transition-transform">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-gold-400)]">
                    {s.glyph} · {s.subtitle}
                  </p>
                  <span
                    aria-hidden
                    className="text-2xl text-[var(--color-gold-400)] leading-none"
                  >
                    {motifSymbols[s.motif]}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl">{s.label}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{s.oneLiner}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-gold-400)]">
                  <span>Enter station</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
