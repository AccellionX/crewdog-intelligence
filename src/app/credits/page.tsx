"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, CreditCard, Sparkles, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimBadge } from "@/components/shared/sim-badge";
import {
  COST_ANALYTICS,
  CREDIT_COSTS,
  MODULE_COST_SHARE,
  PLANS,
  TOP_UPS,
} from "@/lib/data/billing";
import { useDemo } from "@/hooks/use-demo-state";
import type { DemoState } from "@/lib/types";

export default function CreditsPage() {
  const { credits, plan, usage, topUp, setPlan, resetDemo } = useDemo();
  const [confirmTopUp, setConfirmTopUp] = useState<(typeof TOP_UPS)[0] | null>(null);
  const [planModal, setPlanModal] = useState<DemoState["plan"] | null>(null);

  const totalSpend = useMemo(
    () => usage.filter((u) => u.credits < 0).reduce((a, u) => a + Math.abs(u.costUsd), 0),
    [usage]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Credits & Billing</h1>
            <SimBadge label="No real payments" />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Interactive credit consumption across the journey. Subscription tiers, top-ups, usage ledger
            and AI cost analytics — all simulated for Colin&apos;s sales walkthrough.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/">
            Back to overview <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Balance</div>
              <Wallet className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-1 text-3xl font-bold text-white">{credits.toLocaleString()}</div>
            <div className="text-xs text-slate-500">credits remaining</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Plan</div>
              <CreditCard className="h-4 w-4 text-teal-400" />
            </div>
            <div className="mt-1 text-3xl font-bold text-white">{plan}</div>
            <div className="text-xs text-slate-500">simulated subscription</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">AI cost (demo)</div>
              <Sparkles className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-1 text-3xl font-bold text-white">${totalSpend.toFixed(2)}</div>
            <div className="text-xs text-slate-500">ledger AI spend</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Subscription tiers</TabsTrigger>
          <TabsTrigger value="topups">Top-ups</TabsTrigger>
          <TabsTrigger value="ledger">Usage ledger</TabsTrigger>
          <TabsTrigger value="analytics">AI cost analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -2 }}>
              <Card className={`h-full ${p.highlight ? "border-amber-500/40 shadow-amber-500/10" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{p.id}</CardTitle>
                    {p.highlight && <Badge variant="amber">Popular</Badge>}
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold text-white">£{p.price}</span>
                    <span className="text-slate-500"> / mo</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-amber-300">{p.credits.toLocaleString()} credits / month</div>
                  <ul className="space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan === p.id ? "secondary" : "default"}
                    onClick={() => setPlanModal(p.id)}
                  >
                    {plan === p.id ? "Current plan" : "Switch plan"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="topups" className="grid gap-4 sm:grid-cols-3">
          {TOP_UPS.map((t) => (
            <Card key={t.id}>
              <CardContent className="pt-5 space-y-3">
                <Badge variant="outline">{t.label}</Badge>
                <div className="text-2xl font-bold text-white">+{t.credits.toLocaleString()}</div>
                <div className="text-sm text-slate-400">£{t.price} simulated</div>
                <Button className="w-full" onClick={() => setConfirmTopUp(t)}>
                  Top up
                </Button>
              </CardContent>
            </Card>
          ))}
          <Card className="sm:col-span-3">
            <CardHeader>
              <CardTitle className="text-sm">Credit price list</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-3">
              {Object.entries(CREDIT_COSTS).map(([action, cost]) => (
                <div
                  key={action}
                  className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-xs"
                >
                  <span className="text-slate-300">{action}</span>
                  <span className="text-amber-300 font-medium">{cost} cr</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Usage ledger</CardTitle>
                <CardDescription>Live as you use other modules</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={resetDemo}>
                Reset demo state
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="py-2 pr-4">When</th>
                      <th className="py-2 pr-4">Action</th>
                      <th className="py-2 pr-4">Module</th>
                      <th className="py-2 pr-4">Credits</th>
                      <th className="py-2 pr-4">AI $</th>
                      <th className="py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.map((u) => (
                      <tr key={u.id} className="border-b border-slate-800/60 text-slate-300">
                        <td className="py-2.5 pr-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(u.at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2.5 pr-4">{u.action}</td>
                        <td className="py-2.5 pr-4">
                          <Badge variant="outline">{u.module}</Badge>
                        </td>
                        <td
                          className={`py-2.5 pr-4 font-medium ${
                            u.credits >= 0 ? "text-emerald-400" : "text-rose-300"
                          }`}
                        >
                          {u.credits >= 0 ? "+" : ""}
                          {u.credits}
                        </td>
                        <td className="py-2.5 pr-4 text-xs">${u.costUsd.toFixed(3)}</td>
                        <td className="py-2.5">{u.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly AI cost by module</CardTitle>
              <CardDescription>Simulated USD</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={COST_ANALYTICS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="search" stackId="1" stroke="#0EA5A4" fill="#0EA5A4" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="matching" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="intelligence" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="employer" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost share</CardTitle>
              <CardDescription>Where credits go</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MODULE_COST_SHARE}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {MODULE_COST_SHARE.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!confirmTopUp} onOpenChange={(o) => !o && setConfirmTopUp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm top-up</DialogTitle>
            <DialogDescription>
              Simulated only — no payment will be taken. Add {confirmTopUp?.credits} credits for £
              {confirmTopUp?.price}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setConfirmTopUp(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmTopUp) topUp(confirmTopUp.credits);
                setConfirmTopUp(null);
              }}
            >
              Add credits
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!planModal} onOpenChange={(o) => !o && setPlanModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch to {planModal}?</DialogTitle>
            <DialogDescription>
              Demo plan change only. Credits are not auto-refilled in this simulation (use top-ups).
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setPlanModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (planModal) setPlan(planModal);
                setPlanModal(null);
              }}
            >
              Confirm switch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
