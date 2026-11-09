"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Shown in the pre-rendered HTML; the browser swaps in the real year
const FALLBACK_YEAR = 2026;

export default function CurrentYear() {
  return useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => FALLBACK_YEAR,
  );
}