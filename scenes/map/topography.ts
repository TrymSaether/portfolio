import * as THREE from "three";
import { stations } from "@/content/stations";

export const TERRAIN_SIZE = 22;
export const TERRAIN_SEGMENTS = 256;
export const TERRAIN_HEIGHT = 2.4;

/**
 * Procedural elevation evaluated on the CPU so the rover and station markers
 * can sit on the same surface drawn by the vertex shader.
 *
 * Mirror of the GLSL `elevation()` in shaders/terrain.frag.glsl — keep in sync.
 */
export function elevation(x: number, z: number): number {
  const fbm = (px: number, pz: number) => {
    let v = 0;
    let a = 1;
    let f = 1;
    let norm = 0;
    for (let i = 0; i < 5; i++) {
      v += a * smoothNoise(px * f, pz * f);
      norm += a;
      a *= 0.5;
      f *= 2.05;
    }
    return v / norm;
  };

  const base = fbm(x * 0.18, z * 0.18);
  // Carve a gentle gaussian valley near origin (math motif: a Gaussian)
  const r2 = x * x + z * z;
  const valley = Math.exp(-r2 * 0.04) * 0.35;
  // Long ridge along a sine front
  const ridge = Math.sin(x * 0.35 + Math.cos(z * 0.2) * 1.4) * 0.18;
  return (base * 1.1 - valley + ridge) * TERRAIN_HEIGHT * 0.5;
}

function smoothNoise(x: number, z: number): number {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  const n00 = hash2(xi, zi);
  const n10 = hash2(xi + 1, zi);
  const n01 = hash2(xi, zi + 1);
  const n11 = hash2(xi + 1, zi + 1);
  return (
    n00 * (1 - u) * (1 - v) +
    n10 * u * (1 - v) +
    n01 * (1 - u) * v +
    n11 * u * v
  ) * 2 - 1;
}

function hash2(x: number, z: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Map a normalized station position (-1..1) to world coordinates with elevation. */
export function stationWorldPos(p: [number, number]): THREE.Vector3 {
  const x = p[0] * (TERRAIN_SIZE / 2) * 0.85;
  const z = p[1] * (TERRAIN_SIZE / 2) * 0.85;
  const y = elevation(x, z);
  return new THREE.Vector3(x, y, z);
}

/** Generate a smooth tour curve through all stations + back to start. */
export function buildRoverCurve(): THREE.CatmullRomCurve3 {
  const points = stations.map((s) => stationWorldPos(s.position));
  // close the loop
  points.push(points[0].clone());
  const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5);
  return curve;
}
