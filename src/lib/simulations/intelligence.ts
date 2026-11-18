import type { AgentStep, Citation, IntelligenceQuery } from "@/lib/types";
import { hashString, seededRandom } from "@/lib/utils";

export const SAMPLE_QUESTIONS = [
  "Which roles will Namibia FPSO awards drive in the next 90 days?",
  "Compare drilling demand in Aberdeen vs Eastern Province Saudi Arabia",
  "Who is likely hiring behind agency welding inspector ads in Abu Dhabi?",
  "What transferable skills help a North Sea drilling engineer move into completions?",
];

const ANSWERS: Record<string, string> = {
  namibia: `Based on database-first retrieval of contract awards and project records, the Orange Basin FPSO award (SBM Offshore) is the primary near-term hiring driver.

**90-day demand (simulated):**
- Commissioning Engineers (≈12) — Immediate, high confidence
- HSE Advisors (≈6) — Immediate, tied to HUC mobilisation
- Instrument Technicians (≈18) — ramping inside 3 months

Venus development FEED also sustains flow assurance and production technology demand. Early opportunities favour candidates with FPSO/ICAPS or West Africa HUC experience, even if prior basin exposure is limited — transferable commissioning and PTW skills rank highly in hybrid matching.`,

  drilling: `Aberdeen / North Sea drilling demand is concentrated in staff wells engineering and campaign support (bp, Harbour), with moderate day-rate offshore supervisor needs.

Eastern Province Saudi Arabia shows higher absolute contractor volume: land multi-rig campaigns and facilities upgrades are pulling Drilling Supervisors, Drilling Engineers, and QA/QC in parallel.

**Simulated signal:**
- Aberdeen: quality over quantity — HPHT and well integrity differentiate
- Saudi: volume + rotational — IWCF and NOC exposure dominate shortlisting

Transferable strengths (risk assessment, performance optimisation, stakeholder management) improve Aberdeen→Saudi mobility more than keyword-identical titles alone.`,

  welding: `Agency listings for CSWIP 3.1 welding inspectors in Abu Dhabi currently cluster around a Tier-1 SURF contractor mobilising ADNOC-related pipeline scope.

**Employer discovery (simulated):** Subsea7 — confidence 86%, with TechnipFMC as runner-up.

Evidence trail combines language cues (“Tier-1 SURF”), duplicate multi-agency postings, and active Gulf construction schedules. Deduplication collapses NES and Oil & Gas People ads into a single hiring need — saving recruiter attention and candidate application spam.`,

  completions: `A North Sea drilling engineer moving into completions should emphasise systems thinking already present in well design: tubulars, well integrity barriers, AFE discipline, and DWOP facilitation.

**Highest-leverage transferable links:**
- Risk Assessment → Well Integrity / sand face risk
- Project Planning → Completions programme sequencing
- Stakeholder Management → Service company interfaces

Gap to close: sand control and intelligent completions tooling. Hybrid matching typically surfaces Completions Engineer roles at 65–80% fit before ticket gaps are addressed — versus <45% on pure keyword search.`,
};

function pickAnswer(question: string) {
  const q = question.toLowerCase();
  if (q.includes("namibia") || q.includes("fpso")) return ANSWERS.namibia;
  if (q.includes("aberdeen") || q.includes("eastern") || q.includes("compare")) return ANSWERS.drilling;
  if (q.includes("welding") || q.includes("abu dhabi") || q.includes("agency")) return ANSWERS.welding;
  if (q.includes("completions") || q.includes("transferable")) return ANSWERS.completions;
  return ANSWERS.namibia;
}

function buildSteps(question: string, needsWeb: boolean): AgentStep[] {
  const rand = seededRandom(hashString(question) || 7);
  const steps: AgentStep[] = [
    {
      id: "s1",
      agent: "Router",
      status: "done",
      latencyMs: 40 + Math.round(rand() * 30),
      costUsd: 0.001,
      detail: "Classified intent: market intelligence · Prefer database-first RAG",
    },
    {
      id: "s2",
      agent: "Retriever (pgvector)",
      status: "done",
      latencyMs: 120 + Math.round(rand() * 80),
      costUsd: 0.004,
      detail: "Embedded query · top-k=12 cosine · filters: region, award_date, discipline",
      sources: ["contracts", "projects", "jobs", "company_intel"],
    },
    {
      id: "s3",
      agent: "Reranker",
      status: "done",
      latencyMs: 90 + Math.round(rand() * 40),
      costUsd: 0.006,
      detail: "Cross-encoder rerank · kept 5 chunks · dropped 2 near-duplicates",
    },
  ];

  if (needsWeb) {
    steps.push({
      id: "s4",
      agent: "Web Fallback",
      status: "fallback",
      latencyMs: 680 + Math.round(rand() * 200),
      costUsd: 0.028,
      detail: "DB coverage gap on latest yard mobilisation · fetched 3 live sources",
      sources: ["trade press", "operator release", "vessel tracker"],
    });
  } else {
    steps.push({
      id: "s4",
      agent: "Web Fallback",
      status: "done",
      latencyMs: 12,
      costUsd: 0,
      detail: "Skipped — database coverage ≥ threshold (0.82)",
    });
  }

  steps.push(
    {
      id: "s5",
      agent: "Answer Generator",
      status: "done",
      latencyMs: 420 + Math.round(rand() * 180),
      costUsd: needsWeb ? 0.032 : 0.022,
      detail: "Grounded synthesis with inline citations · temperature 0.2",
    },
    {
      id: "s6",
      agent: "Validator",
      status: "done",
      latencyMs: 110 + Math.round(rand() * 50),
      costUsd: 0.008,
      detail: "Claim checks passed · no unsupported headcount assertions · tone OK",
    }
  );

  return steps;
}

export function runIntelligenceQuery(question: string): IntelligenceQuery {
  const q = question.trim() || SAMPLE_QUESTIONS[0];
  const needsWeb = /latest|today|live|yard|vessel|who is/i.test(q) || q.toLowerCase().includes("abu dhabi");
  const steps = buildSteps(q, needsWeb);
  const totalLatencyMs = steps.reduce((a, s) => a + s.latencyMs, 0);
  const totalCostUsd = Math.round(steps.reduce((a, s) => a + s.costUsd, 0) * 1000) / 1000;
  const answer = pickAnswer(q);

  const citations: Citation[] = [
    {
      id: "ic1",
      source: "CrewDog Contracts DB",
      url: "#simulated-contracts",
      snippet: "Orange Basin FPSO award · SBM · inferred commissioning demand",
      confidence: 0.93,
    },
    {
      id: "ic2",
      source: "Projects Graph",
      url: "#simulated-projects",
      snippet: "Venus Field Development · phase: Development · hiring outlook accelerating",
      confidence: 0.9,
    },
    {
      id: "ic3",
      source: needsWeb ? "Live web · trade press" : "Jobs index (hybrid)",
      url: "#simulated-web",
      snippet: needsWeb
        ? "Yard mobilisation notes corroborate 90-day commissioning ramp"
        : "Hybrid job clusters corroborate discipline mix",
      confidence: needsWeb ? 0.78 : 0.86,
    },
  ];

  return {
    id: `iq-${hashString(q)}`,
    question: q,
    answer,
    steps,
    citations,
    totalLatencyMs,
    totalCostUsd,
    mode: needsWeb ? "hybrid" : "database-first",
  };
}

export const LATENCY_COMPARISON = [
  { label: "Keyword only", latency: 45, cost: 0.002, quality: 42 },
  { label: "Vector RAG", latency: 280, cost: 0.018, quality: 74 },
  { label: "Hybrid + rerank", latency: 410, cost: 0.028, quality: 88 },
  { label: "Hybrid + web fallback", latency: 980, cost: 0.055, quality: 91 },
];
