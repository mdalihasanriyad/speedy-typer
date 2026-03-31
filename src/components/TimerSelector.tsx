import type { TestMode } from "@/hooks/useTypingEngine";

interface TimerSelectorProps {
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
  values: number[];
  selected: number;
  onSelect: (value: number) => void;
}

const TIME_VALUES = [15, 30, 60, 120];
const WORD_VALUES = [10, 25, 50, 100];

const TimerSelector = ({ mode, onModeChange, values, selected, onSelect }: TimerSelectorProps) => {
  return (
    <div className="flex items-center gap-4 text-sub text-sm">
      <div className="flex items-center gap-2 mr-2">
        <button
          onClick={() => onModeChange("time")}
          className={`transition-colors hover:text-foreground ${
            mode === "time" ? "text-primary" : ""
          }`}
        >
          time
        </button>
        <span className="text-muted-foreground">|</span>
        <button
          onClick={() => onModeChange("words")}
          className={`transition-colors hover:text-foreground ${
            mode === "words" ? "text-primary" : ""
          }`}
        >
          words
        </button>
      </div>
      {values.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className={`transition-colors hover:text-foreground ${
            selected === d ? "text-primary" : ""
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  );
};

export { TIME_VALUES, WORD_VALUES };
export default TimerSelector;
