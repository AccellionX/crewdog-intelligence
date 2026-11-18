"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, Fingerprint, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SimBadge } from "@/components/shared/sim-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { AGENCY_LISTINGS, EMPLOYER_REVEALS } from "@/lib/data/employers";
import { useDemo } from "@/hooks/use-demo-state";
import type { EmployerReveal } from "@/lib/types";
import { sleep } from "@/lib/utils";

export default function EmployerDiscoveryPage() {
  const { spend } = useDemo();
  const [selectedId, setSelectedId] = useState(AGENCY_LISTINGS[0].id);
  const [revealing, setRevealing] = useState(false);
  const [reveal, setReveal] = useState<EmployerReveal | null>(EMPLOYER_REVEALS[AGENCY_LISTINGS[0].id]);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set([AGENCY_LISTINGS[0].id]));

  const listing = AGENCY_LISTINGS.find((l) => l.id === selectedId)!;

  const onReveal = async (id: string) => {
    setSelectedId(id);
    setRevealing(true);
    setReveal(null);
    spend("Employer reveal", "Employer Discovery", 0.061);
    await sleep(1100);
    setReveal(EMPLOYER_REVEALS[id]);
    setRevealedIds((prev) => new Set(prev).add(id));
    setRevealing(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Employer Discovery</h1>
            <SimBadge />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Simulate identifying the real employer behind recruitment agency adverts — with evidence
            trails and confidence scores. CrewDog&apos;s “who actually hired?” clarity layer.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/ai-intelligence">
            Ask the intelligence engine <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-300">Agency listings</h2>
          {AGENCY_LISTINGS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className={`cursor-pointer transition-colors hover:border-amber-500/30 ${
                  selectedId === item.id ? "border-amber-500/40" : ""
                }`}
                onClick={() => {
                  setSelectedId(item.id);
                  if (revealedIds.has(item.id)) setReveal(EMPLOYER_REVEALS[item.id]);
                  else setReveal(null);
                }}
              >
                <CardContent className="pt-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="amber">{item.agencyName}</Badge>
                    <Badge variant="outline">{item.region}</Badge>
                    {revealedIds.has(item.id) && (
                      <Badge variant="green">
                        <Eye className="h-3 w-3 mr-1" /> Revealed
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{item.jobTitle}</h3>
                  <p className="text-xs text-slate-400">
                    {item.location} · Posted {item.postedAt}
                  </p>
                  <p className="text-sm text-slate-300 line-clamp-2">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-amber-400" /> Selected advert
              </CardTitle>
              <CardDescription>
                {listing.agencyName} · {listing.jobTitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">{listing.description}</p>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Clues in copy</div>
                <div className="flex flex-wrap gap-1.5">
                  {listing.clues.map((c) => (
                    <Badge key={c} variant="teal">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={() => onReveal(listing.id)} disabled={revealing}>
                {revealing ? "Analysing evidence…" : revealedIds.has(listing.id) ? "Re-run discovery" : "Reveal employer"}
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {revealing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-5 space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <p className="text-xs text-slate-500">Matching contracts · language patterns · agency channels…</p>
                </Card>
              </motion.div>
            )}

            {!revealing && reveal && (
              <motion.div
                key={reveal.listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-teal-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-teal-400" />
                          {reveal.inferredEmployer}
                        </CardTitle>
                        <CardDescription>Inferred end employer (simulated)</CardDescription>
                      </div>
                      <ScoreRing score={reveal.confidence * 100} size={56} label="Conf" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                        Evidence trail
                      </div>
                      <div className="space-y-2">
                        {reveal.evidence.map((e) => (
                          <div key={e.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{e.type}</Badge>
                                <span className="text-sm font-medium text-slate-200">{e.label}</span>
                              </div>
                              <span className="text-xs text-amber-300">{Math.round(e.weight * 100)}%</span>
                            </div>
                            <p className="mt-1.5 text-xs text-slate-400">{e.detail}</p>
                            <Progress value={e.weight * 100} className="mt-2 h-1.5" indicatorClassName="bg-teal-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                        Alternatives
                      </div>
                      <div className="space-y-2">
                        {reveal.alternatives.map((a) => (
                          <div key={a.name} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{a.name}</span>
                            <span className="text-slate-500">{Math.round(a.confidence * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/hiring-intelligence">Correlate with contract awards</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!revealing && !reveal && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  Select an agency advert and click <span className="text-amber-300">Reveal employer</span> to
                  generate a confidence-scored evidence trail.
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
