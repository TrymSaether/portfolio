"use client";

import { Suspense, useState } from "react";
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

export function MapScene() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [dpr, setDpr] = useState(1.4);
  const router = useRouter();
  const station = stations.find((s) => s.id === (hovered ?? active));

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
            onSelect={(id) => {
              setActive(id);
              const s = stations.find((x) => x.id === id);
              if (s) {
                // Tiny delay so the click ring animation is visible
                setTimeout(() => router.push(s.href), 220);
              }
            }}
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
        {/* Top-left HUD */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-200)]/70">
          <p>Atlas / sheet 01</p>
          <p className="mt-1 text-[var(--color-gold-400)]">Trondheim · 63°25′N</p>
        </div>
        {/* Top-right HUD */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-200)]/70 text-right">
          <p>{stations.length} stations</p>
          <p className="mt-1 text-[var(--color-gold-400)]">rover · drift 1.4 m·s⁻¹</p>
        </div>
        {/* Corner crosshairs */}
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
            <div className="glow-card rounded-2xl px-5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-gold-400)]">
                  {station.glyph} · {station.subtitle}
                </p>
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--muted)]">
                  click to enter
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
    </div>
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
