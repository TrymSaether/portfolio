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
  });

  const motifGeometry = useMotifGeometry(station.motif);

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
        <meshBasicMaterial color="#f3c66b" transparent opacity={0.95} toneMapped={false} />
      </mesh>

      {/* Outer halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.42, 0.78, 64]} />
        <meshBasicMaterial
          color="#f3c66b"
          transparent
          opacity={0.18}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulse expanding outward */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0035, 0]}>
        <ringGeometry args={[0.4, 0.46, 64]} />
        <meshBasicMaterial
          color="#f3c66b"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Motif sculpture */}
      <group position={[0, 0, 0]}>{motifGeometry}</group>

      {/* Vertical light beam — taller and softer */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.014, 0.022, 2.8, 8]} />
        <meshBasicMaterial color="#f3c66b" transparent opacity={0.22} toneMapped={false} />
      </mesh>
      {/* Beam beacon at the top */}
      <mesh ref={beaconRef} position={[0, 2.78, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#f6f1e6" transparent opacity={0.95} toneMapped={false} />
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
          color="#f3c66b"
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

function useMotifGeometry(motif: Station["motif"]) {
  return useMemo(() => {
    const gold = new THREE.MeshStandardMaterial({
      color: "#f3c66b",
      emissive: "#d4a14a",
      emissiveIntensity: 1.6,
      roughness: 0.32,
      metalness: 0.55,
    });
    const cream = new THREE.MeshStandardMaterial({
      color: "#ddd0b6",
      emissive: "#7a6a4a",
      emissiveIntensity: 0.25,
      roughness: 0.6,
      metalness: 0.2,
    });
    const ink = new THREE.MeshStandardMaterial({
      color: "#1d273d",
      emissive: "#0f1523",
      emissiveIntensity: 0.4,
      roughness: 0.6,
      metalness: 0.55,
    });

    switch (motif) {
      case "observatory":
        return (
          <group>
            {/* Plinth */}
            <mesh material={ink} position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.12, 16]} />
            </mesh>
            {/* Tower */}
            <mesh material={cream} position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.1, 0.13, 0.32, 16]} />
            </mesh>
            {/* Dome */}
            <mesh material={gold} position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>
            {/* Slit */}
            <mesh material={ink} position={[0, 0.5, 0.16]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.16, 0.005]} />
            </mesh>
          </group>
        );
      case "cabin":
        return (
          <group>
            {/* Body */}
            <mesh material={cream} position={[0, 0.12, 0]}>
              <boxGeometry args={[0.36, 0.22, 0.28]} />
            </mesh>
            {/* Roof */}
            <mesh material={gold} position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[0.28, 0.18, 4]} />
            </mesh>
            {/* Window glow */}
            <mesh position={[0.181, 0.13, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.08, 0.08]} />
              <meshBasicMaterial color="#f3c66b" toneMapped={false} />
            </mesh>
            {/* Chimney */}
            <mesh material={ink} position={[-0.08, 0.42, -0.06]}>
              <boxGeometry args={[0.04, 0.1, 0.04]} />
            </mesh>
          </group>
        );
      case "radio":
        return (
          <group>
            {/* Base */}
            <mesh material={ink} position={[0, 0.04, 0]}>
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
                  material={cream}
                  position={[x * 0.5, 0.36, z * 0.5]}
                  rotation={[-z * 1.2, 0, x * 1.2]}
                >
                  <cylinderGeometry args={[0.006, 0.006, 0.6, 6]} />
                </mesh>
              );
            })}
            {/* Top antenna */}
            <mesh material={gold} position={[0, 0.78, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.2, 6]} />
            </mesh>
            <mesh material={gold} position={[0, 0.9, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
            </mesh>
            {/* Crossbeams */}
            {[0.25, 0.45].map((y, i) => (
              <mesh key={i} material={cream} position={[0, y, 0]}>
                <torusGeometry args={[0.06, 0.005, 6, 12]} />
              </mesh>
            ))}
          </group>
        );
      case "crystal":
        return (
          <group rotation={[0, Math.PI / 5, 0]}>
            <mesh material={ink} position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.22, 0.26, 0.06, 6]} />
            </mesh>
            {/* Big crystal */}
            <mesh material={gold} position={[0, 0.32, 0]}>
              <octahedronGeometry args={[0.22, 0]} />
            </mesh>
            {/* Smaller satellites */}
            <mesh material={cream} position={[0.18, 0.18, 0.05]}>
              <octahedronGeometry args={[0.07, 0]} />
            </mesh>
            <mesh material={cream} position={[-0.16, 0.16, -0.08]}>
              <octahedronGeometry args={[0.06, 0]} />
            </mesh>
          </group>
        );
      case "compass":
        return (
          <group>
            {/* Disc */}
            <mesh material={ink} position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.06, 32]} />
            </mesh>
            {/* Outer ring */}
            <mesh material={gold} position={[0, 0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.22, 0.012, 8, 32]} />
            </mesh>
            {/* Inner ring */}
            <mesh material={cream} position={[0, 0.092, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.13, 0.008, 6, 24]} />
            </mesh>
            {/* Needle */}
            <mesh material={gold} position={[0, 0.12, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[0.022, 0.4, 4]} />
            </mesh>
            <mesh material={cream} position={[0, 0.12, 0]} rotation={[0, -3 * Math.PI / 4, 0]}>
              <coneGeometry args={[0.018, 0.32, 4]} />
            </mesh>
          </group>
        );
      case "notebook":
        return (
          <group rotation={[0, -Math.PI / 6, 0]}>
            {/* Stack base */}
            <mesh material={ink} position={[0, 0.03, 0]}>
              <boxGeometry args={[0.42, 0.05, 0.3]} />
            </mesh>
            {/* Open notebook */}
            <mesh material={cream} position={[-0.05, 0.07, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.22, 0.01, 0.28]} />
            </mesh>
            <mesh material={cream} position={[0.13, 0.07, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.22, 0.01, 0.28]} />
            </mesh>
            {/* Quill / pen */}
            <mesh material={gold} position={[0.18, 0.09, 0.08]} rotation={[0, 0.6, 0.4]}>
              <cylinderGeometry args={[0.005, 0.008, 0.22, 6]} />
            </mesh>
            {/* Tiny ink dot */}
            <mesh material={gold} position={[0.05, 0.085, 0.04]}>
              <sphereGeometry args={[0.012, 8, 8]} />
            </mesh>
          </group>
        );
    }
  }, [motif]);
}
