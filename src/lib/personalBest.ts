import type { TestMode } from "@/hooks/useTypingEngine";

const STORAGE_KEY = "typingTestPersonalBests";

interface PersonalBests {
  [key: string]: number; // e.g. "time-30": 85, "words-25": 92
}

function getKey(mode: TestMode, value: number): string {
  return `${mode}-${value}`;
}

export function getPersonalBest(mode: TestMode, value: number): number | null {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as PersonalBests;
    return data[getKey(mode, value)] ?? null;
  } catch {
    return null;
  }
}

/** Saves WPM if it's a new personal best. Returns true if it was a new record. */
export function savePersonalBest(mode: TestMode, value: number, wpm: number): boolean {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as PersonalBests;
    const key = getKey(mode, value);
    const prev = data[key] ?? 0;
    if (wpm > prev) {
      data[key] = wpm;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
