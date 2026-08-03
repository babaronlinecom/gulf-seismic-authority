"use client";

import * as React from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "../shared";

interface Msg { role: "user" | "assistant"; content: string }

const SUGGESTIONS = [
  "What info do you need to quote a thermoplastic road marking job in Riyadh?",
  "Thermoplastic vs cold plastic — which should I specify for a warehouse floor?",
  "Can you mobilize for a Saudi airport marking project?",
  "What's in a road-marking ITP?",
];

export function RfqAssistant() {
  const t = useContent();
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a response. Please try again or submit an RFQ directly.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Connection error. Please submit an RFQ directly and our team will respond." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-[460px]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold flex items-center gap-1.5">
            {t.contactRfq.assistantTitle}
            <Sparkles className="h-3.5 w-3.5 text-brand" />
          </div>
          <div className="text-xs text-muted-foreground">{t.contactRfq.assistantSub}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-area p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
              Ask me anything about road marking scope, materials, method, standards or your RFQ. I'll help you assemble a brief Gulf Seismic can quote.
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/80 transition hover:border-brand/40 hover:text-brand text-start"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-foreground text-background" : "bg-brand text-brand-foreground"}`}>
              {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </span>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-foreground text-background rounded-tr-sm" : "bg-secondary text-foreground rounded-tl-sm"}`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <div className="rounded-2xl bg-secondary px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Type your question…"
            className="min-h-[44px] max-h-24 resize-none"
          />
          <Button onClick={() => send()} disabled={loading || !input.trim()} className="bg-brand text-brand-foreground hover:brightness-105 shrink-0">
            <Send className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
