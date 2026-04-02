import type { TestMode } from "@/hooks/useTypingEngine";

const STORAGE_KEY = "typingTestPersonalBests";

export interface PersonalBestEntry {
  mode: TestMode;
  value: number;
  wpm: number;
  accuracy?: number;
  date: string;
}

interface PersonalBests {
  [key: string]: PersonalBestEntry;
}

function getKey(mode: TestMode, value: number): string {
  return `${mode}-${value}`;
}

export function getPersonalBest(mode: TestMode, value: number): number | null {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as PersonalBests;
    return data[getKey(mode, value)]?.wpm ?? null;
  } catch {
    return null;
  }
}

export function getAllPersonalBests(): PersonalBestEntry[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as PersonalBests;
    return Object.values(data).sort((a, b) => b.wpm - a.wpm);
  } catch {
    return [];
  }
}

export function clearAllPersonalBests(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Saves WPM if it's a new personal best. Returns true if it was a new record. */
export function savePersonalBest(mode: TestMode, value: number, wpm: number, accuracy?: number): boolean {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as PersonalBests;
    const key = getKey(mode, value);
    const prev = data[key]?.wpm ?? 0;
    if (wpm > prev) {
      data[key] = { mode, value, wpm, accuracy, date: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
