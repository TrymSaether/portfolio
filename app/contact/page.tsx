import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Trym Sæther for simulation software, scientific computing, compiler/tooling work, EDA-related software, and technical writing.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative">
        {/* Atmospheric backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <RadioTowerBackdrop />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-44 sm:pb-32">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--accent)]">
              Sheet 07 · Open channel
            </p>
            <h1 className="mt-4 font-display text-balance text-5xl sm:text-7xl lg:text-8xl leading-[0.98] max-w-4xl">
              Send a signal.
              <br />
              <span className="font-display-italic text-[var(--accent)]">
                I&rsquo;ll listen for it.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--muted)] leading-relaxed">
              For conversations about simulation software, scientific
              computing, compiler and tooling work, EDA-related systems, or
              mathematical communication.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
              <a
                href="mailto:hei@trymsaether.no"
                className="glow-card rounded-2xl p-6 group"
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Direct line
                </p>
                <p className="mt-3 font-display text-2xl break-words">
                  hei@trymsaether.no
                </p>
                <p className="mt-3 text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Compose →
                </p>
              </a>
              <a
                href="https://github.com/trymsaether"
                target="_blank"
                rel="noreferrer"
                className="glow-card rounded-2xl p-6 group"
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Workshop
                </p>
                <p className="mt-3 font-display text-2xl">
                  github.com/trymsaether
                </p>
                <p className="mt-3 text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit ↗
                </p>
              </a>
              <a
                href="https://www.linkedin.com/in/trymsaether"
                target="_blank"
                rel="noreferrer"
                className="glow-card rounded-2xl p-6 group"
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Long form
                </p>
                <p className="mt-3 font-display text-2xl">LinkedIn</p>
                <p className="mt-3 text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit ↗
                </p>
              </a>
              <a
                href="/assets/documents/trym-saether-cv.pdf"
                className="glow-card rounded-2xl p-6 group"
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Curriculum vitae
                </p>
                <p className="mt-3 font-display text-2xl">Full CV, two pages</p>
                <p className="mt-3 text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Download ↘
                </p>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-16 max-w-xl font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
              Trondheim, NO · 63°25′N · 10°23′E · UTC+1 / UTC+2
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function RadioTowerBackdrop() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="contact-glow" cx="80%" cy="70%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg-elevated)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="var(--bg)" />
      <rect width="1600" height="900" fill="url(#contact-glow)" />
      {/* Ridges */}
      <path d="M0 720 L 220 600 L 440 660 L 700 540 L 940 620 L 1180 530 L 1400 600 L 1600 540 L 1600 900 L 0 900 Z" fill="url(#ridge)" />
      <path d="M0 800 L 200 720 L 480 770 L 720 680 L 980 740 L 1220 670 L 1440 720 L 1600 680 L 1600 900 L 0 900 Z" fill="var(--bg)" />
      {/* Tower */}
      <g stroke="var(--accent)" strokeOpacity="0.85" fill="none" strokeWidth="2">
        <line x1="1280" y1="780" x2="1290" y2="320" />
        <line x1="1300" y1="780" x2="1290" y2="320" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={1280 + i * 0.9}
            y1={780 - i * 38}
            x2={1300 - i * 0.9}
            y2={780 - i * 38}
          />
        ))}
        <circle cx="1290" cy="320" r="6" fill="var(--accent)" />
        <circle cx="1290" cy="320" r="14" opacity="0.5" />
        <circle cx="1290" cy="320" r="40" opacity="0.2" />
        <circle cx="1290" cy="320" r="80" opacity="0.08" />
      </g>
      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 137.3) % 1600;
        const y = (i * 53.7) % 480;
        const r = (i % 3) * 0.6 + 0.4;
        return <circle key={i} cx={x} cy={y} r={r} fill="var(--fg-soft)" opacity={0.45} />;
      })}
    </svg>
  );
}
