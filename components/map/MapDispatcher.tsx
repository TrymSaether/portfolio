"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TopoSVG } from "./TopoSVG";
import { MobileMap } from "./MobileMap";

const MapScene = dynamic(
  () => import("@/scenes/map/MapScene").then((m) => m.MapScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0">
        <TopoSVG />
        <div className="absolute inset-0 grid place-items-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--accent)] animate-pulse">
            Charting terrain…
          </p>
        </div>
      </div>
    ),
  },
);

type Mode = "3d" | "mobile" | null;

export function MapDispatcher({ desktopOverlay }: { desktopOverlay: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(null);

  useEffect(() => {
    const small = window.matchMedia(
      "(pointer: coarse) and (max-width: 900px), (max-width: 700px)",
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setMode(small.matches || reduced.matches ? "mobile" : "3d");
    update();
    small.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  if (mode === null) {
    return (
      <div className="relative h-[100dvh] overflow-hidden">
        <div className="absolute inset-0">
          <TopoSVG />
        </div>
      </div>
    );
  }

  if (mode === "mobile") {
    return <MobileMap />;
  }

  return (
    <section className="relative h-[100dvh] overflow-hidden grain scrim-bottom">
      <MapScene />
      {desktopOverlay}
    </section>
  );
}
