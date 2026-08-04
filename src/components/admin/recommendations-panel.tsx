"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle, TrendingUp, Zap, Clock, ArrowRight, Lightbulb,
  Search, Brain, Sparkles, MessageSquare, MousePointerClick,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  pillar: "seo" | "aio" | "geo" | "aeo" | "sxo";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  impact: number;
  effort: "quick" | "medium" | "heavy";
  action?: { label: string; url: string };
}

interface Summary {
  total: number;
  critical: number;
  high: number;
  potentialGain: number;
}

interface ContentGap {
  type: "faq" | "entity" | "page" | "cta" | "project";
  title: string;
  description: string;
  pillar: string;
  suggestedContent?: string;
}

const PILLAR_CONFIG = {
  seo: { icon: Search, color: "var(--amber)", label: "SEO" },
  aio: { icon: Brain, color: "#3b82f6", label: "AIO" },
  geo: { icon: Sparkles, color: "#8b5cf6", label: "GEO" },
  aeo: { icon: MessageSquare, color: "#10b981", label: "AEO" },
  sxo: { icon: MousePointerClick, color: "#ef4444", label: "SXO" },
};

const PRIORITY_CONFIG = {
  critical: { color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
  high: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: TrendingUp },
  medium: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Lightbulb },
  low: { color: "bg-gray-100 text-gray-600 border-gray-200", icon: Clock },
};

const EFFORT_CONFIG = {
  quick: { label: "5 min", color: "text-green-600" },
  medium: { label: "30 min", color: "text-amber-600" },
  heavy: { label: "2+ hrs", color: "text-red-600" },
};

export function RecommendationsPanel() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [gaps, setGaps] = useState<ContentGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"recommendations" | "gaps">("recommendations");
  const [filterPillar, setFilterPillar] = useState<string>("all");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [recRes, gapRes] = await Promise.all([
      fetch("/api/admin/optimization/recommendations"),
      fetch("/api/admin/optimization/content-gaps"),
    ]);
    const recData = await recRes.json();
    const gapData = await gapRes.json();
    setRecs(recData.recommendations || []);
    setSummary(recData.summary || null);
    setGaps(gapData.gaps || []);
    setLoading(false);
  }

  const filteredRecs = filterPillar === "all" ? recs : recs.filter((r) => r.pillar === filterPillar);

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Analyzing your site and generating recommendations...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {summary && (
        <Card className="overflow-hidden p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Recommendations</p>
              <p className="mt-1 text-3xl font-bold">{summary.total}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Critical</p>
              <p className="mt-1 text-3xl font-bold text-red-600">{summary.critical}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">High Priority</p>
              <p className="mt-1 text-3xl font-bold text-amber-brand">{summary.high}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Potential Score Gain</p>
              <p className="mt-1 text-3xl font-bold text-green-600">+{summary.potentialGain}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={tab === "recommendations" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("recommendations")}
          className={tab === "recommendations" ? "bg-amber-brand text-amber-foreground" : ""}
        >
          <Zap className="mr-1 h-4 w-4" /> Recommendations ({recs.length})
        </Button>
        <Button
          variant={tab === "gaps" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("gaps")}
          className={tab === "gaps" ? "bg-amber-brand text-amber-foreground" : ""}
        >
          <Lightbulb className="mr-1 h-4 w-4" /> Content Gaps ({gaps.length})
        </Button>
      </div>

      {tab === "recommendations" ? (
        <>
          {/* Pillar filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterPillar("all")}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                filterPillar === "all" ? "border-amber-brand bg-amber-brand text-amber-foreground" : "border-border hover:border-amber-brand"
              )}
            >
              All ({recs.length})
            </button>
            {Object.entries(PILLAR_CONFIG).map(([key, cfg]) => {
              const count = recs.filter((r) => r.pillar === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFilterPillar(key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    filterPillar === key ? "border-amber-brand bg-amber-brand text-amber-foreground" : "border-border hover:border-amber-brand"
                  )}
                >
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Recommendations list */}
          <div className="space-y-3">
            {filteredRecs.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
                <p className="mt-2 text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground">No recommendations for this filter.</p>
              </Card>
            ) : (
              filteredRecs.map((rec) => {
                const pCfg = PILLAR_CONFIG[rec.pillar];
                const PIcon = pCfg.icon;
                const prCfg = PRIORITY_CONFIG[rec.priority];
                const PrIcon = prCfg.icon;
                const effCfg = EFFORT_CONFIG[rec.effort];
                return (
                  <Card key={rec.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Priority icon */}
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", prCfg.color)}>
                        <PrIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs" style={{ color: pCfg.color, borderColor: pCfg.color }}>
                            <PIcon className="mr-1 h-3 w-3" /> {pCfg.label}
                          </Badge>
                          <Badge className={cn("border text-xs", prCfg.color)}>{rec.priority}</Badge>
                          <Badge variant="outline" className={cn("text-xs", effCfg.color)}>
                            <Clock className="mr-1 h-3 w-3" /> {effCfg.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-green-600">
                            +{rec.impact} pts
                          </Badge>
                        </div>

                        {/* Title + description */}
                        <h3 className="mt-2 text-sm font-semibold">{rec.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{rec.description}</p>

                        {/* Action button */}
                        {rec.action && (
                          <Link href={rec.action.url}>
                            <Button size="sm" variant="outline" className="mt-3 h-7 text-xs">
                              {rec.action.label}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* Content Gaps */
        <div className="space-y-3">
          {gaps.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
              <p className="mt-2 text-sm font-medium">No content gaps detected!</p>
            </Card>
          ) : (
            gaps.map((gap, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-brand/10">
                    <Lightbulb className="h-4 w-4 text-amber-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{gap.type.toUpperCase()}</Badge>
                      <Badge variant="outline" className="text-xs text-amber-brand">{gap.pillar}</Badge>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{gap.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{gap.description}</p>
                    {gap.suggestedContent && (
                      <div className="mt-2 rounded-md border border-border bg-secondary/50 p-2">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Suggested Answer</p>
                        <p className="mt-1 text-xs">{gap.suggestedContent}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
