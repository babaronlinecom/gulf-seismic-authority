"use client";

import * as React from "react";
import { Upload, Loader2, ScanText, FileImage, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "../shared";
import { toast } from "sonner";

export function DrawingAnalyzer() {
  const t = useContent();
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("");
  const [analysis, setAnalysis] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image (PNG/JPG) of your drawing or spec extract");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Max 6MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(reader.result as string);
      setFileName(file.name);
      setAnalysis("");
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!dataUrl) return;
    setLoading(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/analyze-drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis || "No analysis returned.");
    } catch (err) {
      setAnalysis(err instanceof Error ? `Error: ${err.message}` : "Analysis failed. Please try again or submit your RFQ directly.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDataUrl(null);
    setFileName("");
    setAnalysis("");
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
          <ScanText className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold">{t.contactRfq.analyzerTitle}</div>
          <div className="text-xs text-muted-foreground">{t.contactRfq.analyzerSub}</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!dataUrl ? (
          <div
            className="rounded-lg border-2 border-dashed border-border p-8 text-center transition hover:border-brand/50 cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
          >
            <FileImage className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Upload a drawing or spec extract</p>
            <p className="text-xs text-muted-foreground">PNG / JPG — we'll read line types, materials and inspection points</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-border bg-secondary/30">
              {/* uploaded drawing preview */}
              <img src={dataUrl} alt={fileName} className="max-h-64 w-full object-contain" />
              <button
                onClick={reset}
                className="absolute top-2 end-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={analyze} disabled={loading} className="bg-brand text-brand-foreground hover:brightness-105">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanText className="h-4 w-4" />}
                {loading ? "Analyzing…" : "Analyze drawing"}
              </Button>
              <span className="text-xs text-muted-foreground truncate">{fileName}</span>
            </div>
          </div>
        )}

        {analysis && (
          <div className="rounded-lg border border-brand/30 bg-brand/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand mb-2">AI analysis</div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
}
