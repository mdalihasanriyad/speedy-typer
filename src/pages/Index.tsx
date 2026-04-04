import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import TimerSelector, { TIME_VALUES, WORD_VALUES } from "@/components/TimerSelector";
import TypingArea from "@/components/TypingArea";
import Results from "@/components/Results";
import LiveCpsChart from "@/components/LiveCpsChart";
import Leaderboard from "@/components/Leaderboard";
import CustomTextInput from "@/components/CustomTextInput";
import { useTypingEngine, type TestMode } from "@/hooks/useTypingEngine";
import { RotateCcw } from "lucide-react";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const Index = () => {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [mode, setMode] = useState<TestMode>("time");
  const [timeValue, setTimeValue] = useState(30);
  const [wordValue, setWordValue] = useState(25);
  const [customWords, setCustomWords] = useState<string[] | undefined>();
  const [customReady, setCustomReady] = useState(false);

  const value = mode === "time" ? timeValue : mode === "words" ? wordValue : 0;
  const values = mode === "time" ? TIME_VALUES : WORD_VALUES;

  const { state, handleKeyDown, reset, getStats, getWpmHistory, getCpsHistory } = useTypingEngine(
    mode,
    value,
    customWords
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const tabPressedRef = useRef(false);

  const handleModeChange = (newMode: TestMode) => {
    setMode(newMode);
    if (newMode === "custom") {
      setCustomReady(false);
      setCustomWords(undefined);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        return;
      }
      if (e.key === "Enter" && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        if (mode === "custom") {
          setCustomReady(false);
          setCustomWords(undefined);
        }
        reset();
        return;
      }
      tabPressedRef.current = false;
      handleKeyDown(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyDown, reset, mode]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const stats = getStats();

  const showCustomInput = mode === "custom" && !customReady;

  // Progress display logic
  const getProgressWidth = () => {
    if (mode === "time") return (1 - state.timeLeft / value) * 100;
    if (mode === "words") return (state.currentWordIndex / value) * 100;
    if (mode === "quote" || mode === "custom") return (state.currentWordIndex / state.words.length) * 100;
    return 0; // zen has no progress
  };

  const getCounterDisplay = () => {
    if (mode === "time") return state.timeLeft;
    if (mode === "words") return `${state.currentWordIndex}/${value}`;
    if (mode === "quote" || mode === "custom") return `${state.currentWordIndex}/${state.words.length}`;
    if (mode === "zen") return `${state.elapsed}s`;
    return "";
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="min-h-screen flex flex-col outline-none cursor-default"
    >
      <Header onLeaderboard={() => setLeaderboardOpen(true)} />
      <Leaderboard open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-[900px] w-full mx-auto -mt-16">
        {state.isFinished ? (
          <Results
            wpm={stats.wpm}
            rawWpm={stats.rawWpm}
            accuracy={stats.accuracy}
            duration={state.elapsed}
            totalErrors={stats.totalErrors}
            wpmHistory={getWpmHistory()}
            onRestart={() => {
              if (mode === "custom") {
                setCustomReady(false);
                setCustomWords(undefined);
              }
              reset();
            }}
            mode={mode}
            modeValue={value}
          />
        ) : showCustomInput ? (
          <div className="w-full">
            <div className="w-full flex items-center justify-between mb-8">
              <TimerSelector
                mode={mode}
                onModeChange={handleModeChange}
                values={values}
                selected={value}
                onSelect={(v) => {
                  if (mode === "time") setTimeValue(v);
                  else setWordValue(v);
                }}
              />
            </div>
            <CustomTextInput
              onSubmit={(text) => {
                const words = text.split(/\s+/).filter(Boolean);
                setCustomWords(words);
                setCustomReady(true);
              }}
            />
          </div>
        ) : (
          <>
            <div className="w-full flex items-center justify-between mb-8">
              <TimerSelector
                mode={mode}
                onModeChange={handleModeChange}
                values={values}
                selected={value}
                onSelect={(v) => {
                  if (mode === "time") setTimeValue(v);
                  else setWordValue(v);
                }}
              />
              {state.isRunning && (
                <div className="flex items-center gap-6">
                  <span className="text-lg text-sub tabular-nums">
                    {stats.wpm} <span className="text-xs">wpm</span>
                  </span>
                  <span className="text-3xl font-bold text-primary tabular-nums">
                    {getCounterDisplay()}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full">
              <TypingArea
                words={state.words}
                currentWordIndex={state.currentWordIndex}
                currentInput={state.currentInput}
                typedHistory={state.typedHistory}
                isFinished={state.isFinished}
                isRunning={state.isRunning}
              />
            </div>

            {/* Progress bar (hidden for zen) */}
            {mode !== "zen" && (
              <div className="w-full h-[3px] rounded-full bg-secondary mt-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${getProgressWidth()}%`,
                    transition: "width 300ms ease-out",
                  }}
                />
              </div>
            )}

            {/* Live CPS chart */}
            {state.isRunning && (
              <div className="w-full mt-4">
                <LiveCpsChart data={getCpsHistory()} />
              </div>
            )}

            <button
              onClick={() => {
                if (mode === "custom") {
                  setCustomReady(false);
                  setCustomWords(undefined);
                }
                reset();
              }}
              className="mt-8 text-sub hover:text-foreground transition-colors p-3"
              title="Restart test (Tab)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Zen stop button */}
            {mode === "zen" && state.isRunning && (
              <button
                onClick={() => {
                  // Force finish zen mode
                  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                }}
                className="mt-2 text-xs text-sub hover:text-foreground transition-colors"
              >
                press Esc to finish
              </button>
            )}
          </>
        )}
      </div>

      <footer className="py-4 text-center text-sub text-xs">
        <span>tab + enter — restart test</span>
      </footer>
    </div>
  );
};

export default Index;
