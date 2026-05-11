import type { Metadata } from "next";
import { FileDown, Github, Linkedin, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Trym Sæther for simulation software, scientific computing, compiler/tooling work, EDA-related software, and technical writing.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate">
        {/* Atmospheric backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <RadioTowerBackdrop />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/20 via-[var(--bg)]/65 to-[var(--bg)]" />
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
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              <a
                href="mailto:hei@trymsaether.no"
                className="glow-card relative rounded-2xl p-6 group md:col-span-2 border border-[var(--accent)]/30 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50"
              >
                <Mail className="absolute right-6 top-6 size-5 text-[var(--accent)] opacity-70 transition-opacity group-hover:opacity-100" />

                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Direct line
                </p>

                <p className="mt-3 font-display text-2xl sm:text-3xl break-words">
                  hei@trymsaether.no
                </p>

                <p className="mt-3 text-xs text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100">
                  Compose →
                </p>
              </a>

              <a
                href="https://github.com/trymsaether"
                target="_blank"
                rel="noreferrer"
                className="glow-card relative rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40"
              >
                <Github className="absolute right-6 top-6 size-5 text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100" />

                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Workshop
                </p>

                <p className="mt-3 font-display text-2xl break-words">
                  github.com/trymsaether
                </p>

                <p className="mt-3 text-xs text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100">
                  Visit ↗
                </p>
              </a>

              <a
                href="https://www.linkedin.com/in/trymsaether"
                target="_blank"
                rel="noreferrer"
                className="glow-card relative rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40"
              >
                <Linkedin className="absolute right-6 top-6 size-5 text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100" />

                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Long form
                </p>

                <p className="mt-3 font-display text-2xl">LinkedIn</p>

                <p className="mt-3 text-xs text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100">
                  Visit ↗
                </p>
              </a>

              <a
                href="/assets/documents/trym-saether-cv.pdf"
                className="group relative overflow-hidden rounded-2xl p-6 bg-sky-500 text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-400 hover:shadow-sky-400/30"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                <div className="pointer-events-none absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 transition-all duration-300 group-hover:rotate-6 group-hover:bg-white/20">
                  <FileDown className="size-5 text-white" />
                </div>

                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/70">
                  Curriculum vitae
                </p>

                <p className="mt-3 font-display text-2xl">Download CV</p>

                <p className="mt-3 max-w-[13rem] text-sm leading-relaxed text-white/75">
                  A concise overview of selected work, technical focus, and experience.
                </p>

                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-700 transition-transform duration-300 group-hover:translate-x-1">
                  Download PDF
                  <span aria-hidden>↘</span>
                </p>
              </a>

              <div className="glow-card relative rounded-2xl p-6 border border-[var(--fg-soft)]/10">
                <span className="absolute right-6 top-6 text-[var(--accent)] opacity-50">
                  ◌
                </span>

                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Local station
                </p>

                <p className="mt-3 font-display text-2xl">Trondheim, NO</p>

                <p className="mt-3 font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
                  63°25′N · 10°23′E · UTC+1 / UTC+2
                </p>
              </div>
            </div>
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
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="contact-glow" cx="76%" cy="66%" r="64%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.24" />
          <stop offset="58%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="contact-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--bg-elevated)"
            stopOpacity="0.95"
          />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="contact-ridge-soft" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--bg-elevated)"
            stopOpacity="0.5"
          />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="var(--bg)" />
      <rect width="1600" height="900" fill="url(#contact-glow)" />

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 137.3) % 1600;
        const y = (i * 53.7) % 480;
        const r = (i % 3) * 0.6 + 0.4;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="var(--fg-soft)"
            opacity={0.45}
          />
        );
      })}

      {/* Signal arcs */}
      <g
        stroke="var(--accent)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="1.5"
      >
        <path
          d="M1200 340 C1040 270 930 270 800 340"
          strokeOpacity="0.12"
        />
        <path
          d="M1200 340 C960 200 760 210 560 360"
          strokeOpacity="0.08"
        />
        <path
          d="M1200 340 C890 140 570 180 330 410"
          strokeOpacity="0.05"
        />
      </g>

      {/* Distant curved ridge */}
      <path
        d="M0 690 C180 620 300 650 460 590 C650 510 790 570 940 520 C1110 460 1270 540 1600 470 L1600 900 L0 900 Z"
        fill="url(#contact-ridge-soft)"
        opacity="0.35"
      />

      {/* Main ridges */}
      <path
        d="M0 720 L220 600 L440 660 L700 540 L940 620 L1180 530 L1400 600 L1600 540 L1600 900 L0 900 Z"
        fill="url(#contact-ridge)"
      />

      <path
        d="M0 800 L200 720 L480 770 L720 680 L980 740 L1220 670 L1440 720 L1600 680 L1600 900 L0 900 Z"
        fill="var(--bg)"
      />

      {/* Tower */}
      <g
        transform="translate(-90 20)"
        stroke="var(--accent)"
        strokeOpacity="0.85"
        fill="none"
        strokeWidth="2"
      >
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
    </svg>
  );
}
