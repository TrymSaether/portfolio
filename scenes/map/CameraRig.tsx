"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { stations } from "@/content/stations";
import { stationWorldPos } from "./topography";
import { easeInOutCubic, useSceneStore } from "./sceneStore";

/**
 * Camera behavior:
 *  – idle: gentle ambient orbit + mouse parallax
 *  – arriving: smooth arc from current pose toward an over-the-shoulder shot
 *               of the destination station
 */
export function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0.6, 0));
  const desired = useRef(new THREE.Vector3(9, 7.5, 9));
  const mouse = useRef({ x: 0, y: 0 });
  const arriveStart = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);
  const { camera } = useThree();

  // Pre-compute station world positions once
  const stationPositions = useMemo(
    () => stations.map((s) => stationWorldPos(s.position)),
    [],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const store = useSceneStore.getState();

    if (store.mode === "arriving" && store.toStationIndex !== null) {
      // Capture the entry pose once
      if (!arriveStart.current) {
        arriveStart.current = {
          pos: camera.position.clone(),
          target: target.current.clone(),
        };
      }

      const stationPos = stationPositions[store.toStationIndex];
      // Camera lands offset above-and-behind the station so the motif fills frame
      const offset = new THREE.Vector3(2.0, 1.3, 2.0).normalize().multiplyScalar(2.4);
      const targetCamPos = stationPos.clone().add(offset);
      const targetLookAt = stationPos.clone().add(new THREE.Vector3(0, 0.4, 0));

      const elapsed = performance.now() / 1000 - store.phaseStart;
      const u = Math.min(1, elapsed / store.arriveDuration);
      const eased = easeInOutCubic(u);

      camera.position.lerpVectors(arriveStart.current.pos, targetCamPos, eased);
      const lookAt = arriveStart.current.target
        .clone()
        .lerp(targetLookAt, eased);
      camera.lookAt(lookAt);
      target.current.copy(lookAt);
      return;
    }

    // Reset arrival entry pose when we're not arriving
    if (arriveStart.current && store.mode !== "arriving") {
      arriveStart.current = null;
    }

    // Idle / driving: ambient orbit, with a slow zoom-in nudge while driving
    const driving = store.mode === "driving";
    const baseR = driving ? 11.5 : 13.0;
    const baseAngle = Math.PI * 0.25 + Math.sin(t * 0.05) * 0.06;
    const orbitX = Math.cos(baseAngle) * baseR;
    const orbitZ = Math.sin(baseAngle) * baseR;
    const altitude = (driving ? 6.6 : 7.4) + Math.sin(t * 0.07) * 0.25;

    const mx = mouse.current.x;
    const my = mouse.current.y;

    desired.current.set(
      orbitX + mx * 0.6,
      altitude - my * 0.35,
      orbitZ + mx * 0.4,
    );

    camera.position.lerp(desired.current, 1 - Math.exp(-3 * dt));
    target.current.set(0, 0.6 + my * 0.12, 0);
    camera.lookAt(target.current);
  });

  return null;
}
