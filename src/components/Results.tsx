import { RotateCcw } from "lucide-react";

interface ResultsProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  onRestart: () => void;
}

const Results = ({ wpm, rawWpm, accuracy, duration, onRestart }: ResultsProps) => {
  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
      <div className="flex gap-16 items-end">
        <div className="flex flex-col items-center">
          <span className="text-sub text-sm">wpm</span>
          <span className="text-6xl font-bold text-primary">{wpm}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sub text-sm">acc</span>
          <span className="text-6xl font-bold text-primary">{accuracy}%</span>
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
