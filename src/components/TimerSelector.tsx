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

const ALL_MODES: { key: TestMode; label: string }[] = [
  { key: "time", label: "time" },
  { key: "words", label: "words" },
  { key: "quote", label: "quote" },
  { key: "zen", label: "zen" },
  { key: "custom", label: "custom" },
];

const TimerSelector = ({ mode, onModeChange, values, selected, onSelect }: TimerSelectorProps) => {
  const showValues = mode === "time" || mode === "words";

  return (
    <div className="flex items-center gap-4 text-sub text-sm">
      <div className="flex items-center gap-2 mr-2">
        {ALL_MODES.map((m, i) => (
          <span key={m.key} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted-foreground">|</span>}
            <button
              onClick={() => onModeChange(m.key)}
              className={`transition-colors hover:text-foreground ${
                mode === m.key ? "text-primary" : ""
              }`}
            >
              {m.label}
            </button>
          </span>
        ))}
      </div>
      {showValues &&
        values.map((d) => (
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
