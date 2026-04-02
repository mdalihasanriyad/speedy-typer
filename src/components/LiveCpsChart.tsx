import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import type { CpsSnapshot } from "@/hooks/useTypingEngine";

interface LiveCpsChartProps {
  data: CpsSnapshot[];
}

const LiveCpsChart = ({ data }: LiveCpsChartProps) => {
  if (data.length < 2) return null;

  // Show last 20 seconds for a rolling window feel
  const visible = data.slice(-20);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-sub uppercase tracking-widest">chars/sec</span>
        <span className="text-xs text-primary font-bold tabular-nums">
          {visible[visible.length - 1]?.cps ?? 0}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={48}>
        <AreaChart data={visible} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cpsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(43, 72%, 49%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(43, 72%, 49%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, "auto"]} />
          <Area
            type="monotone"
            dataKey="cps"
            stroke="hsl(43, 72%, 49%)"
            strokeWidth={2}
            fill="url(#cpsGradient)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveCpsChart;
