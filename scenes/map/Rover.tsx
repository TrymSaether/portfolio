"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { stations } from "@/content/stations";
import {
  parkedFacingPoint,
  parkedWorldPos,
  terrainNormal,
} from "./topography";
import { useSceneStore } from "./sceneStore";

/**
 * The rover sits parked at the current parked station. Its only job is
 * presence: idle bob, terrain-aligned up vector, headlight tinted by the
 * station it's parked at. Click-to-fly is handled by the camera; the rover
 * does not drive between stations in this version of the experience.
 *
 * Model authoring convention: forward = -Z (so the headlight faces -Z). The
 * inner wrapper rotates by π so that the outer group's lookAt — which orients
 * +Z toward the target — points the model's headlight at the target.
 */

export function Rover() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const beaconRef = useRef<THREE.Mesh>(null);
  const headlightRef = useRef<THREE.Mesh>(null);
  const headlightLightRef = useRef<THREE.PointLight>(null);
  const flagRef = useRef<THREE.Mesh>(null);

  // Smoothed quantities (low-passed for jitter-free motion when station changes)
  const smoothedUp = useRef(new THREE.Vector3(0, 1, 0));
  const smoothedHeading = useRef(new THREE.Vector3(0, 0, 1));
  const smoothedPos = useRef<THREE.Vector3 | null>(null);

  const headlightColor = useRef(new THREE.Color("#fff5d4"));
  const targetHeadlightColor = useRef(new THREE.Color("#fff5d4"));

  const tmpTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const t = performance.now() / 1000;
    const store = useSceneStore.getState();
    const stationIndex = store.parkedStationIndex;

    const targetPos = parkedWorldPos(stationIndex).clone();
    targetPos.y += Math.sin(t * 1.4 + stationIndex) * 0.008;

    // Smooth station-to-station transitions when parkedStationIndex changes
    if (smoothedPos.current === null) {
      smoothedPos.current = targetPos.clone();
    } else {
      smoothedPos.current.lerp(targetPos, 1 - Math.exp(-6 * dt));
    }

    const lookTarget = parkedFacingPoint(stationIndex);

    // Surface alignment (smoothed)
    const targetUp = terrainNormal(smoothedPos.current.x, smoothedPos.current.z);
    smoothedUp.current.lerp(targetUp, 0.18).normalize();

    const targetFwd = tmpTarget.copy(lookTarget).sub(smoothedPos.current);
    targetFwd.y = 0;
    if (targetFwd.lengthSq() > 1e-6) {
      targetFwd.normalize();
      smoothedHeading.current.lerp(targetFwd, 0.25).normalize();
    }

    tmpTarget.copy(smoothedPos.current).add(smoothedHeading.current);

    groupRef.current.position.copy(smoothedPos.current);
    groupRef.current.up.copy(smoothedUp.current);
    groupRef.current.lookAt(tmpTarget);

    // Headlight tint matches whichever station we're parked at
    targetHeadlightColor.current.set(stations[stationIndex].palette.tint);
    headlightColor.current.lerp(targetHeadlightColor.current, 0.08);

    if (headlightRef.current) {
      const m = headlightRef.current.material as THREE.MeshBasicMaterial;
      m.color.copy(headlightColor.current);
      m.opacity = 0.55;
    }
    if (headlightLightRef.current) {
      headlightLightRef.current.color.copy(headlightColor.current);
      headlightLightRef.current.intensity = 0.6;
    }
    if (beaconRef.current) {
      const m = beaconRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.65 + Math.sin(t * 2 + stationIndex) * 0.25;
    }
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 1.8) * 0.22;
    }
    // Wheels spin gently while parked — like an idling engine
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x += dt * 0.3;
    });
  });

  // Materials
  const cream = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e9e4d1",
        roughness: 0.45,
        metalness: 0.45,
      }),
    [],
  );
  const dark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1d273d",
        roughness: 0.65,
        metalness: 0.4,
      }),
    [],
  );
  const solar = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a3651",
        roughness: 0.2,
        metalness: 0.85,
        emissive: "#7aa6e8",
        emissiveIntensity: 0.2,
      }),
    [],
  );
  const goldAccent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f3c66b",
        emissive: "#f3c66b",
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [],
  );
  const tire = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f1523",
        roughness: 0.85,
      }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#cfdcf2",
        transmission: 0.55,
        thickness: 0.2,
        roughness: 0.1,
        metalness: 0,
        opacity: 0.6,
        transparent: true,
      }),
    [],
  );

  return (
    <group ref={groupRef}>
      <group rotation={[0, Math.PI, 0]}>
        {/* Lower chassis (skid plate) */}
        <mesh material={dark} position={[0, -0.01, 0]}>
          <boxGeometry args={[0.24, 0.06, 0.36]} />
        </mesh>
        {/* Upper chassis */}
        <mesh material={cream} position={[0, 0.06, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.34]} />
        </mesh>
        {/* Cabin (glass dome) — sits over the front half */}
        <mesh material={glass} position={[0, 0.13, -0.04]}>
          <sphereGeometry args={[0.09, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>
        {/* Tiny driver figure under the dome */}
        <mesh material={dark} position={[0, 0.115, -0.04]}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
        {/* Solar panel — rear */}
        <mesh material={solar} position={[0, 0.115, 0.08]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.18, 0.008, 0.16]} />
        </mesh>
        {/* Solar panel cell separators */}
        {[-0.05, 0, 0.05].map((dz) => (
          <mesh key={dz} material={dark} position={[0, 0.12, 0.08 + dz]}>
            <boxGeometry args={[0.16, 0.001, 0.005]} />
          </mesh>
        ))}
        {/* Antenna mast — back-right corner */}
        <mesh material={cream} position={[0.08, 0.18, 0.13]}>
          <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
        </mesh>
        {/* Antenna beacon */}
        <mesh ref={beaconRef} position={[0.08, 0.31, 0.13]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color="#f3c66b" transparent opacity={0.9} toneMapped={false} />
        </mesh>
        {/* Pennant flag */}
        <group ref={flagRef} position={[0.08, 0.26, 0.13]}>
          <mesh material={goldAccent} position={[0.04, 0, 0]}>
            <planeGeometry args={[0.08, 0.04]} />
          </mesh>
        </group>
        {/* Headlight cone — points forward (-Z in model frame) */}
        <mesh
          ref={headlightRef}
          position={[0, 0.05, -0.19]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.05, 0.08, 12]} />
          <meshBasicMaterial color="#fff5d4" transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <pointLight
          ref={headlightLightRef}
          position={[0, 0.06, -0.32]}
          intensity={0.6}
          distance={2.4}
          decay={2}
          color="#fff5d4"
        />
        {/* Wheels — front pair at -Z, rear pair at +Z, axles along X */}
        {[
          [-0.13, -0.04, -0.13],
          [0.13, -0.04, -0.13],
          [-0.13, -0.04, 0.13],
          [0.13, -0.04, 0.13],
        ].map(([x, y, z], i) => (
          <group key={i} position={[x, y, z]}>
            <mesh
              ref={(el) => {
                if (el) wheelRefs.current[i] = el;
              }}
              material={tire}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.055, 0.055, 0.04, 16]} />
            </mesh>
            <mesh material={cream} rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.022 : -0.022, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.005, 12]} />
            </mesh>
          </group>
        ))}
        <pointLight color="#f3c66b" intensity={0.5} distance={1.0} decay={2} position={[0, 0.05, 0]} />
      </group>
    </group>
  );
}
