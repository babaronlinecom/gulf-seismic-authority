"use client";

import { useState, useEffect } from "react";
import { Search, Brain, Sparkles, MessageSquare, MousePointerClick, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Scores {
  seo: number; aio: number; geo: number; aeo: number; sxo: number; overall: number;
}

const PILLARS = [
  { key: "seo", label: "SEO", fullLabel: "Search Engine Optimization", desc: "Visibility in search engine results", icon: Search, color: "var(--amber)" },
  { key: "aio", label: "AIO", fullLabel: "Artificial Intelligence Optimization", desc: "Making content understandable for AI", icon: Brain, color: "#3b82f6" },
  { key: "geo", label: "GEO", fullLabel: "Generative Engine Optimization", desc: "Included in AI-generated results", icon: Sparkles, color: "#8b5cf6" },
  { key: "aeo", label: "AEO", fullLabel: "Answer Engine Optimization", desc: "Direct answers in search & AI", icon: MessageSquare, color: "#10b981" },
  { key: "sxo", label: "SXO", fullLabel: "Search Experience Optimization", desc: "Smooth & converting search flow", icon: MousePointerClick, color: "#ef4444" },
];

export function OptimizationHub() {
  const [scores, setScores] = useState<Scores | null>(null);
  const [counts, setCounts] = useState({ profiles: 0, entities: 0, faqs: 0, ctas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchScores(); }, []);

  async function fetchScores() {
    setLoading(true);
    const res = await fetch("/api/admin/optimization/scores");
    const data = await res.json();
    setScores(data.scores);
    setCounts(data.counts);
    setLoading(false);
  }

  if (loading) return <p className="py-12 text-center text-sm text-muted-foreground">Loading optimization scores...</p>;
  if (!scores) return <p className="py-12 text-center text-sm text-muted-foreground">Failed to load scores.</p>;

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <Card className="overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Overall Optimization Score</h2>
            <p className="mt-1 text-5xl font-bold text-amber-brand">{scores.overall}<span className="text-2xl text-muted-foreground">/100</span></p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-brand">
            <TrendingUp className="h-8 w-8 text-amber-brand" />
          </div>
        </div>
        <Progress value={scores.overall} className="mt-4 h-2" />
      </Card>

      {/* 5 Pillars */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const score = scores[pillar.key as keyof Scores];
          return (
            <Card key={pillar.key} className="p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: pillar.color + "20" }}>
                  <Icon className="h-5 w-5" style={{ color: pillar.color }} />
                </div>
                <div>
                  <div className="text-sm font-bold">{pillar.label}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{pillar.fullLabel}</div>
                </div>
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold" style={{ color: pillar.color }}>{score}</span>
                <span className="mb-1 text-sm text-muted-foreground">/100</span>
              </div>
              <Progress value={score} className="mt-2 h-1.5" style={{ "--progress-color": pillar.color } as React.CSSProperties} />
              <p className="mt-2 text-xs text-muted-foreground">{pillar.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{counts.profiles}</p>
          <p className="text-xs text-muted-foreground">SEO Profiles</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{counts.entities}</p>
          <p className="text-xs text-muted-foreground">AI Entities</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{counts.faqs}</p>
          <p className="text-xs text-muted-foreground">FAQ Clusters</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{counts.ctas}</p>
          <p className="text-xs text-muted-foreground">Conversion CTAs</p>
        </Card>
      </div>
    </div>
  );
}
