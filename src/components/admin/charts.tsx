"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const COLORS = ["var(--amber)", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];

export function LeadSourceChart({
  data,
}: {
  data: { source: string; count: number }[];
}) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={256}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="source"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ source, count }) => `${source}: ${count}`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function LeadTrendChart({
  recentCount,
  total,
}: {
  recentCount: number;
  total: number;
}) {
  const older = Math.max(0, total - recentCount);
  const data = [
    { period: "Last 7 days", count: recentCount },
    { period: "Older", count: older },
  ];
  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="period" type="category" width={100} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="var(--amber)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
