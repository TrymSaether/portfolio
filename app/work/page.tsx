import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = {
  title: "Work & Education",
  description:
    "Trym Sæther's NTNU mathematics and electrical engineering background, Infineon simulation software experience, and current technical direction.",
};

const kindMeta: Record<string, { label: string; ring: string }> = {
  education: { label: "Education", ring: "var(--color-aurora)" },
  work: { label: "Work", ring: "var(--color-gold-400)" },
  milestone: { label: "Milestone", ring: "var(--color-ember)" },
};

export default function WorkPage() {
  return (
    <>
      <Section
        kicker="Sheet 03 · Trajectory"
        index="II"
        title={
          <>
            From mathematical foundations to
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              technical software.
            </span>
          </>
        }
        lede="A compact timeline: NTNU mathematics and engineering, Infineon simulation software, and the current direction toward research-oriented software engineering."
      >
        <ol className="relative pl-6 sm:pl-8 mt-4 border-l border-(--line)">
          {timeline.map((t, i) => {
            const meta = kindMeta[t.kind];
            return (
              <Reveal as="li" key={`${t.marker}-${t.title}`} delay={i * 0.04}>
                <article className="relative py-8 sm:py-10">
                  <span
                    aria-hidden
                    className="absolute -left-8 sm:-left-9 top-10 w-3 h-3 rounded-full"
                    style={{
                      background: meta.ring,
                      boxShadow: `0 0 24px ${meta.ring}`,
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -left-10 sm:-left-11 top-9 w-4.5 h-4.5 rounded-full border opacity-60"
                    style={{ borderColor: meta.ring }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <div className="sm:col-span-3">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-(--muted)">
                        {meta.label}
                      </p>
                      <p className="mt-1 font-display text-2xl leading-tight">
                        {t.marker}
                      </p>
                      <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-(--muted)">
                        {t.location}
                      </p>
                    </div>
                    <div className="sm:col-span-9">
                      <h3 className="font-display text-2xl sm:text-3xl leading-tight">
                        {t.title}{" "}
                        <span className="text-(--muted)"> — {t.org}</span>
                      </h3>
                      <p className="mt-3 max-w-prose text-base text-[var(--fg-soft)] leading-relaxed">
                        {t.body}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {t.tags.map((tag) => (
                          <li
                            key={tag}
                            className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--fg-soft) border border-(--line) rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <Section
        kicker="Toolkit"
        index=""
        title={<>Technical direction.</>}
        lede="The emphasis is stable even when the tools change: simulation, numerical methods, scientific computing, compiler and tooling work, EDA-related systems, and clear mathematical communication."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              label: "Numerics & Simulation",
              items: [
                "Finite elements and adaptive refinement",
                "Numerical methods and stability",
                "Scientific computing experiments",
                "Simulation software for technical workflows",
              ],
            },
            {
              label: "Systems & Tooling",
              items: [
                "Compiler-adjacent equation workflows",
                "Differential-algebraic equation tooling",
                "EDA-related systems",
                "C++, Fortran, Python, and TypeScript",
              ],
            },
            {
              label: "Communication",
              items: [
                "TeX notes and reports",
                "Derivations, diagrams, and examples",
                "Mathematical explanations for software work",
                "Readable technical documentation",
              ],
            },
          ].map((g) => (
            <Reveal key={g.label}>
              <article className="glow-card rounded-2xl p-6 h-full">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)]">
                  {g.label}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--fg)]">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="text-[var(--accent)] mt-1.5 size-1 rounded-full bg-current" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
