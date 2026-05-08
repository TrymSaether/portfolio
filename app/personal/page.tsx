import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Personal",
  description:
    "Photography, hiking, landscape, and the value of looking around without a deliverable.",
};

const captions = [
  {
    title: "Trollheimen, february",
    body: "Eight days, one thermos, three pairs of mittens. The mountains taught me a lot about patience that year.",
    palette: ["#1a2336", "#3a4a78", "#a7b3cd"],
  },
  {
    title: "Lofoten, blue hour",
    body: "Twenty minutes a day when the sky and the sea agree on a colour.",
    palette: ["#0e1422", "#244168", "#74c0c8"],
  },
  {
    title: "Cabin, midwinter",
    body: "I write better when the kettle is on and the window is dark.",
    palette: ["#1c1a14", "#7a6a4a", "#f3c66b"],
  },
  {
    title: "Hammerfest, low light",
    body: "The polar night doesn't actually end. It only changes its mind.",
    palette: ["#0a0e17", "#2a3651", "#d6dceb"],
  },
  {
    title: "Bergen, after rain",
    body: "Rooftops, copper, an espresso, a good argument with a friend.",
    palette: ["#1f2030", "#5a4f6a", "#c0893a"],
  },
  {
    title: "Linnaeus, herbarium",
    body: "Studying old botanical plates because the typography is excellent and the curiosity is infectious.",
    palette: ["#2a2014", "#7a5a30", "#ddd0b6"],
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
            Mountains, photographs,
            <span className="font-display-italic text-[var(--color-gold-400)]">
              {" "}
              and the value of looking around.
            </span>
          </>
        }
        lede="A small gallery from the parts of life that don't fit on a CV — and that I think are quietly the most important inputs to the work."
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
