import type { Metadata } from "next";
import type { SVGProps } from "react";
import { FileDown, Mail } from "lucide-react";
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
                <GitHubIcon className="absolute right-6 top-6 size-5 text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100" />

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
                <LinkedInIcon className="absolute right-6 top-6 size-5 text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100" />

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
                className="glow-card group relative overflow-hidden rounded-2xl p-6 border border-[var(--accent)]/30 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[var(--accent)]/12 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                <div className="pointer-events-none absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]/25 transition-all duration-300 group-hover:rotate-6 group-hover:bg-[var(--accent)]/15">
                  <FileDown className="size-5 text-[var(--accent)]" />
                </div>

                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                  Curriculum vitae
                </p>

                <p className="mt-3 font-display text-2xl">Download CV</p>

                <p className="mt-3 max-w-[13rem] text-sm leading-relaxed text-[var(--fg-soft)]">
                  A concise overview of selected work, technical focus, and experience.
                </p>

                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--on-accent)] transition-transform duration-300 group-hover:translate-x-1">
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

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 4.58c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
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
