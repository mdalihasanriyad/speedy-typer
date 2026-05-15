interface DebugPanelProps {
  correctChars: number;
  totalChars: number;
  elapsed: number;
  errors: number;
  accuracy: number;
}

const DebugPanel = ({ correctChars, totalChars, elapsed, errors, accuracy }: DebugPanelProps) => {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-sub/70">
      <div className="flex items-center gap-1.5">
        <span className="text-sub/50">correctChars</span>
        <span className="text-foreground">{correctChars}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sub/50">totalChars</span>
        <span className="text-foreground">{totalChars}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sub/50">elapsed</span>
        <span className="text-foreground">{elapsed}s</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sub/50">errors</span>
        <span className="text-foreground">{errors}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sub/50">accuracy</span>
        <span className="text-foreground">{accuracy}%</span>
      </div>
    </div>
  );
};

export default DebugPanel;
