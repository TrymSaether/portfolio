import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Personal",
  description:
    "A personal page for Trym Sæther: nature, photographs, curiosity, discipline, and life outside the screen.",
};

const photographs = [
  {
    title: "Frame 01",
    body: "Mountain air, distance, and the habit of looking carefully.",
    src: "/assets/images/personal/activity-01.jpeg",
    alt: "Personal photograph from the previous portfolio, frame 01",
  },
  {
    title: "Frame 02",
    body: "Small observations from outside the screen.",
    src: "/assets/images/personal/activity-02.jpeg",
    alt: "Personal photograph from the previous portfolio, frame 02",
  },
  {
    title: "Frame 03",
    body: "Weather, quiet, and problems that untangle slowly.",
    src: "/assets/images/personal/activity-03.jpeg",
    alt: "Personal photograph from the previous portfolio, frame 03",
  },
  {
    title: "Frame 04",
    body: "Light and landscape as a useful change of pace.",
    src: "/assets/images/personal/activity-04.jpeg",
    alt: "Personal photograph from the previous portfolio, frame 04",
  },
  {
    title: "Frame 05",
    body: "A reminder that attention is trained by repetition.",
    src: "/assets/images/personal/activity-05.jpg",
    alt: "Personal photograph from the previous portfolio, frame 05",
  },
  {
    title: "Frame 06",
    body: "The visual side of patience: wait, frame, revise.",
    src: "/assets/images/personal/activity-06.jpg",
    alt: "Personal photograph from the previous portfolio, frame 06",
  },
  {
    title: "Frame 07",
    body: "Open space, carried back into technical work.",
    src: "/assets/images/personal/activity-07.jpg",
    alt: "Personal photograph from the previous portfolio, frame 07",
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
          {photographs.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.05}>
              <figure className="group glow-card rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] relative overflow-hidden bg-[#1c1a14]">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
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
