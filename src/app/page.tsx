"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CreditCard,
  FileSearch,
  Radar,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimBadge } from "@/components/shared/sim-badge";
import { useDemo } from "@/hooks/use-demo-state";

const MODULES = [
  {
    href: "/search",
    title: "AI Search",
    desc: "Keyword vs hybrid semantic ranking, filters, citations and intelligent deduplication.",
    icon: Search,
    flag: "Flagship",
  },
  {
    href: "/cv-matching",
    title: "CV Matching",
    desc: "Extract skills, surface transferable fits, score gaps and recommend next moves.",
    icon: FileSearch,
    flag: "Flagship",
  },
  {
    href: "/hiring-intelligence",
    title: "Hiring Intelligence",
    desc: "Contract awards → inferred workforce demand across Aberdeen to Namibia.",
    icon: Radar,
  },
  {
    href: "/employer-discovery",
    title: "Employer Discovery",
    desc: "Reveal real employers behind agency ads with evidence trails.",
    icon: Building2,
  },
  {
    href: "/ai-intelligence",
    title: "AI Intelligence",
    desc: "Multi-agent RAG: pgvector first, web fallback, rerank and validate.",
    icon: BrainCircuit,
  },
  {
    href: "/credits",
    title: "Credits & Billing",
    desc: "Interactive consumption, tiers, top-ups and AI cost analytics.",
    icon: CreditCard,
  },
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.45 },
  }),
};

export default function OverviewPage() {
  const { credits, plan, lastSearchQuery, selectedCandidateId } = useDemo();

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-wrap items-center gap-2">
          <Badge variant="amber">Personalised demo</Badge>
          <SimBadge label="Sales demonstration" />
        </div>

        <h1 className="font-display relative mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          CrewDog AI
          <span className="block text-amber-300">Intelligence Engine 2.0</span>
        </h1>
        <p className="relative mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          Built for <span className="text-white font-medium">Colin Rawlinson</span> — visualise the next
          generation of CrewDog: matching oil & gas professionals through{" "}
          <span className="text-teal-300">transferable skills</span>, not keywords. Aberdeen to Namibia,
          agency fog to employer clarity.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/search">
              Start with hybrid search
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/cv-matching">Explore transferable matching</Link>
          </Button>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Demo credits" value={credits.toLocaleString()} hint={plan} />
          <Stat label="Last search" value={lastSearchQuery.slice(0, 28) + "…"} hint="Persisted in journey" />
          <Stat label="Active CV" value={selectedCandidateId?.toUpperCase() ?? "—"} hint="Shared across modules" />
        </div>
      </motion.section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h2 className="font-display text-lg font-semibold text-white">Six connected modules</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.href} custom={i} initial="hidden" animate="show" variants={fade}>
                <Link href={m.href} className="block h-full">
                  <Card className="h-full transition-all hover:border-amber-500/30 hover:bg-slate-900">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="rounded-xl bg-slate-800 p-2.5 text-amber-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        {m.flag && <Badge variant="teal">{m.flag}</Badge>}
                      </div>
                      <CardTitle className="mt-3">{m.title}</CardTitle>
                      <CardDescription>{m.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
                        Open module <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Colin&apos;s vision, productised</CardTitle>
          <CardDescription>
            Inspired by crewdog.ai — Skyscanner for oil & gas, with intelligence that understands tickets,
            basins and transferable competence.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            "Hybrid search beats keyword blind spots on HPHT → completions mobility",
            "Agency ads resolve to real employers with confidence-scored evidence",
            "Database-first RAG keeps latency & cost low; web only when needed",
          ].map((t) => (
            <div key={t} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
              {t}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
      <div className="text-[11px] text-slate-500">{hint}</div>
    </div>
  );
}
