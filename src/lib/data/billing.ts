import type { CreditTxn } from "@/lib/types";

export const PLANS = [
  {
    id: "Explorer" as const,
    price: 49,
    credits: 500,
    features: [
      "Hybrid search (limited)",
      "5 CV matches / month",
      "Basic hiring signals",
      "Email support",
    ],
    highlight: false,
  },
  {
    id: "Professional" as const,
    price: 199,
    credits: 2500,
    features: [
      "Unlimited hybrid search",
      "Transferable skills matching",
      "Employer discovery",
      "Hiring intelligence",
      "Priority AI answers",
    ],
    highlight: true,
  },
  {
    id: "Enterprise" as const,
    price: 799,
    credits: 12000,
    features: [
      "Everything in Professional",
      "Multi-seat workspaces",
      "Custom RAG corpora",
      "API access",
      "Dedicated success manager",
    ],
    highlight: false,
  },
];

export const TOP_UPS = [
  { id: "t1", credits: 250, price: 29, label: "Starter boost" },
  { id: "t2", credits: 1000, price: 99, label: "Campaign pack" },
  { id: "t3", credits: 5000, price: 399, label: "Basin intelligence" },
];

export const CREDIT_COSTS: Record<string, number> = {
  "Keyword search": 1,
  "Hybrid search": 3,
  "CV match run": 8,
  "Skill extraction": 2,
  "Hiring signal scan": 5,
  "Employer reveal": 12,
  "AI intelligence query": 15,
  "Agent web fallback": 6,
  "Rerank pass": 2,
};

export const INITIAL_USAGE: CreditTxn[] = [
  {
    id: "tx-001",
    at: "2026-11-18T08:12:00Z",
    action: "Hybrid search",
    module: "AI Search",
    credits: -3,
    costUsd: 0.018,
    balance: 2147,
  },
  {
    id: "tx-002",
    at: "2026-11-18T08:18:00Z",
    action: "CV match run",
    module: "CV Matching",
    credits: -8,
    costUsd: 0.042,
    balance: 2139,
  },
  {
    id: "tx-003",
    at: "2026-11-17T16:40:00Z",
    action: "Employer reveal",
    module: "Employer Discovery",
    credits: -12,
    costUsd: 0.061,
    balance: 2150,
  },
  {
    id: "tx-004",
    at: "2026-11-17T14:05:00Z",
    action: "AI intelligence query",
    module: "AI Intelligence",
    credits: -15,
    costUsd: 0.088,
    balance: 2162,
  },
  {
    id: "tx-005",
    at: "2026-11-17T11:22:00Z",
    action: "Hiring signal scan",
    module: "Hiring Intelligence",
    credits: -5,
    costUsd: 0.021,
    balance: 2177,
  },
  {
    id: "tx-006",
    at: "2026-11-16T09:00:00Z",
    action: "Professional plan renewal",
    module: "Billing",
    credits: 2500,
    costUsd: 0,
    balance: 2182,
  },
];

export const COST_ANALYTICS = [
  { day: "Mon", search: 0.12, matching: 0.18, intelligence: 0.22, employer: 0.08 },
  { day: "Tue", search: 0.15, matching: 0.21, intelligence: 0.19, employer: 0.11 },
  { day: "Wed", search: 0.18, matching: 0.16, intelligence: 0.28, employer: 0.09 },
  { day: "Thu", search: 0.14, matching: 0.24, intelligence: 0.25, employer: 0.14 },
  { day: "Fri", search: 0.21, matching: 0.19, intelligence: 0.31, employer: 0.12 },
  { day: "Sat", search: 0.08, matching: 0.06, intelligence: 0.1, employer: 0.04 },
  { day: "Sun", search: 0.06, matching: 0.05, intelligence: 0.08, employer: 0.03 },
];

export const MODULE_COST_SHARE = [
  { name: "AI Search", value: 22, fill: "#0EA5A4" },
  { name: "CV Matching", value: 28, fill: "#F59E0B" },
  { name: "AI Intelligence", value: 32, fill: "#3B82F6" },
  { name: "Employer Discovery", value: 12, fill: "#8B5CF6" },
  { name: "Hiring Intel", value: 6, fill: "#64748B" },
];
