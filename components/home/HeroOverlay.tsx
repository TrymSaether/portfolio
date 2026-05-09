"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-rows-[1fr_auto] z-10">
      {/* Headline rail — wide on small screens, thinner left rail above xl
          so the 3D world has room to breathe and the right-side hover card
          has space to land. */}
      <div className="px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 max-w-2xl xl:max-w-md 2xl:max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[11px] tracking-[0.32em] uppercase text-[var(--accent)]"
        >
          Trym Sæther — sheet 01
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-balance text-5xl sm:text-7xl lg:text-[88px] xl:text-[68px] 2xl:text-[80px] leading-[0.98] text-[var(--fg)]"
        >
          Mathematics
          <br />
          <span className="font-display-italic text-[var(--accent)]">
            into software.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-md text-base sm:text-lg xl:text-base text-[var(--fg-soft)]/85 leading-relaxed"
        >
          I work where mathematics becomes software: numerical methods,
          simulation tools, compiler-adjacent workflows, and technical writing
          that keeps the reasoning visible.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex items-center gap-3 pointer-events-auto"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_0_60px_-15px_var(--accent)] hover:bg-[var(--accent-strong)] transition-colors"
          >
            Selected work
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            About
          </Link>
        </motion.div>
      </div>

      {/* Bottom legend — like a paper map's marginalia */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1.2 }}
        className="relative px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]/80"
      >
        <div>
          <p>scale 1 : non-linear</p>
          <p className="mt-1 text-[var(--accent)]">
            click a station to enter
          </p>
        </div>

        {/* Scroll cue, centered */}
        <div
          aria-hidden
          className="scroll-cue hidden sm:flex absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 flex-col items-center gap-1.5 text-[var(--muted)]/85"
        >
          <span>scroll</span>
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="0.5" y="0.5" width="13" height="21" rx="6.5" />
            <line x1="7" y1="5" x2="7" y2="10">
              <animate
                attributeName="y2"
                values="10;14;10"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </line>
          </svg>
        </div>

        <div className="hidden sm:block text-right">
          <p>compiled in trondheim</p>
          <p className="mt-1">63°25′N · 10°23′E</p>
        </div>
      </motion.div>
    </div>
  );
}
