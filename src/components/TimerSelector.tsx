interface TimerSelectorProps {
  durations: number[];
  selected: number;
  onSelect: (duration: number) => void;
}

const TimerSelector = ({ durations, selected, onSelect }: TimerSelectorProps) => {
  return (
    <div className="flex items-center gap-4 text-sub text-sm">
      <span className="text-muted-foreground">time</span>
      {durations.map((d) => (
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

export default TimerSelector;
