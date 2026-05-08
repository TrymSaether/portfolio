"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Terrain } from "./Terrain";
import { Stations } from "./Stations";
import { Rover } from "./Rover";
import { Atmosphere } from "./Atmosphere";
import { RoutePaths } from "./RoutePaths";
import { Sky } from "./Sky";
import { CameraRig } from "./CameraRig";
import { stations } from "@/content/stations";
import { motion, AnimatePresence } from "motion/react";
import { useSceneStore } from "./sceneStore";

interface MapSceneProps {
  onHoverStation?: (id: string | null) => void;
}

export function MapScene({ onHoverStation }: MapSceneProps = {}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [dpr, setDpr] = useState(1.4);
  const [flashing, setFlashing] = useState(false);
  const router = useRouter();
  const sceneMode = useSceneStore((s) => s.mode);

  // Bridge hover events to parent if requested
  useEffect(() => {
    onHoverStation?.(hovered);
  }, [hovered, onHoverStation]);

  // Reset on unmount (route change)
  useEffect(() => {
    return () => useSceneStore.getState().reset();
  }, []);

  // When the camera flight begins, run the soft-white flash near the end of
  // the arc and hand off to the destination route at peak flash.
  useEffect(() => {
    if (sceneMode !== "flying") return;
    const targetIndex = useSceneStore.getState().toStationIndex;
    if (targetIndex === null) return;
    const target = stations[targetIndex];
    const flightDuration = useSceneStore.getState().flightDuration;

    // Flash starts at ~70% of the arc so it builds with the zoom
    const flashStart = window.setTimeout(
      () => setFlashing(true),
      flightDuration * 1000 * 0.7,
    );
    // Navigate at peak (arc has just landed)
    const navTimer = window.setTimeout(
      () => {
        useSceneStore.getState().parkAt(targetIndex);
        router.push(target.href);
      },
      flightDuration * 1000 + 80,
    );

    return () => {
      window.clearTimeout(flashStart);
      window.clearTimeout(navTimer);
    };
  }, [sceneMode, router]);

  const handleStationSelect = (id: string) => {
    setActive(id);
    const targetIndex = stations.findIndex((s) => s.id === id);
    if (targetIndex < 0) return;

    const cur = useSceneStore.getState();
    if (cur.mode !== "parked") return; // ignore further clicks mid-flight
    if (targetIndex === cur.parkedStationIndex) return; // already there

    cur.beginFly(targetIndex, performance.now() / 1000);
  };

  const station = stations.find((s) => s.id === (hovered ?? active));

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows={false}
        dpr={dpr}
        camera={{ position: [10, 8, 10], fov: 36, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          scene.fog = new THREE.Fog("#0a0e17", 18, 46);
        }}
      >
        <color attach="background" args={["#07090e"]} />
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, dpr + 0.2))}
          onDecline={() => setDpr(Math.max(0.9, dpr - 0.2))}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <hemisphereLight args={["#3a4a78", "#0a0e17", 0.5]} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.4}
          color="#f3c66b"
        />
        <directionalLight
          position={[-8, 4, -6]}
          intensity={0.4}
          color="#74c0c8"
        />

        <CameraRig />

        <Suspense fallback={null}>
          <Sky />
          <Terrain />
          <RoutePaths />
          <Stations
            hovered={hovered}
            active={active}
            onHover={setHovered}
            onSelect={handleStationSelect}
          />
          <Rover />
          <Atmosphere />
        </Suspense>

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.95}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.85} />
        </EffectComposer>
      </Canvas>

      {/* Cinematic frame overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-200/70">
          <p>Atlas / sheet 01</p>
          <p className="mt-1 text-gold-400">Trondheim · 63°25′N 10°24′E</p>
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-200/70 text-right">
          <p>{stations.length} stations</p>
          <RoverStatus />
        </div>
        <Crosshair className="top-2 left-2" />
        <Crosshair className="top-2 right-2" rotate={90} />
        <Crosshair className="bottom-2 left-2" rotate={-90} />
        <Crosshair className="bottom-2 right-2" rotate={180} />
      </div>

      {/* Mobile/tablet station info popover (bottom-center, hidden ≥ xl) */}
      <AnimatePresence mode="wait">
        {station && (
          <motion.div
            key={`bottom-${station.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10 max-w-md w-[90vw] xl:hidden"
          >
            <StationInfoCard station={station} sceneMode={sceneMode} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop right-rail hover card (≥ xl) — slides in from the right */}
      <AnimatePresence mode="wait">
        {station && (
          <motion.div
            key={`right-${station.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute hidden xl:block top-1/2 -translate-y-1/2 right-6 2xl:right-10 w-88"
          >
            <StationInfoCard station={station} sceneMode={sceneMode} expanded />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft white flash overlay — handoff between scene and destination page */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            key="flash"
            className="absolute inset-0 pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.92 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StationInfoCard({
  station,
  sceneMode,
  expanded = false,
}: {
  station: (typeof stations)[number];
  sceneMode: "parked" | "flying";
  expanded?: boolean;
}) {
  return (
    <div
      className="glow-card rounded-2xl px-5 py-4"
      style={{
        borderColor: `color-mix(in oklab, ${station.palette.accent} 50%, transparent)`,
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p
          className="font-mono text-[10px] tracking-[0.28em] uppercase"
          style={{ color: station.palette.accent }}
        >
          {station.glyph} · {station.subtitle}
        </p>
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-(--muted)">
          {sceneMode === "parked" ? "click to enter" : "in flight"}
        </p>
      </div>
      <h3 className="mt-1.5 font-display text-2xl text-(--fg)">
        {station.label}
      </h3>
      <p className="mt-1 text-sm text-(--muted)ing-relaxed">
        {station.oneLiner}
      </p>
      {expanded && (
        <div
          className="mt-4 pt-4 border-t border-(--line) items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{
            borderColor: `color-mix(in oklab, ${station.palette.accent} 18%, transparent)`,
          }}
        >
          <span className="text-(--muted)">station {station.glyph}</span>
          <span style={{ color: station.palette.accent }}>enter →</span>
        </div>
      )}
    </div>
  );
}

function RoverStatus() {
  const mode = useSceneStore((s) => s.mode);
  const parkedIndex = useSceneStore((s) => s.parkedStationIndex);
  const toIndex = useSceneStore((s) => s.toStationIndex);
  if (mode === "parked") {
    const parked = stations[parkedIndex];
    return (
      <p className="mt-1" style={{ color: parked.palette.accent }}>
        rover · parked at {parked.label}
      </p>
    );
  }
  const target = toIndex !== null ? stations[toIndex] : null;
  return (
    <p
      className="mt-1"
      style={{ color: target?.palette.accent ?? "var(--color-gold-400)" }}
    >
      flight · {target?.label ?? "—"}
    </p>
  );
}

function Crosshair({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      className={`absolute opacity-50 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      color="var(--color-gold-400)"
    >
      <path d="M2 2 L2 8" />
      <path d="M2 2 L8 2" />
    </svg>
  );
}
