import * as THREE from "three";
import { stations } from "@/content/stations";

export const TERRAIN_SIZE = 22;
export const TERRAIN_SEGMENTS = 256;
export const TERRAIN_HEIGHT = 2.4;
export const DEFAULT_STATION_ELEVATION_OFFSET = 0.04;
/** Y at which the ocean surface sits — keep in sync with Ocean.tsx. */
export const OCEAN_LEVEL = -0.55;
/** Minimum height above sea that path knots must clear to count as "on land". */
const LAND_MARGIN = 0.08;

/**
 * Designated bridge edge — the rover crosses water here instead of detouring.
 * All other edges have their underwater knots pushed onto land.
 */
export const BRIDGE_EDGE: [number, number] = [2, 4]; // Notes (idx 2) ↔ Personal (idx 4)
export function isBridgeEdge(a: number, b: number): boolean {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return lo === BRIDGE_EDGE[0] && hi === BRIDGE_EDGE[1];
}

/**
 * Procedural elevation evaluated on the CPU so rover/stations/paths can sit on
 * the same surface drawn by the vertex shader.
 *
 * Mirror of the GLSL `elevation()` in Terrain.tsx — keep in sync.
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
  const r2 = x * x + z * z;
  const valley = Math.exp(-r2 * 0.04) * 0.35;
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
    (n00 * (1 - u) * (1 - v) +
      n10 * u * (1 - v) +
      n01 * (1 - u) * v +
      n11 * u * v) *
      2 -
    1
  );
}

function hash2(x: number, z: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Returns the maximum elevation in a small disc around (x, z). Used to keep
 * station markers and parked rovers visibly above any nearby terrain peak —
 * spot-sampling at the centerpoint misses bumps that the noise field can throw
 * within the marker's footprint.
 */
export function maxElevationLocal(
  x: number,
  z: number,
  radius = 0.6,
  rings = 2,
  spokes = 8,
): number {
  let m = elevation(x, z);
  for (let r = 1; r <= rings; r++) {
    const rad = (radius * r) / rings;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2 + r * 0.31;
      const e = elevation(x + Math.cos(a) * rad, z + Math.sin(a) * rad);
      if (e > m) m = e;
    }
  }
  return m;
}

/** Map a normalized station position (-1..1) to world coordinates with elevation. */
export function stationWorldPos(
  p: [number, number],
  elevationOffset = DEFAULT_STATION_ELEVATION_OFFSET,
): THREE.Vector3 {
  const x = p[0] * (TERRAIN_SIZE / 2) * 0.85;
  const z = p[1] * (TERRAIN_SIZE / 2) * 0.85;
  // Use local-max so the station sits above any peak inside its ring footprint
  const y = maxElevationLocal(x, z, 0.55) + elevationOffset;
  return new THREE.Vector3(x, y, z);
}

/** World position of the rover's parking spot beside a station. */
export function parkedWorldPos(stationIndex: number): THREE.Vector3 {
  const s = stations[stationIndex];
  const px = s.position[0] * (TERRAIN_SIZE / 2) * 0.85 + s.parkOffset[0];
  const pz = s.position[1] * (TERRAIN_SIZE / 2) * 0.85 + s.parkOffset[1];
  // Smaller radius — the rover's footprint is much smaller than a station marker
  const py =
    maxElevationLocal(px, pz, 0.18, 1, 6) + (s.elevationOffset ?? 0.02);
  return new THREE.Vector3(px, py, pz);
}

/**
 * Outward-facing world-space "look at" target for a parked rover —
 * the rover should face away from the station center along its parkOffset.
 */
export function parkedFacingPoint(stationIndex: number): THREE.Vector3 {
  const s = stations[stationIndex];
  const parked = parkedWorldPos(stationIndex);
  const len = Math.hypot(s.parkOffset[0], s.parkOffset[1]) || 1;
  const dx = (s.parkOffset[0] / len) * 1.0;
  const dz = (s.parkOffset[1] / len) * 1.0;
  return new THREE.Vector3(
    parked.x + dx,
    elevation(parked.x + dx, parked.z + dz),
    parked.z + dz,
  );
}

/**
 * Surface normal of the procedural terrain at (x, z) using a finite-difference
 * gradient of `elevation`. Returns a unit vector with Y > 0.
 */
export function terrainNormal(x: number, z: number): THREE.Vector3 {
  const eps = 0.08;
  const dyDx = (elevation(x + eps, z) - elevation(x - eps, z)) / (2 * eps);
  const dyDz = (elevation(x, z + eps) - elevation(x, z - eps)) / (2 * eps);
  return new THREE.Vector3(-dyDx, 1, -dyDz).normalize();
}

/**
 * Push a point radially outward from the island center until it sits on land
 * (terrain elevation above OCEAN_LEVEL + LAND_MARGIN). Returns the original
 * point if it's already above water. Caps the search at 2.5× original radius.
 */
function pushToLand(x: number, z: number): { x: number; z: number } {
  if (elevation(x, z) > OCEAN_LEVEL + LAND_MARGIN) return { x, z };
  const r = Math.hypot(x, z);
  if (r < 1e-4) return { x, z };
  let scale = 1;
  for (let i = 0; i < 18; i++) {
    scale *= 1.07;
    const nx = x * scale;
    const nz = z * scale;
    if (elevation(nx, nz) > OCEAN_LEVEL + LAND_MARGIN) return { x: nx, z: nz };
    if (scale > 2.5) break;
  }
  return { x: x * scale, z: z * scale };
}

/**
 * Build a terrain-hugging Catmull-Rom path from one station's parking spot
 * to another's. Samples elevation along the (x,z) line and adds a small
 * perpendicular bow so the path doesn't read as a straight line on the map.
 *
 * Knots that fall over water are pushed radially outward toward land so the
 * rover can drive around the central valley — except on the designated
 * BRIDGE_EDGE, where the straight crossing is preserved.
 */
export function buildPath(
  fromIndex: number,
  toIndex: number,
): THREE.CatmullRomCurve3 {
  const a = parkedWorldPos(fromIndex);
  const b = parkedWorldPos(toIndex);
  // Denser sampling so the smooth curve cannot interpolate below a sharp bump
  const N = 124;

  // Perpendicular in xz plane
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  const px = -dz / len;
  const pz = dx / len;

  // Hash the edge to a stable bow magnitude so each path looks distinct
  const edgeHash =
    Math.sin(fromIndex * 12.9898 + toIndex * 78.233) * 43758.5453;
  const bow = ((edgeHash - Math.floor(edgeHash)) * 2 - 1) * 1.4; // -1.4..1.4

  // Endpoint lifts — some stations (e.g. Notes & Book) sit on a tall peak and
  // need the path to descend gradually rather than diving toward the default
  // mid-path clearance, which would slice through the surrounding terrain.
  const fromLift =
    stations[fromIndex].elevationOffset ?? DEFAULT_STATION_ELEVATION_OFFSET;
  const toLift =
    stations[toIndex].elevationOffset ?? DEFAULT_STATION_ELEVATION_OFFSET;
  const MIN_CLEARANCE = 0.22;

  const bridge = isBridgeEdge(fromIndex, toIndex);

  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    // Smooth s-curve weight: 0 at endpoints, 1 in the middle
    const w = Math.sin(u * Math.PI);
    let x = a.x + dx * u + px * bow * w;
    let z = a.z + dz * u + pz * bow * w;

    // On non-bridge edges, route around water: push underwater knots radially
    // outward until they sit on land. Keep endpoints anchored at their
    // parking spots so the path actually reaches the stations.
    const isEndpoint = i === 0 || i === N;
    if (!bridge && !isEndpoint) {
      const projected = pushToLand(x, z);
      x = projected.x;
      z = projected.z;
    }

    // Decay each endpoint's extra lift over the first/last 30% of the path so
    // the descent from elevated stations clears nearby terrain.
    const decay = (t: number) => {
      const s = Math.max(0, Math.min(1, t / 0.3));
      // smoothstep
      return 1 - s * s * (3 - 2 * s);
    };
    const endpointLift = Math.max(
      fromLift * decay(u),
      toLift * decay(1 - u),
    );
    const clearance = Math.max(MIN_CLEARANCE, endpointLift);

    let y: number;
    if (bridge && !isEndpoint) {
      // Bridge knots sit at a fixed deck height above the water surface.
      y = OCEAN_LEVEL + 0.32;
    } else {
      y = maxElevationLocal(x, z, 0.32, 2, 8) + clearance;
    }
    pts.push(new THREE.Vector3(x, y, z));
  }
  // Centripetal Catmull-Rom (alpha = 0.5) prevents overshoot between samples,
  // which was letting the smoothed curve dip below ridges between peaks.
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
}

export interface PathEdge {
  fromIndex: number;
  toIndex: number;
  curve: THREE.CatmullRomCurve3;
  /** Cached length so consumers don't recompute. */
  length: number;
}

/** Build the full all-pairs network — one curve per unordered pair. */
export function buildAllPaths(): PathEdge[] {
  const edges: PathEdge[] = [];
  for (let i = 0; i < stations.length; i++) {
    for (let j = i + 1; j < stations.length; j++) {
      const curve = buildPath(i, j);
      edges.push({
        fromIndex: i,
        toIndex: j,
        curve,
        length: curve.getLength(),
      });
    }
  }
  return edges;
}

/** Find an edge in the network for an unordered pair. */
export function findEdge(
  edges: PathEdge[],
  a: number,
  b: number,
): PathEdge | null {
  if (a === b) return null;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return edges.find((e) => e.fromIndex === lo && e.toIndex === hi) ?? null;
}

/**
 * Build a directional curve walking from station `fromIndex` toward `toIndex`,
 * reusing the cached undirected edge but reversing if necessary.
 */
export function directionalCurve(
  edges: PathEdge[],
  fromIndex: number,
  toIndex: number,
): THREE.CatmullRomCurve3 | null {
  const edge = findEdge(edges, fromIndex, toIndex);
  if (!edge) return null;
  if (edge.fromIndex === fromIndex) return edge.curve;
  // Reverse: build a fresh curve walking the points in reverse
  const reversed = [...edge.curve.points].reverse();
  return new THREE.CatmullRomCurve3(reversed, false, "catmullrom", 0.5);
}
