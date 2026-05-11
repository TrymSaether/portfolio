import type { Metadata } from "next";
import { NoteCard } from "@/components/content/NoteCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { notes } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes & Book",
  description:
    "Notes and book-style writing by Trym Sæther on numerical methods, finite elements, optimization, stochastic modeling, linear algebra, and mathematical communication.",
};

export default function NotesPage() {
  return (
    <>
      <Section
        kicker="Sheet 04 · Field Notebook"
        index="III"
        title={
          <>
            A living notebook
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              for mathematical software.
            </span>
          </>
        }
        lede="Course notes, derivations, examples, and book-style drafts that keep the mathematical core visible while moving toward implementation."
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
                      Notes into software
                    </p>
                    <div className="mt-6 space-y-3 text-sm leading-snug">
                      <p>
                        ∂<sub>t</sub>u + 𝓛 u = f, &nbsp;u(0) = u<sub>0</sub>
                      </p>
                      <p className="opacity-70">
                        &ldquo;Structure first; implementation second.&rdquo;
                      </p>
                      <p className="font-mono text-[11px] opacity-70">
                        finite elements · optimization · solvers
                      </p>
                      <svg
                        viewBox="0 0 200 50"
                        className="w-full h-12 stroke-[#1c1a14] fill-none opacity-70"
                        aria-hidden
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
                      notes · drafts · reports
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
                    A set of topic notes and book-style material on numerical
                    methods, finite elements, optimization, stochastic modeling,
                    linear algebra, and mathematical communication.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>

          <ol className="lg:col-span-8 space-y-4">
            {notes.map((n, i) => (
              <NoteCard
                key={n.slug}
                note={n}
                delay={i * 0.05}
                variant="index"
              />
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
