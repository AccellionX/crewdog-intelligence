"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { href: "/search", label: "Search" },
  { href: "/cv-matching", label: "Match" },
  { href: "/hiring-intelligence", label: "Demand" },
  { href: "/employer-discovery", label: "Employers" },
  { href: "/ai-intelligence", label: "Ask AI" },
  { href: "/credits", label: "Credits" },
];

export function JourneyBar() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const idx = STEPS.findIndex((s) => pathname.startsWith(s.href));
  const next = idx >= 0 && idx < STEPS.length - 1 ? STEPS[idx + 1] : null;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1.5">
        {STEPS.map((step, i) => {
          const active = pathname.startsWith(step.href);
          return (
            <div key={step.href} className="flex items-center gap-1.5">
              <Link
                href={step.href}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-amber-500 text-slate-950"
                    : i < idx
                      ? "bg-teal-500/15 text-teal-300"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                )}
              >
                {step.label}
              </Link>
              {i < STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-slate-600" />}
            </div>
          );
        })}
      </div>
      {next && (
        <Link
          href={next.href}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
        >
          Continue to {next.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
