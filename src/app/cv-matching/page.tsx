"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimBadge } from "@/components/shared/sim-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { StreamingText } from "@/components/shared/streaming-text";
import { CANDIDATES } from "@/lib/data/candidates";
import { useDemo } from "@/hooks/use-demo-state";
import { extractSkillsNarrative, getCandidate, matchCandidateToJobs } from "@/lib/simulations/matching";
import type { MatchResult } from "@/lib/types";
import { sleep } from "@/lib/utils";

export default function CVMatchingPage() {
  const { selectedCandidateId, selectCandidate, spend, selectJob } = useDemo();
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);
  const [showStream, setShowStream] = useState(false);

  const candidate = useMemo(
    () => getCandidate(selectedCandidateId ?? "cv-001"),
    [selectedCandidateId]
  );
  const narrative = useMemo(() => extractSkillsNarrative(candidate), [candidate]);

  const runMatch = async (id: string) => {
    setLoading(true);
    setShowStream(false);
    await sleep(900);
    const results = matchCandidateToJobs(id);
    setMatches(results);
    setActiveMatch(results[0] ?? null);
    setLoading(false);
    setShowStream(true);
  };

  useEffect(() => {
    void runMatch(candidate.id);
  }, [candidate.id]);

  const onSelectCV = (id: string) => {
    selectCandidate(id);
    spend("CV match run", "CV Matching", 0.042);
  };

  const onExtract = async () => {
    setExtracting(true);
    spend("Skill extraction", "CV Matching", 0.012);
    await sleep(600);
    setExtracting(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">CV Matching</h1>
            <SimBadge />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Colin&apos;s differentiator: transferable skills open roles that keyword matching would miss.
            Select a sample CV, extract skills, and inspect qualification gaps.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/hiring-intelligence">
            See where demand is rising <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CANDIDATES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCV(c.id)}
            className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              c.id === candidate.id
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-800 p-2">
                <User className="h-4 w-4 text-amber-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <div className="text-[11px] text-slate-400">{c.title}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              <Badge variant="outline">{c.region}</Badge>
              <Badge variant="teal">{c.yearsExperience} yrs</Badge>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription>
                {candidate.title} · {candidate.location} · {candidate.availability}
              </CardDescription>
            </div>
            <Button size="sm" onClick={onExtract} disabled={extracting}>
              <Sparkles className="h-3.5 w-3.5" />
              {extracting ? "Extracting…" : "Extract skills"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">{candidate.summary}</p>

            {extracting ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
                <Skeleton className="h-8 w-4/6" />
              </div>
            ) : (
              <Tabs defaultValue="transferable">
                <TabsList>
                  <TabsTrigger value="transferable">Transferable</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="tickets">Tickets</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>
                <TabsContent value="transferable" className="space-y-2">
                  <p className="text-xs text-teal-300/90 mb-2">{narrative.insight}</p>
                  {narrative.transferable.map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="w-40 truncate text-xs text-slate-300">{s.name}</span>
                      <Progress value={(s.level ?? 3) * 20} className="flex-1" indicatorClassName="bg-teal-500" />
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="technical" className="space-y-2">
                  {narrative.technical.map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="w-40 truncate text-xs text-slate-300">{s.name}</span>
                      <Progress value={(s.level ?? 3) * 20} className="flex-1" />
                      <Badge variant="outline">{s.category}</Badge>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="tickets">
                  <div className="flex flex-wrap gap-2">
                    {narrative.tickets.map((t) => (
                      <Badge key={t} variant="amber">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="experience" className="space-y-3">
                  {candidate.experience.map((ex) => (
                    <div key={ex.role + ex.period} className="rounded-xl border border-slate-800 p-3">
                      <div className="text-sm font-medium text-white">{ex.role}</div>
                      <div className="text-xs text-slate-400">
                        {ex.company} · {ex.location} · {ex.period}
                      </div>
                      <ul className="mt-2 list-disc pl-4 text-xs text-slate-300 space-y-1">
                        {ex.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Personalised recommendation
            </CardTitle>
            <CardDescription>Streaming synthesis from match engine</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !activeMatch ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : showStream ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ScoreRing score={activeMatch.score} label="Fit" />
                  <div>
                    <div className="text-sm font-semibold text-white">{activeMatch.job.title}</div>
                    <div className="text-xs text-slate-400">
                      {activeMatch.job.company} · {activeMatch.job.location}
                    </div>
                  </div>
                </div>
                <StreamingText
                  text={activeMatch.recommendation}
                  className="text-sm text-slate-300 leading-relaxed min-h-[3rem]"
                  speed={14}
                />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <MiniStat label="Keyword" value={activeMatch.keywordScore} />
                  <MiniStat label="Semantic" value={activeMatch.semanticScore} />
                  <MiniStat label="Transfer" value={activeMatch.transferableScore} />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="font-display mb-3 text-lg font-semibold text-white">Ranked job matches</h2>
        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {matches.slice(0, 8).map((m, i) => (
              <motion.div
                key={m.job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card
                  className={`h-full cursor-pointer transition-colors hover:border-amber-500/30 ${
                    activeMatch?.job.id === m.job.id ? "border-amber-500/40" : ""
                  }`}
                  onClick={() => {
                    setActiveMatch(m);
                    selectJob(m.job.id);
                    setShowStream(true);
                  }}
                >
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{m.job.title}</h3>
                        <p className="text-xs text-slate-400">
                          {m.job.company} · {m.job.region} · {m.job.source}
                        </p>
                      </div>
                      <ScoreRing score={m.score} size={52} />
                    </div>
                    {m.transferableMatches.length > 0 && (
                      <div className="rounded-xl bg-teal-500/5 border border-teal-500/20 p-2.5 space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-teal-400">Transferable links</div>
                        {m.transferableMatches.slice(0, 2).map((t) => (
                          <p key={t.from + t.to} className="text-xs text-slate-300">
                            <span className="text-teal-300">{t.from}</span> → {t.to}
                            <span className="text-slate-500"> — {t.reason}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {m.gaps.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Gaps</div>
                        <div className="flex flex-wrap gap-1">
                          {m.gaps.map((g) => (
                            <Badge
                              key={g.skill}
                              variant={g.severity === "high" ? "rose" : g.severity === "medium" ? "amber" : "outline"}
                            >
                              {g.skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {activeMatch && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Qualification gap plan — {activeMatch.job.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {activeMatch.gaps.map((g) => (
              <div key={g.skill} className="rounded-xl border border-slate-800 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{g.skill}</span>
                  <Badge variant={g.severity === "high" ? "rose" : g.severity === "medium" ? "amber" : "outline"}>
                    {g.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400">{g.recommendation}</p>
              </div>
            ))}
            {activeMatch.gaps.length === 0 && (
              <p className="text-sm text-slate-400">No material gaps detected for this simulated match.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 py-2">
      <div className="text-[10px] uppercase text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-amber-300">{value}</div>
    </div>
  );
}
