"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Radar, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimBadge } from "@/components/shared/sim-badge";
import { COMPANIES, CONTRACTS, PROJECTS } from "@/lib/data/hiring";
import { useDemo } from "@/hooks/use-demo-state";
import type { Region } from "@/lib/types";

const REGIONS: Array<Region | "All"> = [
  "All",
  "Aberdeen",
  "North Sea",
  "Norway",
  "Saudi Arabia",
  "Namibia",
];

export default function HiringIntelligencePage() {
  const { spend } = useDemo();
  const [region, setRegion] = useState<Region | "All">("All");
  const [selectedContract, setSelectedContract] = useState(CONTRACTS[0].id);

  const contracts = useMemo(
    () => (region === "All" ? CONTRACTS : CONTRACTS.filter((c) => c.region === region)),
    [region]
  );
  const projects = useMemo(
    () => (region === "All" ? PROJECTS : PROJECTS.filter((p) => p.region === region)),
    [region]
  );
  const companies = useMemo(
    () => (region === "All" ? COMPANIES : COMPANIES.filter((c) => c.region === region || region === "North Sea")),
    [region]
  );

  const active = contracts.find((c) => c.id === selectedContract) ?? contracts[0] ?? CONTRACTS[0];

  const demandChart = useMemo(() => {
    const map = new Map<string, number>();
    contracts.forEach((c) =>
      c.inferredDemand.forEach((d) => {
        map.set(d.role, (map.get(d.role) ?? 0) + d.estimatedHeadcount);
      })
    );
    return [...map.entries()]
      .map(([role, headcount]) => ({ role: role.split(" ")[0] + "…", full: role, headcount }))
      .sort((a, b) => b.headcount - a.headcount)
      .slice(0, 8);
  }, [contracts]);

  const scan = () => {
    spend("Hiring signal scan", "Hiring Intelligence", 0.021);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Hiring Intelligence</h1>
            <SimBadge />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Contract awards and emerging projects → inferred workforce demand. Spot early hiring before
            the job boards fill up.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={scan}>
            <Radar className="h-3.5 w-3.5" /> Scan signals
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/employer-discovery">
              Reveal employers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
              region === r ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Contract awards"
          value={String(contracts.length)}
          hint="In selected basin view"
          icon={<TrendingUp className="h-4 w-4 text-amber-400" />}
        />
        <StatCard
          label="Emerging projects"
          value={String(projects.length)}
          hint="Exploration → decom"
          icon={<Radar className="h-4 w-4 text-teal-400" />}
        />
        <StatCard
          label="Companies tracked"
          value={String(companies.length)}
          hint="Operators, EPCI, agencies"
          icon={<Building2 className="h-4 w-4 text-blue-400" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inferred workforce demand</CardTitle>
            <CardDescription>Aggregated from award → discipline mapping (simulated)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="role" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ""}
                />
                <Bar dataKey="headcount" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Early hiring opportunities</CardTitle>
            <CardDescription>From selected award: {active.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {active.inferredDemand.map((d) => (
              <div key={d.role} className="rounded-xl border border-slate-800 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{d.role}</span>
                  <Badge variant={d.urgency === "Immediate" ? "rose" : d.urgency === "3 months" ? "amber" : "outline"}>
                    {d.urgency}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>≈ {d.estimatedHeadcount} headcount</span>
                  <span>{Math.round(d.confidence * 100)}% confidence</span>
                </div>
                <Progress value={d.confidence * 100} className="mt-2" indicatorClassName="bg-teal-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracts">
        <TabsList>
          <TabsTrigger value="contracts">Contract awards</TabsTrigger>
          <TabsTrigger value="projects">Emerging projects</TabsTrigger>
          <TabsTrigger value="companies">Company intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="grid gap-3 md:grid-cols-2">
          {contracts.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card
                className={`cursor-pointer hover:border-amber-500/30 ${selectedContract === c.id ? "border-amber-500/40" : ""}`}
                onClick={() => setSelectedContract(c.id)}
              >
                <CardContent className="pt-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={c.status === "Awarded" ? "green" : "amber"}>{c.status}</Badge>
                    <Badge variant="outline">{c.region}</Badge>
                    <span className="text-xs text-slate-500">{c.awardedAt}</span>
                  </div>
                  <h3 className="font-semibold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400">
                    {c.operator} → {c.contractor} · {c.value}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {c.disciplines.map((d) => (
                      <Badge key={d} variant="teal">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="projects" className="grid gap-3 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-5 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="blue">{p.phase}</Badge>
                  <Badge variant="outline">{p.region}</Badge>
                  <Badge variant="amber">{Math.round(p.confidence * 100)}%</Badge>
                </div>
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400">
                  {p.operator} · {p.location} · {p.startDate}
                </p>
                <p className="text-sm text-slate-300">{p.hiringOutlook}</p>
                <div className="flex flex-wrap gap-1">
                  {p.disciplines.map((d) => (
                    <Badge key={d}>{d}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="companies" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {companies.map((co) => (
            <Card key={co.id}>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{co.name}</h3>
                  <Badge
                    variant={
                      co.hiringTrend === "Rising" ? "green" : co.hiringTrend === "Cooling" ? "rose" : "outline"
                    }
                  >
                    {co.hiringTrend}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {co.type} · {co.hq}
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 py-2">
                    <div className="text-sm font-semibold text-amber-300">{co.activeProjects}</div>
                    <div className="text-[10px] text-slate-500">Projects</div>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 py-2">
                    <div className="text-sm font-semibold text-teal-300">{co.openRoles}</div>
                    <div className="text-[10px] text-slate-500">Open roles</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {co.specialties.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-5 flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-500">{hint}</div>
        </div>
        <div className="rounded-xl bg-slate-800 p-2">{icon}</div>
      </CardContent>
    </Card>
  );
}
