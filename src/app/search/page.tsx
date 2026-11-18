"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Copy,
  ExternalLink,
  Filter,
  Layers,
  Search as SearchIcon,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SimBadge } from "@/components/shared/sim-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useDemo } from "@/hooks/use-demo-state";
import {
  DEFAULT_FILTERS,
  SAMPLE_QUERIES,
  searchJobs,
  type RankedJob,
  type SearchFilters,
} from "@/lib/simulations/search";
import type { Region, SearchMode } from "@/lib/types";
import { sleep } from "@/lib/utils";

const REGIONS: Region[] = ["Aberdeen", "North Sea", "Norway", "Saudi Arabia", "Namibia", "UAE", "Qatar"];
const SOURCES = ["Direct", "Agency", "Unknown"];
const TYPES = ["Contract", "Staff", "Day Rate"];
const PATTERNS = ["Offshore", "Onshore", "Hybrid", "Rotational"];

export default function SearchPage() {
  const { lastSearchQuery, setLastSearchQuery, spend, selectJob } = useDemo();
  const [query, setQuery] = useState(lastSearchQuery);
  const [mode, setMode] = useState<SearchMode>("hybrid");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<RankedJob[]>([]);
  const [selected, setSelected] = useState<RankedJob | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [, startTransition] = useTransition();

  const runSearch = async (q: string, m: SearchMode, f: SearchFilters) => {
    setLoading(true);
    await sleep(m === "hybrid" ? 700 : 350);
    const ranked = searchJobs(q, m, f);
    startTransition(() => {
      setResults(ranked);
      setLoading(false);
    });
  };

  useEffect(() => {
    void runSearch(query, mode, filters);
    // initial + when mode/filters change after user search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, filters]);

  const dupCount = useMemo(() => results.filter((r) => r.isDuplicate).length, [results]);
  const avgRelevance = useMemo(
    () => (results.length ? Math.round(results.reduce((a, r) => a + r.relevance, 0) / results.length) : 0),
    [results]
  );

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const action = mode === "hybrid" ? "Hybrid search" : "Keyword search";
    spend(action, "AI Search", mode === "hybrid" ? 0.018 : 0.004);
    setLastSearchQuery(query);
    await runSearch(query, mode, filters);
  };

  const toggleFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      if (!Array.isArray(arr)) return prev;
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">AI Search</h1>
            <SimBadge />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Compare keyword vs hybrid semantic search across oil & gas roles. Hybrid expands tickets,
            basins and transferable signals — CrewDog&apos;s flagship retrieval experience.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/cv-matching">
            Match a CV to these jobs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. drilling engineer Aberdeen HPHT"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Sparkles className="h-4 w-4" />
                {mode === "hybrid" ? "Hybrid search" : "Keyword search"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowFilters((v) => !v)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {SAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  setLastSearchQuery(q);
                  spend(mode === "hybrid" ? "Hybrid search" : "Keyword search", "AI Search");
                  void runSearch(q, mode, filters);
                }}
                className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-200 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={mode} onValueChange={(v) => setMode(v as SearchMode)}>
              <TabsList>
                <TabsTrigger value="keyword">Keyword</TabsTrigger>
                <TabsTrigger value="hybrid">Hybrid semantic</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.hideDuplicates}
                  onCheckedChange={(v) => setFilters((f) => ({ ...f, hideDuplicates: v }))}
                />
                Hide duplicates
              </div>
              <Badge variant="teal">{results.length} results</Badge>
              <Badge variant="amber">Avg relevance {avgRelevance}</Badge>
              {!filters.hideDuplicates && dupCount > 0 && (
                <Badge variant="rose">{dupCount} duplicates visible</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Advanced filters</CardTitle>
                  <CardDescription>Every control is live</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FilterGroup
                    title="Region"
                    options={REGIONS}
                    selected={filters.regions}
                    onToggle={(v) => toggleFilter("regions", v)}
                  />
                  <FilterGroup
                    title="Source"
                    options={SOURCES}
                    selected={filters.sources}
                    onToggle={(v) => toggleFilter("sources", v)}
                  />
                  <FilterGroup
                    title="Type"
                    options={TYPES}
                    selected={filters.types}
                    onToggle={(v) => toggleFilter("types", v)}
                  />
                  <FilterGroup
                    title="Pattern"
                    options={PATTERNS}
                    selected={filters.patterns}
                    onToggle={(v) => toggleFilter("patterns", v)}
                  />
                  <div>
                    <div className="mb-2 flex justify-between text-xs text-slate-400">
                      <span>Min relevance</span>
                      <span>{filters.minRelevance}</span>
                    </div>
                    <Slider
                      value={[filters.minRelevance]}
                      min={0}
                      max={80}
                      step={5}
                      onValueChange={([v]) => setFilters((f) => ({ ...f, minRelevance: v }))}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                  >
                    Reset filters
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-teal-400" /> Mode insight
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2">
                  {mode === "keyword" ? (
                    <p>Exact token overlap only. Misses “HPHT experience → well integrity / completions”.</p>
                  ) : (
                    <p>
                      Expands basins, tickets and transferable skills. Surfaces Namibia FPSO roles from
                      “commissioning” queries and collapses multi-agency duplicates.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-3 w-1/3 mb-4" />
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-16 w-full" />
              </Card>
            ))
          ) : results.length === 0 ? (
            <EmptyState
              title="No roles matched"
              description="Loosen filters or try a hybrid sample query."
              actionLabel="Reset & search Aberdeen drilling"
              onAction={() => {
                setFilters(DEFAULT_FILTERS);
                setQuery("drilling engineer Aberdeen HPHT");
                setMode("hybrid");
                void runSearch("drilling engineer Aberdeen HPHT", "hybrid", DEFAULT_FILTERS);
              }}
            />
          ) : (
            results.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className={`cursor-pointer transition-colors hover:border-amber-500/30 ${
                    job.isDuplicate ? "opacity-80 border-rose-500/20" : ""
                  }`}
                  onClick={() => {
                    setSelected(job);
                    selectJob(job.id);
                  }}
                >
                  <CardContent className="pt-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">{job.title}</h3>
                          <Badge variant={job.source === "Direct" ? "green" : job.source === "Agency" ? "amber" : "default"}>
                            {job.source}
                          </Badge>
                          {job.isDuplicate && <Badge variant="rose">Likely duplicate</Badge>}
                          {job.duplicateGroup && !job.isDuplicate && filters.hideDuplicates && (
                            <Badge variant="blue">Deduped group</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {job.agency ? `${job.agency} · ` : ""}
                          {job.company} · {job.location} · {job.type} · {job.pattern}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-300">{job.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.matchedTerms.slice(0, 6).map((t) => (
                            <Badge key={t} variant={t.startsWith("~") ? "teal" : "outline"}>
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="w-full sm:w-36 shrink-0">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Relevance</span>
                          <span className="text-amber-300 font-semibold">{job.relevance}</span>
                        </div>
                        <Progress value={job.relevance} />
                        <p className="mt-2 text-[11px] text-slate-500 leading-snug">{job.rankReason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.company} · {selected.location} · {selected.rate ?? "Rate on enquiry"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="amber">{selected.source}</Badge>
                  <Badge>{selected.type}</Badge>
                  <Badge variant="teal">{selected.pattern}</Badge>
                  <SimBadge />
                </div>
                <p className="text-slate-300 leading-relaxed">{selected.description}</p>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Transferable</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.transferableSkills.map((s) => (
                      <Badge key={s} variant="teal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Citations</h4>
                  {selected.citations.map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 mb-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-200">{c.source}</span>
                        <Badge variant="green">{Math.round(c.confidence * 100)}%</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{c.snippet}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <ExternalLink className="h-3 w-3" /> Simulated source URL
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild>
                    <Link href="/cv-matching" onClick={() => selectJob(selected.id)}>
                      Match CV to this role
                    </Link>
                  </Button>
                  {selected.source === "Agency" && (
                    <Button asChild variant="secondary">
                      <Link href="/employer-discovery">
                        <Building2 className="h-4 w-4" /> Discover employer
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard?.writeText(selected.title)}
                  >
                    <Copy className="h-4 w-4" /> Copy title
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-slate-300">{title}</div>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <Checkbox checked={selected.includes(opt)} onCheckedChange={() => onToggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
