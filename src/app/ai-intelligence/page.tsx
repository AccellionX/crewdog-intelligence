"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Database,
  Globe,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SimBadge } from "@/components/shared/sim-badge";
import { StreamingText } from "@/components/shared/streaming-text";
import { useDemo } from "@/hooks/use-demo-state";
import {
  LATENCY_COMPARISON,
  SAMPLE_QUESTIONS,
  runIntelligenceQuery,
} from "@/lib/simulations/intelligence";
import type { AgentStep, IntelligenceQuery } from "@/lib/types";
import { sleep } from "@/lib/utils";

export default function AIIntelligencePage() {
  const { spend } = useDemo();
  const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [result, setResult] = useState<IntelligenceQuery | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  const run = async (q: string) => {
    setRunning(true);
    setResult(null);
    setStreamReady(false);
    setSteps([]);
    spend("AI intelligence query", "AI Intelligence", 0.05);

    const final = runIntelligenceQuery(q);
    const pending = final.steps.map((s) => ({ ...s, status: "pending" as const }));
    setSteps(pending);

    for (let i = 0; i < final.steps.length; i++) {
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...final.steps[i], status: "running" } : idx < i ? final.steps[idx] : s
        )
      );
      await sleep(final.steps[i].latencyMs * 0.45 + 180);
      if (final.steps[i].agent === "Web Fallback" && final.steps[i].status === "fallback") {
        spend("Agent web fallback", "AI Intelligence", 0.028);
      }
      if (final.steps[i].agent === "Reranker") {
        spend("Rerank pass", "AI Intelligence", 0.006);
      }
      setSteps((prev) => prev.map((s, idx) => (idx === i ? final.steps[i] : idx < i ? final.steps[idx] : s)));
    }

    setResult(final);
    setStreamReady(true);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">AI Intelligence</h1>
            <SimBadge />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Interactive multi-agent execution: database-first RAG with pgvector, reranking, live web
            fallback only when needed, then answer validation — with latency and cost transparency.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/credits">
            View credit burn <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      <Card>
        <CardContent className="pt-5 space-y-4">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void run(question);
            }}
          >
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about basins, demand, employers…"
              className="flex-1"
            />
            <Button type="submit" disabled={running || !question.trim()}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Run agents
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  void run(q);
                }}
                className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-300 hover:border-amber-500/40 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Multi-agent execution trace</CardTitle>
            <CardDescription>Live simulated pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.length === 0 && !running && (
              <p className="text-sm text-slate-500 py-8 text-center">
                Run a query to watch Router → Retriever → Reranker → Fallback → Generator → Validator.
              </p>
            )}
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3"
              >
                <div className="mt-0.5">
                  {step.status === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  ) : step.status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : step.status === "fallback" ? (
                    <Globe className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-white">{step.agent}</span>
                    <Badge
                      variant={
                        step.status === "fallback"
                          ? "blue"
                          : step.status === "done"
                            ? "green"
                            : step.status === "running"
                              ? "amber"
                              : "outline"
                      }
                    >
                      {step.status}
                    </Badge>
                    {step.status !== "pending" && (
                      <>
                        <span className="text-[11px] text-slate-500">{step.latencyMs}ms</span>
                        <span className="text-[11px] text-slate-500">${step.costUsd.toFixed(3)}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{step.detail}</p>
                  {step.sources && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {step.sources.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4 text-teal-400" /> Grounded answer
              </CardTitle>
              <CardDescription>
                {result
                  ? `Mode: ${result.mode} · ${result.totalLatencyMs}ms · $${result.totalCostUsd}`
                  : "Waiting for pipeline"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {running && !result && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
              <AnimatePresence>
                {result && streamReady && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <StreamingText
                      text={result.answer.replace(/\*\*/g, "")}
                      className="prose-demo text-sm whitespace-pre-wrap"
                      speed={8}
                    />
                    <div className="mt-4 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">Citations</div>
                      {result.citations.map((c) => (
                        <div key={c.id} className="rounded-lg border border-slate-800 p-2.5 text-xs">
                          <div className="flex justify-between gap-2">
                            <span className="font-medium text-slate-200">{c.source}</span>
                            <Badge variant="green">{Math.round(c.confidence * 100)}%</Badge>
                          </div>
                          <p className="mt-1 text-slate-400">{c.snippet}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                      <Shield className="h-3.5 w-3.5" /> Validator passed — simulated claim checks
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!running && !result && (
                <p className="text-sm text-slate-500 py-10 text-center">
                  Answers stream after agents complete. Database-first keeps cost low.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latency & cost comparison</CardTitle>
          <CardDescription>Simulated quality vs spend across retrieval strategies</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={LATENCY_COMPARISON}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
              />
              <Legend />
              <Bar dataKey="latency" name="Latency (ms)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quality" name="Quality score" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
