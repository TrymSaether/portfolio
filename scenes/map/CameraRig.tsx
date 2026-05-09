"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { stations } from "@/content/stations";
import { stationWorldPos } from "./topography";
import { easeInOutCubic, useSceneStore } from "./sceneStore";

/**
 * Camera behavior:
 *  – parked: gentle ambient orbit + mouse parallax
 *  – flying: smooth arc from current pose toward an over-the-shoulder shot of
 *            the destination station; navigation handoff is triggered by
 *            MapScene at the peak of this arc.
 */
export function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0.7, 1.4));
  const desired = useRef(new THREE.Vector3(9, 7.5, 9));
  const mouse = useRef({ x: 0, y: 0 });
  const arcStart = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);
  const { camera } = useThree();

  const stationPositions = useMemo(
    () => stations.map((s) => stationWorldPos(s.position, s.elevationOffset)),
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

    if (store.mode === "flying" && store.toStationIndex !== null) {
      // Capture the entry pose once per flight
      if (!arcStart.current) {
        arcStart.current = {
          pos: camera.position.clone(),
          target: target.current.clone(),
        };
      }

      const stationPos = stationPositions[store.toStationIndex];
      // Camera lands offset above-and-out from the station so the motif fills frame
      const offset = new THREE.Vector3(2.0, 1.4, 2.0).normalize().multiplyScalar(2.6);
      const targetCamPos = stationPos.clone().add(offset);
      const targetLookAt = stationPos.clone().add(new THREE.Vector3(0, 0.5, 0));

      const elapsed = performance.now() / 1000 - store.phaseStart;
      const u = Math.min(1, elapsed / store.flightDuration);
      // Let the rover visibly dispatch first, then have the camera catch up
      // on the same arc for a more intentional station handoff.
      const cameraU = THREE.MathUtils.clamp((u - 0.16) / 0.84, 0, 1);
      const eased = easeInOutCubic(cameraU);

      camera.position.lerpVectors(arcStart.current.pos, targetCamPos, eased);
      const lookAt = arcStart.current.target.clone().lerp(targetLookAt, eased);
      camera.lookAt(lookAt);
      target.current.copy(lookAt);
      return;
    }

    // Reset arc-entry pose when no longer flying
    if (arcStart.current && store.mode !== "flying") {
      arcStart.current = null;
    }

    // Ambient orbit + mouse parallax
    const baseR = 14.0;
    const baseAngle = Math.PI * 0.25 + Math.sin(t * 0.05) * 0.06;
    const orbitX = Math.cos(baseAngle) * baseR;
    const orbitZ = Math.sin(baseAngle) * baseR;
    const altitude = 8.0 + Math.sin(t * 0.07) * 0.25;

    const mx = mouse.current.x;
    const my = mouse.current.y;

    desired.current.set(
      orbitX + mx * 0.6,
      altitude - my * 0.35,
      orbitZ + mx * 0.4,
    );

    camera.position.lerp(desired.current, 1 - Math.exp(-3 * dt));
    target.current.set(0, 0.7 + my * 0.12, 1.4);
    camera.lookAt(target.current);
  });

  return null;
}
