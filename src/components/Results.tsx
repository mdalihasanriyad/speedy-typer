import { RotateCcw, Crown } from "lucide-react";
import WpmChart from "./WpmChart";
import type { WpmSnapshot, TestMode } from "@/hooks/useTypingEngine";
import { useEffect, useState } from "react";
import { getPersonalBest, savePersonalBest } from "@/lib/personalBest";

interface ResultsProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  totalErrors: number;
  wpmHistory: WpmSnapshot[];
  onRestart: () => void;
  mode: TestMode;
  modeValue: number;
}

const Results = ({ wpm, rawWpm, accuracy, duration, totalErrors, wpmHistory, onRestart, mode, modeValue }: ResultsProps) => {
  const [isNewBest, setIsNewBest] = useState(false);
  const [personalBest, setPersonalBest] = useState<number | null>(null);

  useEffect(() => {
    const newRecord = savePersonalBest(mode, modeValue, wpm);
    setIsNewBest(newRecord);
    setPersonalBest(getPersonalBest(mode, modeValue));
  }, [mode, modeValue, wpm]);

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-in fade-in duration-500">
      <div className="w-full flex gap-8 items-start">
        {/* Left stats */}
        <div className="flex flex-col gap-4 shrink-0">
          <div>
            <span className="text-sub text-sm block">wpm</span>
            <span className="text-5xl font-bold text-primary">{wpm}</span>
            {isNewBest && (
              <span className="flex items-center gap-1 text-xs text-caret mt-1">
                <Crown className="w-3 h-3" /> new best!
              </span>
            )}
          </div>
          <div>
            <span className="text-sub text-sm block">acc</span>
            <span className="text-5xl font-bold text-primary">{accuracy}%</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0">
          <WpmChart data={wpmHistory} />
        </div>
      </div>

      <div className="flex gap-12 text-sub">
        <div className="flex flex-col items-center">
          <span className="text-xs">raw</span>
          <span className="text-lg text-foreground">{rawWpm}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs">time</span>
          <span className="text-lg text-foreground">{duration}s</span>
        </div>
        {personalBest !== null && (
          <div className="flex flex-col items-center">
            <span className="text-xs flex items-center gap-1"><Crown className="w-3 h-3" /> pb</span>
            <span className="text-lg text-foreground">{personalBest}</span>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="text-sub hover:text-foreground transition-colors p-3"
        title="Restart test"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Results;
