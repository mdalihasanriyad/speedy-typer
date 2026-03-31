import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import TimerSelector, { TIME_VALUES, WORD_VALUES } from "@/components/TimerSelector";
import TypingArea from "@/components/TypingArea";
import Results from "@/components/Results";
import { useTypingEngine, type TestMode } from "@/hooks/useTypingEngine";
import { RotateCcw } from "lucide-react";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const Index = () => {
  const [mode, setMode] = useState<TestMode>("time");
  const [timeValue, setTimeValue] = useState(30);
  const [wordValue, setWordValue] = useState(25);

  const value = mode === "time" ? timeValue : wordValue;
  const values = mode === "time" ? TIME_VALUES : WORD_VALUES;

  const { state, handleKeyDown, reset, getStats, getWpmHistory } = useTypingEngine(mode, value);
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
            duration={state.elapsed}
            wpmHistory={getWpmHistory()}
            onRestart={reset}
            mode={mode}
            modeValue={value}
          />
        ) : (
          <>
            <div className="w-full flex items-center justify-between mb-8">
              <TimerSelector
                mode={mode}
                onModeChange={setMode}
                values={values}
                selected={value}
                onSelect={(v) => {
                  if (mode === "time") setTimeValue(v);
                  else setWordValue(v);
                }}
              />
              {state.isRunning && (
                <span className="text-3xl font-bold text-primary tabular-nums">
                  {mode === "time"
                    ? state.timeLeft
                    : `${state.currentWordIndex}/${value}`}
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
                isRunning={state.isRunning}
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
