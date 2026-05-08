"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { stations } from "@/content/stations";
import {
  buildAllPaths,
  directionalCurve,
  elevation,
  parkedFacingPoint,
  parkedWorldPos,
  terrainNormal,
} from "./topography";
import { easeInOutCubic, useSceneStore } from "./sceneStore";

/**
 * Rover with three behaviors:
 *  – parked: sits at the parked station, faces away from the station center,
 *            sat on the surface with its up axis aligned to the terrain normal.
 *  – driving: animates along the directional curve from parked → target,
 *             aligned to the path tangent and surface normal, banks on turns.
 *  – arriving: parked at destination while the camera arcs in.
 *
 * The rover model uses standard three.js orientation: forward is -Z. This lets
 * us drive the rover via Object3D.lookAt + a custom up vector for proper
 * surface alignment without quaternion gymnastics.
 */

const WORLD_Y = new THREE.Vector3(0, 1, 0);

export function Rover() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const beaconRef = useRef<THREE.Mesh>(null);
  const headlightRef = useRef<THREE.Mesh>(null);
  const headlightLightRef = useRef<THREE.PointLight>(null);
  const flagRef = useRef<THREE.Mesh>(null);

  const driveCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const drivePhaseStartRef = useRef<number>(0);
  const driveTargetIndexRef = useRef<number | null>(null);

  const allPaths = useMemo(() => buildAllPaths(), []);

  // Smoothed quantities (low-passed each frame for jitter-free motion)
  const smoothedUp = useRef(new THREE.Vector3(0, 1, 0));
  const smoothedHeading = useRef(new THREE.Vector3());
  const smoothedRoll = useRef(0);
  const lastPos = useRef(new THREE.Vector3());
  const lastYaw = useRef<number | null>(null);

  const headlightColor = useRef(new THREE.Color("#fff5d4"));
  const targetHeadlightColor = useRef(new THREE.Color("#fff5d4"));

  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const tmpForward = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const store = useSceneStore.getState();

    // (Re)build the directional curve when a new drive begins
    if (
      store.mode === "driving" &&
      store.toStationIndex !== null &&
      (driveTargetIndexRef.current !== store.toStationIndex ||
        drivePhaseStartRef.current !== store.phaseStart)
    ) {
      driveCurveRef.current = directionalCurve(
        allPaths,
        store.parkedStationIndex,
        store.toStationIndex,
      );
      driveTargetIndexRef.current = store.toStationIndex;
      drivePhaseStartRef.current = store.phaseStart;
    }
    if (store.mode !== "driving") {
      driveCurveRef.current = null;
      driveTargetIndexRef.current = null;
    }

    // Update target headlight color based on relevant station
    const destIndex =
      store.mode === "parked" ? store.parkedStationIndex : store.toStationIndex;
    if (destIndex !== null) {
      targetHeadlightColor.current.set(stations[destIndex].palette.tint);
    }
    headlightColor.current.lerp(targetHeadlightColor.current, 0.08);

    let pos: THREE.Vector3;
    let lookTarget: THREE.Vector3;
    let driveU = 0;

    if (store.mode === "driving" && driveCurveRef.current) {
      const elapsed = now - store.phaseStart;
      driveU = Math.min(1, elapsed / store.driveDuration);
      const eased = easeInOutCubic(driveU);

      pos = driveCurveRef.current.getPointAt(eased).clone();
      // Snap rover to the actual surface (curve points already include +0.085
      // hover, but resampling elevation here insulates against curve overshoot).
      pos.y = elevation(pos.x, pos.z) + 0.09;

      // Look-ahead along the curve, far enough to avoid jitter from segment seams
      const aheadU = Math.min(1, eased + 0.04);
      const ahead = driveCurveRef.current.getPointAt(aheadU);
      tmpForward.set(ahead.x - pos.x, 0, ahead.z - pos.z).normalize();
      lookTarget = tmpTarget
        .copy(pos)
        .add(tmpForward) // straight horizontal target — pitch comes from up vector
        .clone();

      if (driveU >= 1) store.beginArrive(now);
    } else {
      // Parked / arriving — sit at the station's parking spot
      const stationIndex =
        store.mode === "arriving" && store.toStationIndex !== null
          ? store.toStationIndex
          : store.parkedStationIndex;
      const parked = parkedWorldPos(stationIndex);
      pos = parked.clone();
      pos.y = elevation(pos.x, pos.z) + 0.09;
      // Add the gentlest idle bob (along surface normal handled below)
      pos.y += Math.sin(t * 1.4 + stationIndex) * 0.008;
      lookTarget = parkedFacingPoint(stationIndex);
    }

    // Surface alignment: use terrain normal as up vector, smoothed
    const targetUp = terrainNormal(pos.x, pos.z);
    smoothedUp.current.lerp(targetUp, 0.18).normalize();

    // Smooth the horizontal forward direction too
    const targetFwd = tmpTarget
      .copy(lookTarget)
      .sub(pos);
    targetFwd.y = 0;
    if (targetFwd.lengthSq() > 1e-6) {
      targetFwd.normalize();
      smoothedHeading.current.lerp(targetFwd, 0.25).normalize();
    } else if (smoothedHeading.current.lengthSq() < 1e-6) {
      smoothedHeading.current.set(0, 0, 1);
    }

    // Compose world-space lookAt target along the smoothed forward
    tmpTarget.copy(pos).add(smoothedHeading.current);

    // Banking: roll around the local forward axis, proportional to yaw rate
    const yaw = Math.atan2(smoothedHeading.current.x, smoothedHeading.current.z);
    let yawRate = 0;
    if (lastYaw.current !== null) {
      let dy = yaw - lastYaw.current;
      // Wrap to [-π, π]
      if (dy > Math.PI) dy -= Math.PI * 2;
      if (dy < -Math.PI) dy += Math.PI * 2;
      yawRate = dy / Math.max(dt, 1e-3);
    }
    lastYaw.current = yaw;
    const targetRoll = THREE.MathUtils.clamp(-yawRate * 0.35, -0.4, 0.4);
    smoothedRoll.current = THREE.MathUtils.lerp(smoothedRoll.current, targetRoll, 0.12);

    // Apply pose: position, lookAt with custom up, then add roll
    groupRef.current.position.copy(pos);
    groupRef.current.up.copy(smoothedUp.current);
    groupRef.current.lookAt(tmpTarget);
    // Local Z roll for bank
    groupRef.current.rotateZ(smoothedRoll.current);

    // Wheel spin proportional to actual translational speed
    const dx = pos.x - lastPos.current.x;
    const dz = pos.z - lastPos.current.z;
    const speed = Math.hypot(dx, dz) / Math.max(dt, 1e-3);
    lastPos.current.copy(pos);
    const wheelSpin = Math.min(40, speed * 12);
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x += dt * wheelSpin;
    });

    if (beaconRef.current) {
      const flash = store.mode === "driving" ? 1.4 : 1.0;
      const m = beaconRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.65 + Math.sin(t * 6 * flash) * 0.3;
    }
    if (headlightRef.current) {
      const m = headlightRef.current.material as THREE.MeshBasicMaterial;
      m.color.copy(headlightColor.current);
      m.opacity = store.mode === "driving" ? 0.95 : 0.4;
    }
    if (headlightLightRef.current) {
      headlightLightRef.current.color.copy(headlightColor.current);
      headlightLightRef.current.intensity = store.mode === "driving" ? 1.6 : 0.5;
    }
    if (flagRef.current) {
      const breeze = store.mode === "driving" ? 5 : 2.2;
      flagRef.current.rotation.y = Math.sin(t * breeze) * 0.3;
    }
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

  // Forward = -Z. Length is along Z axis (front -Z, back +Z), width along X.
  return (
    <group ref={groupRef}>
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
        <mesh
          key={dz}
          material={dark}
          position={[0, 0.12, 0.08 + dz]}
        >
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
      {/* Pennant flag — flutters off the antenna */}
      <group ref={flagRef} position={[0.08, 0.26, 0.13]}>
        <mesh material={goldAccent} position={[0.04, 0, 0]}>
          <planeGeometry args={[0.08, 0.04]} />
        </mesh>
      </group>
      {/* Headlight cone — points forward (-Z) */}
      <mesh
        ref={headlightRef}
        position={[0, 0.05, -0.19]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[0.05, 0.08, 12]} />
        <meshBasicMaterial color="#fff5d4" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      {/* Headlight pointlight a touch in front of the cone */}
      <pointLight
        ref={headlightLightRef}
        position={[0, 0.06, -0.32]}
        intensity={0.8}
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
          {/* Hubcap accent */}
          <mesh material={cream} rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.022 : -0.022, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.005, 12]} />
          </mesh>
        </group>
      ))}
      {/* Subtle ground tinting from beneath the chassis */}
      <pointLight color="#f3c66b" intensity={0.5} distance={1.0} decay={2} position={[0, 0.05, 0]} />
    </group>
  );
}
