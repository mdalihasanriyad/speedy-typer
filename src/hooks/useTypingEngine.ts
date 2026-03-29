import { useCallback, useEffect, useRef, useState } from "react";
import { generateWords } from "@/data/words";

export interface WpmSnapshot {
  second: number;
  wpm: number;
  raw: number;
}

interface TypingEngineState {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedHistory: string[];
  currentInput: string;
  startTime: number | null;
  timeLeft: number;
  isRunning: boolean;
  isFinished: boolean;
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

export function useTypingEngine(duration: number) {
  const [state, setState] = useState<TypingEngineState>(() => ({
    words: generateWords(200),
    currentWordIndex: 0,
    currentCharIndex: 0,
    typedHistory: [],
    currentInput: "",
    startTime: null,
    timeLeft: duration,
    isRunning: false,
    isFinished: false,
  }));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmHistoryRef = useRef<WpmSnapshot[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    wpmHistoryRef.current = [];
    setState({
      words: generateWords(200),
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedHistory: [],
      currentInput: "",
      startTime: null,
      timeLeft: duration,
      isRunning: false,
      isFinished: false,
    });
  }, [duration]);

  useEffect(() => {
    reset();
  }, [duration, reset]);

  useEffect(() => {
    if (state.isRunning && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          const newTimeLeft = prev.timeLeft - 1;
          const elapsed = duration - newTimeLeft;

          // Record WPM snapshot
          const { correct, total } = calcCorrectChars(prev.typedHistory, prev.words);
          const wpm = Math.round((correct / 5) / (elapsed / 60));
          const raw = Math.round((total / 5) / (elapsed / 60));
          wpmHistoryRef.current.push({ second: elapsed, wpm, raw });

          if (newTimeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            return { ...prev, timeLeft: 0, isRunning: false, isFinished: true };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => {
      if (state.isFinished && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isRunning, state.isFinished, duration]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.isFinished) return;

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
          }
        } else if (e.key.length === 1) {
          next.currentInput += e.key;
          next.currentCharIndex = next.currentInput.length;
        }

        return next;
      });
    },
    [state.isFinished]
  );

  const getStats = useCallback(() => {
    const { correct: correctChars, total: totalChars } = calcCorrectChars(state.typedHistory, state.words);

    let correctWords = 0;
    state.typedHistory.forEach((typed, i) => {
      if (typed === state.words[i]) correctWords++;
    });

    const elapsed = duration - state.timeLeft || 1;
    const wpm = Math.round((correctChars / 5) / (elapsed / 60));
    const rawWpm = Math.round((totalChars / 5) / (elapsed / 60));
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    return { wpm, rawWpm, accuracy, correctWords, totalWords: state.typedHistory.length };
  }, [state, duration]);

  const getWpmHistory = useCallback(() => wpmHistoryRef.current, []);

  return { state, handleKeyDown, reset, getStats, getWpmHistory };
}
