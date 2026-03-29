import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import TimerSelector from "@/components/TimerSelector";
import TypingArea from "@/components/TypingArea";
import Results from "@/components/Results";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { RotateCcw } from "lucide-react";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const DURATIONS = [15, 30, 60, 120];

const Index = () => {
  const [duration, setDuration] = useState(30);
  const { state, handleKeyDown, reset, getStats, getWpmHistory } = useTypingEngine(duration);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        reset();
        return;
      }
      handleKeyDown(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyDown, reset]);

  // Focus management
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const stats = getStats();

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="min-h-screen flex flex-col outline-none cursor-default"
    >
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-[900px] w-full mx-auto -mt-16">
        {state.isFinished ? (
          <Results
            wpm={stats.wpm}
            rawWpm={stats.rawWpm}
            accuracy={stats.accuracy}
            duration={duration}
            wpmHistory={getWpmHistory()}
            onRestart={reset}
          />
        ) : (
          <>
            <div className="w-full flex items-center justify-between mb-8">
              <TimerSelector
                durations={DURATIONS}
                selected={duration}
                onSelect={(d) => {
                  setDuration(d);
                }}
              />
              {state.isRunning && (
                <span className="text-3xl font-bold text-primary tabular-nums">
                  {state.timeLeft}
                </span>
              )}
            </div>

            <div className="w-full">
              <TypingArea
                words={state.words}
                currentWordIndex={state.currentWordIndex}
                currentInput={state.currentInput}
                typedHistory={state.typedHistory}
                isFinished={state.isFinished}
              />
            </div>

            <button
              onClick={reset}
              className="mt-8 text-sub hover:text-foreground transition-colors p-3"
              title="Restart test (Tab)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
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
