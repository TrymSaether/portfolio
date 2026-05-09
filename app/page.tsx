import Link from "next/link";
import { MapDispatcher } from "@/components/map/MapDispatcher";
import { HeroOverlay } from "@/components/home/HeroOverlay";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { stations } from "@/content/stations";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";

export default function HomePage() {
  return (
    <>
      <MapDispatcher desktopOverlay={<HeroOverlay />} />

      <Section
        kicker="Field manual"
        index="00"
        title={
          <>
            A small atlas of how a mathematician thinks,
            <br className="hidden lg:block" /> and what an engineer
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              ships.
            </span>
          </>
        }
        lede="Six stations. Six ways into the same practice. Pick a route — the rover takes its time."
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stations.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05} as="li">
              <Link href={s.href} className="group block h-full">
                <article className="glow-card h-full rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)]">
                      {s.glyph} · {s.subtitle}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--muted)]">
                      0{s.index}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl leading-tight">
                    {s.label}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                    {s.oneLiner}
                  </p>
                  <p className="mt-6 text-xs text-[var(--accent)] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Enter station <span aria-hidden>→</span>
                  </p>
                </article>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        kicker="Selected work"
        index="IV"
        title={<>Things built, mostly for science.</>}
        lede="A handful of simulators, solvers, and tools that turn theory into something you can press a button on."
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} as="li">
              <Link
                href={`/projects/${p.slug}`}
                className="group block h-full"
              >
                <article className="glow-card h-full rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                      {p.kicker}
                    </span>
                    <span
                      aria-hidden
                      className="font-display text-2xl text-[var(--accent)] leading-none"
                    >
                      {p.glyph}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                    {p.blurb}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <li
                        key={t}
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-soft)] border border-[var(--line)] rounded-full px-2 py-0.5"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            All selected work
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Section>

      <Section
        kicker="Notes & Book"
        index="III"
        title={<>From the field notebook.</>}
        lede="Working notes on numerical methods, PDEs, and the slow craft of writing mathematics for engineers."
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notes.slice(0, 4).map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.05} as="li">
              <Link
                href={`/notes#${n.slug}`}
                className="group block h-full"
              >
                <article className="glow-card h-full rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                      {n.kicker}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                      {n.status === "chapter" ? "Book chapter" : n.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                    {n.excerpt}
                  </p>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {n.date} · {n.reading}
                  </p>
                </article>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        kicker="Open channel"
        index="VI"
        title={
          <>
            Send a signal across the
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              valley.
            </span>
          </>
        }
        lede="I'm available for selected work in scientific computing, simulation tooling, and technical writing."
        align="center"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-strong)] transition-colors shadow-[0_0_60px_-15px_var(--accent)]"
          >
            Open the channel
            <span aria-hidden>→</span>
          </Link>
          <a
            href="mailto:hei@trymsaether.no"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            hei@trymsaether.no
          </a>
        </div>
      </Section>
    </>
  );
}
