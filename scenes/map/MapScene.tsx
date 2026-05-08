"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
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

export function MapScene() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [dpr, setDpr] = useState(1.4);
  const [flashing, setFlashing] = useState(false);
  const router = useRouter();
  const sceneMode = useSceneStore((s) => s.mode);
  const station = stations.find((s) => s.id === (hovered ?? active));

  // Reset on unmount (route change)
  useEffect(() => {
    return () => useSceneStore.getState().reset();
  }, []);

  // When the rover arrives, persist the new parked station, run the warm-white
  // flash, and hand off to the destination route.
  useEffect(() => {
    if (sceneMode !== "arriving") return;
    const targetIndex = useSceneStore.getState().toStationIndex;
    if (targetIndex === null) return;
    const target = stations[targetIndex];

    const flashTimer = window.setTimeout(() => setFlashing(true), 380);
    const navTimer = window.setTimeout(() => {
      // Park the rover at the destination so on return it's there waiting.
      useSceneStore.getState().parkAt(targetIndex);
      router.push(target.href);
    }, 720);

    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(navTimer);
    };
  }, [sceneMode, router]);

  const handleStationSelect = (id: string) => {
    setActive(id);
    const targetIndex = stations.findIndex((s) => s.id === id);
    if (targetIndex < 0) return;

    const cur = useSceneStore.getState();
    if (cur.mode !== "parked") return; // ignore clicks mid-drive
    if (targetIndex === cur.parkedStationIndex) return; // already there

    cur.beginDrive(targetIndex, performance.now() / 1000);
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows={false}
        dpr={dpr}
        camera={{ position: [9, 7.5, 9], fov: 36, near: 0.1, far: 100 }}
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

        {/* Lighting — cool fill + warm key */}
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
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-200)]/70">
          <p>Atlas / sheet 01</p>
          <p className="mt-1 text-[var(--color-gold-400)]">Trondheim · 63°25′N</p>
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-200)]/70 text-right">
          <p>{stations.length} stations</p>
          <RoverStatus />
        </div>
        <Crosshair className="top-2 left-2" />
        <Crosshair className="top-2 right-2" rotate={90} />
        <Crosshair className="bottom-2 left-2" rotate={-90} />
        <Crosshair className="bottom-2 right-2" rotate={180} />
      </div>

      {/* Station info popover */}
      <AnimatePresence mode="wait">
        {station && (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10 max-w-md w-[90vw]"
          >
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
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--muted)]">
                  {sceneMode === "parked" ? "click to enter" : "rover en route"}
                </p>
              </div>
              <h3 className="mt-1.5 font-display text-2xl text-[var(--fg)]">
                {station.label}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
                {station.oneLiner}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warm-white flash overlay — handoff between scene and destination page */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            key="flash"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "radial-gradient(closest-side, #fff5d4 0%, #f3c66b 55%, #fff5d4 100%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>
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
      <p
        className="mt-1"
        style={{ color: parked.palette.accent }}
      >
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
      en route · {target?.label ?? "—"}
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
