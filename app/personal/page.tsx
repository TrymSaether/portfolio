import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Personal",
  description:
    "A personal page for Trym Sæther: nature, photographs, curiosity, discipline, and life outside the screen.",
};

const captions = [
  {
    title: "Nature",
    body: "Mountains, weather, distance, and the kind of quiet that makes hard problems less tangled.",
    palette: ["#1a2336", "#3a4a78", "#a7b3cd"],
  },
  {
    title: "Photos",
    body: "A place for small observations, trips, landscapes, and visual notes from outside the screen.",
    palette: ["#0e1422", "#244168", "#74c0c8"],
  },
  {
    title: "Discipline",
    body: "The same patience that helps in mathematics also helps elsewhere: repetition, attention, and taste.",
    palette: ["#1c1a14", "#7a6a4a", "#f3c66b"],
  },
];

export default function PersonalPage() {
  return (
    <>
      <Section
        kicker="Sheet 06 · Off the map"
        index="V"
        title={
          <>
            Nature, photographs,
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              and life outside the screen.
            </span>
          </>
        }
        lede="A quieter side of the site: nature, photos, curiosity, discipline, and the parts of life that keep technical work grounded."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {captions.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.05}>
              <figure className="group glow-card rounded-2xl overflow-hidden">
                <div
                  className="aspect-[4/5] relative overflow-hidden"
                  style={{
                    background: `linear-gradient(160deg, ${c.palette[0]}, ${c.palette[1]} 60%, ${c.palette[2]})`,
                  }}
                >
                  {/* Layered "landscape" of triangular ridges */}
                  <svg
                    viewBox="0 0 400 500"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <polygon
                      points="0,500 0,330 80,260 150,310 220,240 290,300 360,250 400,290 400,500"
                      fill={c.palette[1]}
                      opacity="0.85"
                    />
                    <polygon
                      points="0,500 0,400 90,330 160,380 240,320 310,360 400,320 400,500"
                      fill={c.palette[0]}
                      opacity="0.95"
                    />
                    <circle cx="320" cy="120" r="34" fill={c.palette[2]} opacity="0.55" />
                    <circle cx="320" cy="120" r="60" fill={c.palette[2]} opacity="0.18" />
                  </svg>
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.3em] uppercase text-white/70">
                    plate {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="p-5">
                  <p className="font-display text-xl leading-tight">
                    {c.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                    {c.body}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
