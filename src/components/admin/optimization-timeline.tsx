"use client";

import { useState, useEffect } from "react";
import { Camera, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Snapshot {
  id: string; seo: number; aio: number; geo: number; aeo: number; sxo: number; overall: number;
  createdAt: string;
}

export function OptimizationTimeline() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSnapshots(); }, []);

  async function fetchSnapshots() {
    setLoading(true);
    const res = await fetch("/api/admin/optimization/timeline");
    const data = await res.json();
    setSnapshots(data.snapshots || []);
    setLoading(false);
  }

  async function takeSnapshot() {
    setSaving(true);
    await fetch("/api/admin/optimization/snapshot", { method: "POST" });
    setSaving(false);
    fetchSnapshots();
  }

  const chartData = snapshots.map((s) => ({
    date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    SEO: s.seo, AIO: s.aio, GEO: s.geo, AEO: s.aeo, SXO: s.sxo, Overall: s.overall,
  }));

  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots[snapshots.length - 2];
  const trend = latest && previous ? latest.overall - previous.overall : 0;

  if (loading) return <p className="py-8 text-center text-sm text-muted-foreground">Loading timeline...</p>;

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Score History</h3>
            <p className="text-xs text-muted-foreground">{snapshots.length} snapshots recorded</p>
          </div>
          <div className="flex items-center gap-3">
            {latest && (
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-brand">{latest.overall}</p>
                {trend !== 0 && (
                  <p className={`flex items-center justify-end text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                    {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trend > 0 ? "+" : ""}{trend} pts
                  </p>
                )}
              </div>
            )}
            <Button onClick={takeSnapshot} disabled={saving} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
              <Camera className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Take Snapshot"}
            </Button>
          </div>
        </div>

        {snapshots.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No snapshots yet. Click "Take Snapshot" to record your current scores and start tracking progress over time.
          </p>
        ) : (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Overall" stroke="var(--amber)" strokeWidth={3} />
                <Line type="monotone" dataKey="SEO" stroke="#f59e0b" strokeWidth={1.5} />
                <Line type="monotone" dataKey="AIO" stroke="#3b82f6" strokeWidth={1.5} />
                <Line type="monotone" dataKey="GEO" stroke="#8b5cf6" strokeWidth={1.5} />
                <Line type="monotone" dataKey="AEO" stroke="#10b981" strokeWidth={1.5} />
                <Line type="monotone" dataKey="SXO" stroke="#ef4444" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Snapshot history table */}
      {snapshots.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Overall</th>
                  <th className="px-4 py-3">SEO</th>
                  <th className="px-4 py-3">AIO</th>
                  <th className="px-4 py-3">GEO</th>
                  <th className="px-4 py-3">AEO</th>
                  <th className="px-4 py-3">SXO</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.slice().reverse().slice(0, 15).map((s, i) => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="px-4 py-2 text-xs">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 font-bold text-amber-brand">{s.overall}</td>
                    <td className="px-4 py-2">{s.seo}</td>
                    <td className="px-4 py-2">{s.aio}</td>
                    <td className="px-4 py-2">{s.geo}</td>
                    <td className="px-4 py-2">{s.aeo}</td>
                    <td className="px-4 py-2">{s.sxo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
