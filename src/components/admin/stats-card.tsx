import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCENTS: Record<string, string> = {
  amber: "bg-amber-brand text-amber-foreground",
  blue: "bg-blue-600 text-white",
  green: "bg-green-600 text-white",
  default: "bg-primary text-primary-foreground",
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  accent = "default",
  sub,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: keyof typeof ACCENTS | string;
  sub?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", ACCENTS[accent] ?? ACCENTS.default)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
