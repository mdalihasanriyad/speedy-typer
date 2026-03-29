import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WpmSnapshot } from "@/hooks/useTypingEngine";

interface WpmChartProps {
  data: WpmSnapshot[];
}

const WpmChart = ({ data }: WpmChartProps) => {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(43, 72%, 49%)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(43, 72%, 49%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rawGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(228, 7%, 56%)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="hsl(228, 7%, 56%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 7%, 22%)" vertical={false} />
        <XAxis
          dataKey="second"
          tick={{ fill: "hsl(228, 7%, 40%)", fontSize: 12 }}
          axisLine={{ stroke: "hsl(228, 7%, 22%)" }}
          tickLine={false}
          unit="s"
        />
        <YAxis
          tick={{ fill: "hsl(228, 7%, 40%)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(228, 7%, 17%)",
            border: "1px solid hsl(228, 7%, 22%)",
            borderRadius: "8px",
            color: "hsl(46, 30%, 80%)",
            fontSize: 13,
          }}
          labelFormatter={(v) => `${v}s`}
          formatter={(value: number, name: string) => [value, name === "wpm" ? "wpm" : "raw"]}
        />
        <Area
          type="monotone"
          dataKey="raw"
          stroke="hsl(228, 7%, 40%)"
          strokeWidth={2}
          fill="url(#rawGradient)"
          dot={false}
          animationDuration={800}
        />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="hsl(43, 72%, 49%)"
          strokeWidth={2.5}
          fill="url(#wpmGradient)"
          dot={false}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WpmChart;
