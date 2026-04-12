import { useCallback, useEffect, useRef, useState } from "react";
import { generateWords, type GenerateOptions } from "@/data/words";
import { getRandomQuote } from "@/data/quotes";

export type TestMode = "time" | "words" | "quote" | "zen" | "custom";

export interface WpmSnapshot {
  second: number;
  wpm: number;
  raw: number;
}

export interface CpsSnapshot {
  second: number;
  cps: number;
}

interface TypingEngineState {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedHistory: string[];
  currentInput: string;
  startTime: number | null;
  timeLeft: number;
  elapsed: number;
  isRunning: boolean;
  isFinished: boolean;
  totalCharsTyped: number;
}

function calcCorrectChars(typedHistory: string[], words: string[]) {
  let correct = 0;
  let total = 0;
  typedHistory.forEach((typed, i) => {
    const target = words[i];
    if (typed === target) {
      correct += typed.length;
    } else {
      for (let c = 0; c < typed.length; c++) {
        if (c < target.length && typed[c] === target[c]) correct++;
      }
    }
    total += typed.length;
  });
  return { correct, total };
}

export function useTypingEngine(mode: TestMode, value: number, customWords?: string[], genOptions?: GenerateOptions) {
  const isTimeMode = mode === "time";

  function generateInitialWords(): string[] {
    if (mode === "custom" && customWords && customWords.length > 0) return customWords;
    if (mode === "quote") return getRandomQuote().text.split(/\s+/);
    if (mode === "zen") return generateWords(200, genOptions);
    return generateWords(isTimeMode ? 200 : value, genOptions);
  }

  const [state, setState] = useState<TypingEngineState>(() => ({
    words: generateInitialWords(),
    currentWordIndex: 0,
    currentCharIndex: 0,
    typedHistory: [],
    currentInput: "",
    startTime: null,
    timeLeft: isTimeMode ? value : 0,
    elapsed: 0,
    isRunning: false,
    isFinished: false,
    totalCharsTyped: 0,
  }));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmHistoryRef = useRef<WpmSnapshot[]>([]);
  const cpsHistoryRef = useRef<CpsSnapshot[]>([]);
  const prevCharsRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    wpmHistoryRef.current = [];
    cpsHistoryRef.current = [];
    prevCharsRef.current = 0;
    setState({
      words: generateInitialWords(),
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedHistory: [],
      currentInput: "",
      startTime: null,
      timeLeft: isTimeMode ? value : 0,
      elapsed: 0,
      isRunning: false,
      isFinished: false,
      totalCharsTyped: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isTimeMode, mode, customWords, genOptions]);

  useEffect(() => {
    reset();
  }, [value, mode, reset]);

  useEffect(() => {
    if (state.isRunning && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.isFinished) return prev;

          const newElapsed = prev.elapsed + 1;
          const { correct, total } = calcCorrectChars(prev.typedHistory, prev.words);
          const wpm = Math.round((correct / 5) / (newElapsed / 60));
          const raw = Math.round((total / 5) / (newElapsed / 60));
          wpmHistoryRef.current.push({ second: newElapsed, wpm, raw });

          // CPS: chars typed since last second
          const cps = prev.totalCharsTyped - prevCharsRef.current;
          prevCharsRef.current = prev.totalCharsTyped;
          cpsHistoryRef.current.push({ second: newElapsed, cps: Math.max(0, cps) });

          if (isTimeMode) {
            const newTimeLeft = prev.timeLeft - 1;
            if (newTimeLeft <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = null;
              return { ...prev, timeLeft: 0, elapsed: newElapsed, isRunning: false, isFinished: true };
            }
            return { ...prev, timeLeft: newTimeLeft, elapsed: newElapsed };
          }

          return { ...prev, elapsed: newElapsed };
        });
      }, 1000);
    }
    return () => {
      if (state.isFinished && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isRunning, state.isFinished, isTimeMode]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (stateRef.current.isFinished) return;

      // Zen mode: Escape to finish
      if (e.key === "Escape" && mode === "zen" && stateRef.current.isRunning) {
        e.preventDefault();
        setState((prev) => {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          const finalElapsed = prev.startTime ? (Date.now() - prev.startTime) / 1000 : prev.elapsed;
          return { ...prev, elapsed: Math.round(finalElapsed), isRunning: false, isFinished: true };
        });
        return;
      }

      if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
        e.preventDefault();
      } else {
        return;
      }

      setState((prev) => {
        if (prev.isFinished) return prev;

        let next = { ...prev };

        if (!prev.isRunning && e.key.length === 1) {
          next.isRunning = true;
          next.startTime = Date.now();
        }

        if (!next.isRunning && e.key === "Backspace") return prev;

        if (e.key === "Backspace") {
          if (next.currentInput.length > 0) {
            next.currentInput = next.currentInput.slice(0, -1);
            next.currentCharIndex = next.currentInput.length;
          } else if (next.currentWordIndex > 0) {
            const prevWord = next.typedHistory[next.typedHistory.length - 1];
            next.currentWordIndex -= 1;
            next.typedHistory = next.typedHistory.slice(0, -1);
            next.currentInput = prevWord;
            next.currentCharIndex = prevWord.length;
          }
        } else if (e.key === " ") {
          if (next.currentInput.length > 0) {
            next.typedHistory = [...next.typedHistory, next.currentInput];
            next.currentWordIndex += 1;
            next.currentInput = "";
            next.currentCharIndex = 0;
            next.totalCharsTyped += 1; // count space as a char

            const shouldFinish = (mode === "words" || mode === "quote" || mode === "custom") && next.currentWordIndex >= next.words.length;
            if (shouldFinish) {
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = null;
              const finalElapsed = next.startTime ? (Date.now() - next.startTime) / 1000 : next.elapsed;
              next.elapsed = Math.round(finalElapsed);
              next.isRunning = false;
              next.isFinished = true;
            }
            // Zen mode: generate more words when running low
            if (mode === "zen" && next.currentWordIndex >= next.words.length - 10) {
              const moreWords = generateWords(100, genOptions);
              next.words = [...next.words, ...moreWords];
            }
          }
        } else if (e.key.length === 1) {
          next.currentInput += e.key;
          next.currentCharIndex = next.currentInput.length;
          next.totalCharsTyped += 1;
        }

        return next;
      });
    },
    [isTimeMode]
  );

  const getStats = useCallback(() => {
    const { correct: correctChars, total: totalChars } = calcCorrectChars(state.typedHistory, state.words);

    let correctWords = 0;
    state.typedHistory.forEach((typed, i) => {
      if (typed === state.words[i]) correctWords++;
    });

    const elapsed = state.elapsed || 1;
    const wpm = Math.round((correctChars / 5) / (elapsed / 60));
    const rawWpm = Math.round((totalChars / 5) / (elapsed / 60));
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    const totalErrors = totalChars - correctChars;
    return { wpm, rawWpm, accuracy, correctWords, totalWords: state.typedHistory.length, totalErrors };
  }, [state]);

  const getWpmHistory = useCallback(() => wpmHistoryRef.current, []);
  const getCpsHistory = useCallback(() => [...cpsHistoryRef.current], []);

  return { state, handleKeyDown, reset, getStats, getWpmHistory, getCpsHistory };
}
