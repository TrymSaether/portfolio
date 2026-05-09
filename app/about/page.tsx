import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Trym Sæther — mathematician and engineer. On thinking, shipping, curiosity, and clear communication.",
};

const themes = [
  {
    glyph: "I",
    label: "Mathematical thinking",
    body: "I treat code the way I learned to treat proofs: every line is a sentence in a larger argument. The argument should be small enough to hold in your head and rigorous enough to defend on a Tuesday.",
  },
  {
    glyph: "II",
    label: "Engineering mindset",
    body: "Software is the place where mathematics meets weather. I care about the seams — the boundaries where a beautiful theorem has to compromise with a deadline, a CPU, and a future maintainer.",
  },
  {
    glyph: "III",
    label: "Curiosity",
    body: "The best problems start as a small itch — a paper that didn't quite explain itself, a number that came out wrong, a tool that should exist but doesn't. I follow those for as long as they're interesting.",
  },
  {
    glyph: "IV",
    label: "Communication",
    body: "Mathematics is a language; like any language, it can be spoken poorly. Most of my writing is in service of the same goal as my code: make the difficult thing legible without making it small.",
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
            A short essay on thinking
            <span className="font-display-italic"> in two languages.</span>
          </>
        }
        lede="I grew up on the western coast of Norway, where the weather and the mathematics both came in moods. I learned to listen to either, and to write the second one down."
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
                    Portrait · winter, somewhere above the tree line
                  </p>
                </div>
              </div>
              <div className="p-6 bg-[var(--bg-elevated)] text-[var(--fg)]">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Currently
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>· Building a spectral PDE solver in Julia</li>
                  <li>· Drafting chapter six of the book</li>
                  <li>· Teaching a small reading group on Sobolev spaces</li>
                  <li>· Looking at light, mostly</li>
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Editorial body */}
          <div className="lg:col-span-7 space-y-12">
            <Reveal>
              <p className="font-display text-2xl sm:text-3xl leading-snug text-balance">
                I think of mathematics as a place I keep returning to. It rewards
                slow visits. It is patient with people who don't have all the
                vocabulary, and quietly merciless with people who pretend they
                do.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-base leading-[1.7] max-w-[60ch]">
                For most of my early twenties, I was a physics student first and
                a programmer second. The order has since flipped, then flipped
                back, and now I think of them as the same activity, viewed from
                two slightly different latitudes.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <blockquote className="border-l border-[var(--line)] pl-6 sm:pl-8 my-2">
                <p className="font-display-italic text-2xl leading-snug text-balance">
                  The best engineering I have ever done began as a question I
                  could only phrase in mathematical sentences.
                </p>
                <footer className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
                  Notebook 04 · 2024
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
                  If you'd like the longer story, the timeline lives at the
                  observatory.
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
