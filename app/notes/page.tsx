import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { notes } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes & Book",
  description:
    "Working notes on numerical methods, PDEs, and the slow craft of mathematical writing.",
};

export default function NotesPage() {
  return (
    <>
      <Section
        kicker="Sheet 04 · Field Notebook"
        index="III"
        title={
          <>
            Working notes
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              on a quiet desk.
            </span>
          </>
        }
        lede="A small collection of essays, half-finished arguments, and chapters from a book in progress on numerical methods for engineers."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <aside className="lg:col-span-4">
            <Reveal>
              <div className="glow-card rounded-2xl overflow-hidden">
                <div className="aspect-4/5 relative bg-[#1c2236] ruled p-6 text-[#1c1a14]">
                  <div className="absolute inset-0 ruled bg-cream-50" />
                  <div className="relative z-10 h-full flex flex-col">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
                      Notebook · vol. 04
                    </p>
                    <p className="mt-3 font-display text-3xl leading-tight">
                      Methods for engineers
                    </p>
                    <div className="mt-6 space-y-3 text-sm leading-snug">
                      <p>
                        ∂<sub>t</sub>u + 𝓛 u = f, &nbsp;u(0) = u<sub>0</sub>
                      </p>
                      <p className="opacity-70">
                        “The implicit step is honest about the future.”
                      </p>
                      <p className="font-mono text-[11px] opacity-70">
                        sketch · Gauss-Lobatto nodes
                      </p>
                      <svg
                        viewBox="0 0 200 50"
                        className="w-full h-12 stroke-[#1c1a14] fill-none opacity-70"
                      >
                        <path d="M0 40 C 30 10, 60 10, 100 25 S 170 40, 200 10" />
                        {[6, 30, 70, 110, 145, 175, 192].map((x) => (
                          <circle
                            key={x}
                            cx={x}
                            cy={40 - Math.sin(x * 0.05) * 12}
                            r="2"
                            className="fill-[#1c1a14]"
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="mt-auto font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
                      ch. 06 — in progress
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-(--muted)">
                    The book
                  </p>
                  <h3 className="mt-2 font-display text-xl leading-tight">
                    Mathematics into software
                  </h3>
                  <p className="mt-2 text-sm text-(--muted) leading-relaxed">
                    A long-form treatment of numerical methods for engineers
                    who want their intuition back. Drafting in public — sample
                    chapters land here as they're cleaned up.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>

          <ol className="lg:col-span-8 space-y-4">
            {notes.map((n, i) => (
              <Reveal as="li" key={n.slug} delay={i * 0.05}>
                <Link href={`/notes/${n.slug}`} className="block group">
                  <article
                    id={n.slug}
                    className="glow-card rounded-2xl p-6 group-hover:-translate-y-0.5 transition-transform duration-500"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)]">
                        {n.kicker}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--muted)">
                        {n.status === "chapter"
                          ? "Book chapter"
                          : n.status === "draft"
                            ? "Draft"
                            : n.date}
                      </p>
                    </div>
                    <h3 className="mt-3 font-display text-2xl sm:text-3xl leading-tight">
                      {n.title}
                    </h3>
                    <p className="mt-3 text-base text-[var(--fg-soft)] leading-relaxed max-w-prose">
                      {n.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {n.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-soft)] border border-(--line) rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--muted)">
                        {n.reading}
                      </p>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section >
    </>
  );
}
