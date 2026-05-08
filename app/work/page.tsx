import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = {
  title: "Work & Education",
  description:
    "A timeline through mathematics, physics, engineering, and scientific software.",
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
            From the desk in Bergen to the
            <span className="font-display-italic text-[var(--color-gold-400)]">
              {" "}
              observatory.
            </span>
          </>
        }
        lede="A small constellation of years, written as if you could trace it across the map."
      >
        <ol className="relative pl-6 sm:pl-8 mt-4 border-l border-[var(--line)]">
          {timeline.map((t, i) => {
            const meta = kindMeta[t.kind];
            return (
              <Reveal as="li" key={`${t.year}-${t.title}`} delay={i * 0.04}>
                <article className="relative py-8 sm:py-10">
                  <span
                    aria-hidden
                    className="absolute -left-[33px] sm:-left-[37px] top-10 w-3 h-3 rounded-full"
                    style={{
                      background: meta.ring,
                      boxShadow: `0 0 24px ${meta.ring}`,
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -left-[40px] sm:-left-[44px] top-[36px] w-[18px] h-[18px] rounded-full border opacity-60"
                    style={{ borderColor: meta.ring }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <div className="sm:col-span-3">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                        {meta.label}
                      </p>
                      <p className="mt-1 font-display text-3xl leading-none">
                        {t.range ?? t.year}
                      </p>
                      <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
                        {t.location}
                      </p>
                    </div>
                    <div className="sm:col-span-9">
                      <h3 className="font-display text-2xl sm:text-3xl leading-tight">
                        {t.title}{" "}
                        <span className="text-[var(--muted)]"> — {t.org}</span>
                      </h3>
                      <p className="mt-3 max-w-prose text-base text-[var(--color-ink-200)] leading-relaxed">
                        {t.body}
                      </p>
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
        title={<>What I reach for, depending on the weather.</>}
        lede="The tools change every few years. The instinct doesn't."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              label: "Numerics",
              items: ["Julia · DifferentialEquations.jl", "Python · NumPy / JAX", "Rust · ndarray, faer", "C++ · Eigen, Kokkos"],
            },
            {
              label: "Visualization",
              items: ["WebGL2 · Three.js / R3F", "WebGPU · WGSL", "Makie.jl", "TikZ for the printed page"],
            },
            {
              label: "Writing",
              items: ["TeX · LuaTeX, KOMA-Script", "MDX · custom remark plugins", "Tufte-leaning notebooks", "A small library of fountain pens"],
            },
          ].map((g) => (
            <Reveal key={g.label}>
              <article className="glow-card rounded-2xl p-6 h-full">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-400)]">
                  {g.label}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-ink-100)]">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="text-[var(--color-gold-400)] mt-1.5 size-1 rounded-full bg-current" />
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
