import { Hash, AtSign } from "lucide-react";
import type { TestMode } from "@/hooks/useTypingEngine";

interface TimerSelectorProps {
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
  values: number[];
  selected: number;
  onSelect: (value: number) => void;
  punctuation?: boolean;
  numbers?: boolean;
  onTogglePunctuation?: () => void;
  onToggleNumbers?: () => void;
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

const TimerSelector = ({
  mode,
  onModeChange,
  values,
  selected,
  onSelect,
  punctuation = false,
  numbers = false,
  onTogglePunctuation,
  onToggleNumbers,
}: TimerSelectorProps) => {
  const showValues = mode === "time" || mode === "words";
  const showToggles = mode === "time" || mode === "words" || mode === "zen";

  return (
    <div className="flex items-center gap-4 text-sub text-sm">
      {/* Punctuation & Numbers toggles */}
      {showToggles && (
        <div className="flex items-center gap-1 mr-2 border-r border-sub/20 pr-4">
          <button
            onClick={onTogglePunctuation}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors hover:text-foreground ${
              punctuation ? "text-primary" : ""
            }`}
            title="Toggle punctuation"
          >
            <AtSign className="w-3.5 h-3.5" />
            <span>punctuation</span>
          </button>
          <button
            onClick={onToggleNumbers}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors hover:text-foreground ${
              numbers ? "text-primary" : ""
            }`}
            title="Toggle numbers"
          >
            <Hash className="w-3.5 h-3.5" />
            <span>numbers</span>
          </button>
        </div>
      )}

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
