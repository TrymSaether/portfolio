"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Subtle ambient camera drift + parallax to mouse, with a soft entry move.
 * Centerpiece is anchored at the origin and the camera orbits gently.
 */
export function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0.6, 0));
  const desired = useRef(new THREE.Vector3(9, 7.5, 9));
  const mouse = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

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
    // Slow orbit: a few degrees, breathing in altitude
    const baseR = 13.0;
    const baseAngle = Math.PI * 0.25 + Math.sin(t * 0.05) * 0.06;
    const orbitX = Math.cos(baseAngle) * baseR;
    const orbitZ = Math.sin(baseAngle) * baseR;
    const altitude = 7.4 + Math.sin(t * 0.07) * 0.25;

    // Add mouse parallax
    const mx = mouse.current.x;
    const my = mouse.current.y;

    desired.current.set(
      orbitX + mx * 0.6,
      altitude - my * 0.35,
      orbitZ + mx * 0.4,
    );

    // Smooth camera follow
    camera.position.lerp(desired.current, 1 - Math.exp(-3 * dt));
    target.current.set(0, 0.6 + my * 0.12, 0);
    camera.lookAt(target.current);
  });

  return null;
}
