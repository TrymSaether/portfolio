import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Trym Sæther — mathematics, engineering, simulation software, compiler-adjacent tooling, and clear technical communication.",
};

const themes = [
  {
    glyph: "I",
    label: "Mathematical thinking",
    body: "I like starting from structure: what is conserved, what changes, which assumptions matter, and where a simpler representation reveals the problem.",
  },
  {
    glyph: "II",
    label: "Engineering mindset",
    body: "The implementation has to survive constraints. I care about interfaces, correctness, iteration speed, and how tools behave in real workflows.",
  },
  {
    glyph: "III",
    label: "Software craft",
    body: "Good software makes hard ideas easier to test, inspect, and extend. The code should carry the model without hiding the tradeoffs.",
  },
  {
    glyph: "IV",
    label: "Clear communication",
    body: "Writing is part of the work. Notes, diagrams, and explanations turn local understanding into something useful for a team.",
  },
];

export default function AboutPage() {
  return (
    <article className="bg-[var(--bg)] text-[var(--fg)] -mt-px">
      <Section
        kicker="Sheet 02 · About"
        index="I"
        title={
          <>
            First principles,
            <span className="font-display-italic"> then useful software.</span>
          </>
        }
        lede="I am Trym Sæther. My background spans Industrial Mathematics / Physics and Mathematics, Electrical Engineering, and simulation software development at Infineon."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Portrait card */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative rounded-2xl border border-[var(--line)] overflow-hidden">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#ddd0b6] via-[#c0a875] to-[#7a6a4a] relative">
                {/* Decorative monogram in lieu of photo — palette is intentionally constant */}
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-[180px] leading-none text-[#1c1a14] opacity-25 select-none">
                    T
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#1c1a14]">
                    Trym Sæther · mathematics into software
                  </p>
                </div>
              </div>
              <div className="p-6 bg-[var(--bg-elevated)] text-[var(--fg)]">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Focus
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>· Simulation software and scientific computing</li>
                  <li>· Numerical methods and finite elements</li>
                  <li>· Compiler-adjacent tooling for equation workflows</li>
                  <li>· Mathematical notes and technical communication</li>
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Editorial body */}
          <div className="lg:col-span-7 space-y-12">
            <Reveal>
              <p className="font-display text-2xl sm:text-3xl leading-snug text-balance">
                I like understanding systems from first principles, then shaping
                that understanding into software, models, notes, or tools that
                other people can work with.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-base leading-[1.7] max-w-[60ch]">
                The common thread is technical depth with practical output:
                numerical methods, simulation software, structured tooling,
                and explanations that keep the mathematical core visible.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <blockquote className="border-l border-[var(--line)] pl-6 sm:pl-8 my-2">
                <p className="font-display-italic text-2xl leading-snug text-balance">
                  Good software makes hard ideas easier to test, inspect, and
                  extend.
                </p>
                <footer className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
                  Working principle
                </footer>
              </blockquote>
            </Reveal>

            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {themes.map((t, i) => (
                <Reveal as="li" key={t.glyph} delay={0.05 + i * 0.04}>
                  <article className="surface-panel rounded-2xl p-6 h-full">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-70">
                      {t.glyph}
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-tight">
                      {t.label}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed">{t.body}</p>
                  </article>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.2}>
              <div className="mt-4 pt-8 border-t border-[var(--line)] flex flex-wrap items-center gap-4 justify-between">
                <p className="text-sm opacity-70 max-w-md">
                  The work and education page keeps the factual timeline short:
                  NTNU, Infineon, and the technical direction from there.
                </p>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-[var(--line-strong)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors"
                >
                  See the timeline
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </article>
  );
}
