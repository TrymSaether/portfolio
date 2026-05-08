"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { stations, type Station } from "@/content/stations";
import { stationWorldPos } from "./topography";

interface StationsProps {
  active: string | null;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function Stations({ active, hovered, onHover, onSelect }: StationsProps) {
  return (
    <group>
      {stations.map((s) => (
        <StationMarker
          key={s.id}
          station={s}
          isActive={active === s.id}
          isHovered={hovered === s.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

interface MotifRefs {
  /** Optional spinning element specific to this motif. */
  spinner?: React.RefObject<THREE.Object3D | null>;
  /** Optional secondary animator (e.g. orbiting crystal). */
  orbiter?: React.RefObject<THREE.Object3D | null>;
}

function StationMarker({
  station,
  isActive,
  isHovered,
  onHover,
  onSelect,
}: {
  station: Station;
  isActive: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const motifRefs = useRef<MotifRefs>({});

  const basePos = useMemo(() => stationWorldPos(station.position), [station.position]);

  useFrame((state, dt) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Hover scale
    const targetScale = isHovered || isActive ? 1.08 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12,
    );

    if (ringRef.current) ringRef.current.rotation.z += dt * 0.3;
    if (pulseRef.current) {
      const phase = (t * 0.6 + station.index * 0.4) % 1;
      pulseRef.current.scale.setScalar(0.6 + phase * 1.6);
      const m = pulseRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - phase) * 0.45;
    }
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.65 + Math.sin(t * 2 + station.index) * 0.25;
    }

    // Motif-specific animations
    if (motifRefs.current.spinner?.current) {
      const speeds: Record<Station["motif"], number> = {
        observatory: 0.18,
        compass: 0.55,
        crystal: 0.24,
        radio: 0.4,
        notebook: 0.3,
        cabin: 0.0,
      };
      motifRefs.current.spinner.current.rotation.y += dt * speeds[station.motif];
    }
    if (motifRefs.current.orbiter?.current && station.motif === "crystal") {
      motifRefs.current.orbiter.current.rotation.y -= dt * 0.6;
    }
    if (motifRefs.current.orbiter?.current && station.motif === "cabin") {
      // Smoke from the cabin chimney drifts up
      motifRefs.current.orbiter.current.position.y = 0.5 + ((t * 0.18) % 0.4);
      const m = (motifRefs.current.orbiter.current as THREE.Mesh).material as
        | THREE.MeshBasicMaterial
        | undefined;
      if (m) m.opacity = 0.4 - ((t * 0.18) % 0.4);
    }
    if (motifRefs.current.orbiter?.current && station.motif === "notebook") {
      // Notebook page flips slightly
      motifRefs.current.orbiter.current.rotation.x =
        Math.sin(t * 1.2) * 0.18 - 0.4;
    }
  });

  const motifGeometry = useMotifGeometry(station, motifRefs.current);

  const accent = station.palette.accent;
  const tint = station.palette.tint;

  return (
    <group
      ref={groupRef}
      position={[basePos.x, basePos.y, basePos.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover(station.id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(station.id);
      }}
    >
      {/* Inner glowing ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.34, 0.4, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} toneMapped={false} />
      </mesh>

      {/* Outer halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.42, 0.78, 64]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.18}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulse expanding outward */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0035, 0]}>
        <ringGeometry args={[0.4, 0.46, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} toneMapped={false} />
      </mesh>

      {/* Motif sculpture */}
      <group position={[0, 0, 0]}>{motifGeometry}</group>

      {/* Vertical light beam */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.014, 0.022, 2.8, 8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.22} toneMapped={false} />
      </mesh>
      {/* Beam beacon at the top */}
      <mesh ref={beaconRef} position={[0, 2.78, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={tint} transparent opacity={0.95} toneMapped={false} />
      </mesh>

      {/* Floating label */}
      <Billboard position={[0, 1.05, 0]}>
        <Text
          fontSize={0.16}
          color="#f6f1e6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.006}
          outlineColor="#07090e"
          letterSpacing={0.02}
        >
          {station.label}
        </Text>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.075}
          color={accent}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          {`${station.glyph} · ${station.subtitle}`}
        </Text>
      </Billboard>
    </group>
  );
}

function useMotifGeometry(station: Station, refs: MotifRefs) {
  const { motif, palette } = station;
  return useMemo(() => {
    const accentMat = new THREE.MeshStandardMaterial({
      color: palette.accent,
      emissive: palette.accent,
      emissiveIntensity: 1.4,
      roughness: 0.32,
      metalness: 0.55,
    });
    const tintMat = new THREE.MeshStandardMaterial({
      color: palette.tint,
      emissive: palette.tint,
      emissiveIntensity: 0.25,
      roughness: 0.6,
      metalness: 0.2,
    });
    const coolMat = new THREE.MeshStandardMaterial({
      color: palette.cool,
      emissive: palette.cool,
      emissiveIntensity: 0.4,
      roughness: 0.6,
      metalness: 0.55,
    });

    const spinnerRef = { current: null as THREE.Object3D | null };
    refs.spinner = spinnerRef as React.RefObject<THREE.Object3D | null>;
    const orbiterRef = { current: null as THREE.Object3D | null };
    refs.orbiter = orbiterRef as React.RefObject<THREE.Object3D | null>;

    switch (motif) {
      case "observatory":
        return (
          <group>
            <mesh material={coolMat} position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.12, 16]} />
            </mesh>
            <mesh material={tintMat} position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.1, 0.13, 0.32, 16]} />
            </mesh>
            {/* Rotating dome */}
            <group ref={(el) => { spinnerRef.current = el; }} position={[0, 0.5, 0]}>
              <mesh material={accentMat}>
                <sphereGeometry args={[0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              <mesh material={coolMat} position={[0, 0, 0.16]}>
                <boxGeometry args={[0.04, 0.16, 0.005]} />
              </mesh>
            </group>
          </group>
        );
      case "cabin":
        return (
          <group>
            {/* Body — cool wood tone */}
            <mesh material={tintMat} position={[0, 0.12, 0]}>
              <boxGeometry args={[0.36, 0.22, 0.28]} />
            </mesh>
            {/* Roof with accent */}
            <mesh material={accentMat} position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[0.28, 0.18, 4]} />
            </mesh>
            {/* Window glow */}
            <mesh position={[0.181, 0.13, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.08, 0.08]} />
              <meshBasicMaterial color={palette.tint} toneMapped={false} />
            </mesh>
            {/* Door */}
            <mesh material={coolMat} position={[0, 0.07, 0.141]}>
              <planeGeometry args={[0.06, 0.12]} />
            </mesh>
            {/* Chimney */}
            <mesh material={coolMat} position={[-0.08, 0.42, -0.06]}>
              <boxGeometry args={[0.04, 0.1, 0.04]} />
            </mesh>
            {/* Smoke puff (orbiter — drifts upward) */}
            <mesh
              ref={(el) => { orbiterRef.current = el; }}
              position={[-0.08, 0.5, -0.06]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial
                color={palette.tint}
                transparent
                opacity={0.4}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      case "radio":
        return (
          <group>
            {/* Base */}
            <mesh material={coolMat} position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.06, 8]} />
            </mesh>
            {/* Lattice mast — 4 inclined struts */}
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2;
              const x = Math.cos(a) * 0.07;
              const z = Math.sin(a) * 0.07;
              return (
                <mesh
                  key={i}
                  material={tintMat}
                  position={[x * 0.5, 0.36, z * 0.5]}
                  rotation={[-z * 1.2, 0, x * 1.2]}
                >
                  <cylinderGeometry args={[0.006, 0.006, 0.6, 6]} />
                </mesh>
              );
            })}
            {/* Crossbeams */}
            {[0.25, 0.45].map((y, i) => (
              <mesh key={i} material={tintMat} position={[0, y, 0]}>
                <torusGeometry args={[0.06, 0.005, 6, 12]} />
              </mesh>
            ))}
            {/* Top antenna */}
            <mesh material={accentMat} position={[0, 0.78, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.2, 6]} />
            </mesh>
            {/* Rotating dish on top */}
            <group ref={(el) => { spinnerRef.current = el; }} position={[0, 0.9, 0]}>
              <mesh material={accentMat} rotation={[Math.PI / 2.5, 0, 0]}>
                <coneGeometry args={[0.06, 0.04, 16, 1, true]} />
              </mesh>
              <mesh material={accentMat} position={[0, 0.04, 0]}>
                <sphereGeometry args={[0.018, 12, 12]} />
              </mesh>
            </group>
          </group>
        );
      case "crystal":
        return (
          <group>
            <mesh material={coolMat} position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.22, 0.26, 0.06, 6]} />
            </mesh>
            {/* Big spinning crystal */}
            <group ref={(el) => { spinnerRef.current = el; }} position={[0, 0.32, 0]}>
              <mesh material={accentMat}>
                <octahedronGeometry args={[0.22, 0]} />
              </mesh>
            </group>
            {/* Orbiting smaller crystals */}
            <group ref={(el) => { orbiterRef.current = el; }} position={[0, 0.32, 0]}>
              <mesh material={tintMat} position={[0.32, 0, 0]}>
                <octahedronGeometry args={[0.05, 0]} />
              </mesh>
              <mesh material={tintMat} position={[-0.28, 0.06, 0.18]}>
                <octahedronGeometry args={[0.04, 0]} />
              </mesh>
              <mesh material={tintMat} position={[0.1, -0.04, -0.32]}>
                <octahedronGeometry args={[0.045, 0]} />
              </mesh>
            </group>
          </group>
        );
      case "compass":
        return (
          <group>
            {/* Disc */}
            <mesh material={coolMat} position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.06, 32]} />
            </mesh>
            {/* Outer ring */}
            <mesh material={accentMat} position={[0, 0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.22, 0.012, 8, 32]} />
            </mesh>
            {/* Inner ring */}
            <mesh material={tintMat} position={[0, 0.092, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.13, 0.008, 6, 24]} />
            </mesh>
            {/* Cardinal marks */}
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  material={tintMat}
                  position={[Math.cos(a) * 0.2, 0.092, Math.sin(a) * 0.2]}
                >
                  <boxGeometry args={[0.02, 0.005, 0.02]} />
                </mesh>
              );
            })}
            {/* Spinning needle */}
            <group ref={(el) => { spinnerRef.current = el; }} position={[0, 0.12, 0]}>
              <mesh material={accentMat} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.022, 0.4, 4]} />
              </mesh>
              <mesh material={tintMat} rotation={[0, Math.PI, 0]}>
                <coneGeometry args={[0.018, 0.32, 4]} />
              </mesh>
            </group>
          </group>
        );
      case "notebook":
        return (
          <group rotation={[0, -Math.PI / 6, 0]}>
            {/* Stack base */}
            <mesh material={coolMat} position={[0, 0.03, 0]}>
              <boxGeometry args={[0.42, 0.05, 0.3]} />
            </mesh>
            {/* Open notebook — flapping page on the right */}
            <mesh material={tintMat} position={[-0.05, 0.07, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.22, 0.01, 0.28]} />
            </mesh>
            <mesh
              material={tintMat}
              ref={(el) => { orbiterRef.current = el; }}
              position={[0.13, 0.07, 0]}
              rotation={[0, 0, -0.2]}
            >
              <boxGeometry args={[0.22, 0.01, 0.28]} />
            </mesh>
            {/* Spinning quill above */}
            <group ref={(el) => { spinnerRef.current = el; }} position={[0.18, 0.16, 0.05]}>
              <mesh material={accentMat} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.005, 0.008, 0.22, 6]} />
              </mesh>
            </group>
            {/* Inkwell */}
            <mesh material={accentMat} position={[-0.15, 0.06, 0.1]}>
              <cylinderGeometry args={[0.025, 0.03, 0.04, 12]} />
            </mesh>
            {/* Tiny ink dot */}
            <mesh material={accentMat} position={[0.05, 0.085, 0.04]}>
              <sphereGeometry args={[0.012, 8, 8]} />
            </mesh>
          </group>
        );
    }
  }, [motif, palette.accent, palette.cool, palette.tint, refs]);
}
