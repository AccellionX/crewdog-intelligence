import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

export function SimBadge({ label = "Simulated" }: { label?: string }) {
  return (
    <Badge variant="outline" className="gap-1 text-[10px] uppercase tracking-wider text-slate-400">
      <FlaskConical className="h-3 w-3" />
      {label}
    </Badge>
  );
}
