import Link from "next/link";
import { MapDispatcher } from "@/components/map/MapDispatcher";
import { HeroOverlay } from "@/components/home/HeroOverlay";
import { NoteCard } from "@/components/content/NoteCard";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TopoDivider } from "@/components/ui/TopoDivider";
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
        pad="loose"
        title={
          <>
            A small atlas of mathematics,
            <br className="hidden lg:block" /> software, and the tools they
            produce.
          </>
        }
        lede="Six stations through numerical methods, simulation software, compiler-adjacent tooling, notes, and contact."
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stations.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05} as="li">
              <Link href={s.href} className="group block h-full">
                <article className="glow-card relative h-full rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                  <span
                    aria-hidden
                    className="absolute top-5 right-5 font-mono text-base text-[var(--muted)] transition-all duration-300 group-hover:text-[var(--accent)] group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                  <div className="flex items-baseline justify-between pr-7">
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
                  <p className="mt-3 text-sm text-[var(--text)] leading-relaxed">
                    {s.oneLiner}
                  </p>
                </article>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <TopoDivider />

      <Section
        kicker="Selected work"
        index="IV"
        title={<>Technical artifacts with mathematical structure.</>}
        lede="Simulation prototypes, classifiers, optical-flow solvers, finite element work, particle transport, and image-processing code that make the reasoning inspectable."
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((p, i) => (
            <ProjectCard key={p.slug} project={p} delay={i * 0.06} />
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

      <TopoDivider flip />

      <Section
        kicker="Notes & Book"
        index="III"
        pad="tight"
        title={<>Notes for carrying mathematics into software.</>}
        lede="Numerical methods, finite elements, optimization, stochastic modeling, linear algebra, and mathematical communication."
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notes.slice(0, 4).map((n, i) => (
            <NoteCard key={n.slug} note={n} delay={i * 0.05} />
          ))}
        </ul>
      </Section>

      <Section
        kicker="Open channel"
        index="VI"
        title={<>Send a signal across the valley.</>}
        lede="For conversations about simulation software, scientific computing, compiler/tooling work, EDA-related systems, or mathematical communication."
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
            href="mailto:saether.trym@gmail.com"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            saether.trym@gmail.com
          </a>
        </div>
      </Section>
    </>
  );
}
