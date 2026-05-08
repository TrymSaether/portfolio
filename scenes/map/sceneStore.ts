"use client";

import { create } from "zustand";
import { stations } from "@/content/stations";

export type SceneMode = "parked" | "driving" | "arriving";

const STORAGE_KEY = "trym.parkedStationIndex";

function readParked(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 && n < stations.length ? n : 0;
  } catch {
    return 0;
  }
}

function writeParked(index: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    /* noop */
  }
}

interface SceneState {
  mode: SceneMode;
  /** Where the rover is currently parked (or last parked before driving). */
  parkedStationIndex: number;
  /** Station the rover is heading toward (during driving / arriving). */
  toStationIndex: number | null;
  /** Drive duration in seconds. */
  driveDuration: number;
  /** Arrive duration in seconds (camera arc). */
  arriveDuration: number;
  /** performance.now()/1000 at the start of the current phase. */
  phaseStart: number;

  beginDrive: (toStationIndex: number, now: number) => void;
  beginArrive: (now: number) => void;
  /** Park the rover at a station — updates store and persists. */
  parkAt: (stationIndex: number) => void;
  /** Reset to parked mode at the current parked station. */
  reset: () => void;
}

const baseState = {
  mode: "parked" as const,
  toStationIndex: null,
  driveDuration: 1.8,
  arriveDuration: 0.7,
  phaseStart: 0,
};

export const useSceneStore = create<SceneState>((set, get) => ({
  ...baseState,
  parkedStationIndex: readParked(),

  beginDrive: (toStationIndex, now) =>
    set({ mode: "driving", toStationIndex, phaseStart: now }),

  beginArrive: (now) => set({ mode: "arriving", phaseStart: now }),

  parkAt: (stationIndex) => {
    writeParked(stationIndex);
    set({
      mode: "parked",
      parkedStationIndex: stationIndex,
      toStationIndex: null,
      phaseStart: 0,
    });
  },

  reset: () =>
    set({
      ...baseState,
      parkedStationIndex: get().parkedStationIndex,
    }),
}));

/** Eased interpolation curve used by both rover trip and camera arc. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
