"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Tracks whether the brand intro has already played this session, so it shows
 * once per session (a refresh mid-session won't replay it). Persisted to
 * sessionStorage — a brand-new session sees the intro again.
 */
interface IntroState {
  hasPlayed: boolean;
  markPlayed: () => void;
  reset: () => void;
}

export const useIntroStore = create<IntroState>()(
  persist(
    (set) => ({
      hasPlayed: false,
      markPlayed: () => set({ hasPlayed: true }),
      reset: () => set({ hasPlayed: false }),
    }),
    {
      name: "luvora-intro",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : (undefined as unknown as Storage),
      ),
    },
  ),
);
