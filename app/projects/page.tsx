import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected technical projects — simulators, solvers, and tools that turn theory into pixels.",
};

export default function ProjectsPage() {
  return (
    <>
      <Section
        kicker="Sheet 05 · Built things"
        index="IV"
        title={
          <>
            Simulators, solvers,
            <span className="font-display-italic text-[var(--color-gold-400)]">
              {" "}
              and the tools to read them.
            </span>
          </>
        }
        lede="Each crystal in this section is a project I shipped or am still polishing — research code, internal tools, and the occasional toy."
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.04}>
              <Link href={`/projects/${p.slug}`} className="group block h-full">
                <article className="glow-card h-full rounded-2xl p-6 relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1">
                  {/* Decorative crystal hero */}
                  <div className="absolute -right-10 -top-10 w-44 h-44 opacity-30 group-hover:opacity-50 transition-opacity">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <defs>
                        <linearGradient id={`g-${p.slug}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#f3c66b" />
                          <stop offset="100%" stopColor="#74c0c8" />
                        </linearGradient>
                      </defs>
                      <g
                        stroke={`url(#g-${p.slug})`}
                        strokeWidth="0.8"
                        fill="none"
                      >
                        {Array.from({ length: 14 }).map((_, k) => {
                          const r = 18 + k * 8;
                          return (
                            <polygon
                              key={k}
                              points={polygon(100, 100, r, 6, k * 6)}
                            />
                          );
                        })}
                      </g>
                    </svg>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-400)]">
                        {p.domain}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                        {p.year}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
                      {p.kicker}
                    </p>
                    <p className="mt-4 text-sm text-[var(--color-ink-200)] leading-relaxed">
                      {p.blurb}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <li
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-100)] border border-[var(--line)] rounded-full px-2 py-0.5"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                          p.status === "shipped"
                            ? "text-[var(--color-aurora)]"
                            : p.status === "ongoing"
                              ? "text-[var(--color-gold-400)]"
                              : "text-[var(--color-ember)]"
                        }`}
                      >
                        ● {p.status}
                      </span>
                      <span className="text-xs text-[var(--color-gold-400)] opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

function polygon(cx: number, cy: number, r: number, n: number, rot = 0) {
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rot * Math.PI) / 180;
    points.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return points.join(" ");
}
