"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Building2,
  CreditCard,
  FileSearch,
  Menu,
  Radar,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/hooks/use-demo-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/", label: "Overview", icon: Sparkles, step: 0 },
  { href: "/search", label: "AI Search", icon: Search, step: 1 },
  { href: "/cv-matching", label: "CV Matching", icon: FileSearch, step: 2 },
  { href: "/hiring-intelligence", label: "Hiring Intelligence", icon: Radar, step: 3 },
  { href: "/employer-discovery", label: "Employer Discovery", icon: Building2, step: 4 },
  { href: "/ai-intelligence", label: "AI Intelligence", icon: BrainCircuit, step: 5 },
  { href: "/credits", label: "Credits & Billing", icon: CreditCard, step: 6 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { credits, plan, setJourneyStep } = useDemo();
  const [open, setOpen] = useState(false);

  const NavLinks = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              setJourneyStep(item.step);
              setOpen(false);
            }}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active ? "text-amber-200" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-xl bg-amber-500/10 border border-amber-500/20"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="relative h-4 w-4 shrink-0" />
            <span className="relative font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
            CD
          </div>
          <span className="font-semibold text-white">Intelligence 2.0</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-slate-950/95 pt-16 lg:hidden">
          {NavLinks}
          <div className="mt-4 border-t border-slate-800 px-6 py-4">
            <CreditsPill credits={credits} plan={plan} />
          </div>
        </div>
      )}

      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-800 lg:bg-slate-950/80">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            CD
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">CrewDog AI</div>
            <div className="text-[11px] text-slate-400">Intelligence Engine 2.0</div>
          </div>
        </div>
        {NavLinks}
        <div className="mt-auto border-t border-slate-800 p-4">
          <CreditsPill credits={credits} plan={plan} />
          <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
            Demo for Colin Rawlinson · All metrics simulated · No live APIs
          </p>
        </div>
      </aside>
    </>
  );
}

function CreditsPill({ credits, plan }: { credits: number; plan: string }) {
  return (
    <Link
      href="/credits"
      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 hover:border-amber-500/30 transition-colors"
    >
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">Credits</div>
        <div className="text-sm font-semibold text-white">{credits.toLocaleString()}</div>
      </div>
      <Badge variant="amber">{plan}</Badge>
    </Link>
  );
}
