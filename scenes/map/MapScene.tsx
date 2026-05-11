"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useThree } from "@react-three/fiber";
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
import { useSceneColors, useIsLightTheme } from "@/lib/useThemeColors";

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
  const sceneColors = useSceneColors();
  const isLight = useIsLightTheme();
  const sceneBg = sceneColors["--scene-bg"] || "#07090e";
  const sceneFog = sceneColors["--scene-fog"] || "#0a0e17";

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

    // Flash starts late, after the rover has traced most of the dispatch route.
    const flashStart = window.setTimeout(
      () => setFlashing(true),
      flightDuration * 1000 * 0.86,
    );
    // Navigate at peak (arc has just landed)
    const navTimer = window.setTimeout(
      () => {
        useSceneStore.getState().parkAt(targetIndex);
        router.push(target.href);
      },
      flightDuration * 1000 + 120,
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
    if (targetIndex === cur.parkedStationIndex) {
      router.push(stations[targetIndex].href);
      return;
    }

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
          scene.fog = new THREE.Fog(sceneFog, 18, 46);
        }}
      >
        <color attach="background" args={[sceneBg]} />
        <SceneFog color={sceneFog} />
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, dpr + 0.2))}
          onDecline={() => setDpr(Math.max(0.9, dpr - 0.2))}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <hemisphereLight
          args={[
            sceneColors["--scene-light-hemi-a"] || "#3a4a78",
            sceneColors["--scene-light-hemi-b"] || "#0a0e17",
            isLight ? 0.85 : 0.5,
          ]}
        />
        <directionalLight
          position={[6, 10, 4]}
          intensity={isLight ? 1.0 : 1.4}
          color={sceneColors["--scene-light-key"] || "#f3c66b"}
        />
        <directionalLight
          position={[-8, 4, -6]}
          intensity={isLight ? 0.25 : 0.4}
          color={sceneColors["--scene-light-fill"] || "#74c0c8"}
        />

        <CameraRig />

        <Suspense fallback={null}>
          <Sky colors={sceneColors} isLight={isLight} />
          <Terrain
            inkLow={sceneColors["--scene-low"] || "#0a0e17"}
            inkHigh={sceneColors["--scene-high"] || "#2a3651"}
            contour={sceneColors["--scene-contour"] || "#a7b3cd"}
            glow={sceneColors["--scene-glow"] || "#f3c66b"}
            vignette={parseFloat(sceneColors["--scene-vignette"] || "0.45")}
          />
          <RoutePaths />
          <Stations
            hovered={hovered}
            active={active}
            onHover={setHovered}
            onSelect={handleStationSelect}
          />
          <Rover />
          <Atmosphere colors={sceneColors} />
        </Suspense>

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={isLight ? 0.45 : 0.95}
            luminanceThreshold={isLight ? 0.7 : 0.45}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={isLight ? 0.45 : 0.85} />
        </EffectComposer>
      </Canvas>

      {/* Cinematic frame overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 left-4 sm:top-20 sm:left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
          <p>Atlas / sheet 01</p>
          <p className="mt-1 text-[var(--accent)]">Trondheim · 63°25′N 10°24′E</p>
        </div>
        <div className="absolute top-16 right-4 sm:top-20 sm:right-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)] text-right">
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
            className="absolute inset-0 z-30 pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.92 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.6, 1] }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sceneMode === "flying" && station && (
          <motion.div
            key={`dispatch-${station.id}`}
            className="pointer-events-none absolute left-1/2 top-[18%] z-20 hidden -translate-x-1/2 sm:block"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-full border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--bg)_58%,transparent)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] shadow-[0_0_42px_-18px_var(--accent)] backdrop-blur-md">
              dispatching rover · {station.glyph} {station.label}
            </div>
          </motion.div>
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
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--muted)]">
          {sceneMode === "parked" ? "click to enter" : "in flight"}
        </p>
      </div>
      <h3 className="mt-1.5 font-display text-2xl text-[var(--fg)]">
        {station.label}
      </h3>
      <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
        {station.oneLiner}
      </p>
      {expanded && (
        <div
          className="mt-4 pt-4 border-t border-[var(--line)] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{
            borderColor: `color-mix(in oklab, ${station.palette.accent} 18%, transparent)`,
          }}
        >
          <span className="text-[var(--muted)]">station {station.glyph}</span>
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
      style={{ color: target?.palette.accent ?? "var(--accent)" }}
    >
      flight · {target?.label ?? "—"}
    </p>
  );
}

function SceneFog({ color }: { color: string }) {
  const { scene } = useThree();
  useEffect(() => {
    if (scene.fog && (scene.fog as THREE.Fog).color) {
      (scene.fog as THREE.Fog).color.set(color);
    } else {
      scene.fog = new THREE.Fog(color, 18, 46);
    }
  }, [scene, color]);
  return null;
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
      color="var(--accent)"
    >
      <path d="M2 2 L2 8" />
      <path d="M2 2 L8 2" />
    </svg>
  );
}
