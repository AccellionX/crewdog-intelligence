import { JOBS } from "@/lib/data/jobs";
import type { Job, Region, SearchMode } from "@/lib/types";
import { hashString, seededRandom } from "@/lib/utils";

export interface SearchFilters {
  regions: Region[];
  sources: string[];
  types: string[];
  patterns: string[];
  hideDuplicates: boolean;
  minRelevance: number;
}

export interface RankedJob extends Job {
  relevance: number;
  keywordHit: number;
  semanticHit: number;
  matchedTerms: string[];
  rankReason: string;
}

const SEMANTIC_EXPANSIONS: Record<string, string[]> = {
  drilling: ["well design", "hpht", "well control", "iwcf", "afe", "dwop", "completions"],
  welding: ["cswip", "pipeline", "ndt", "qa/qc", "api 1104", "fabrication"],
  subsea: ["surf", "tie-back", "manifolds", "flow assurance", "fpso", "umbilical"],
  hse: ["nebosh", "permit to work", "incident", "bosiet", "safety"],
  namibia: ["orange basin", "venus", "walvis", "fpso", "emerging basin"],
  aberdeen: ["north sea", "ukcs", "cns", "harbour", "offshore"],
  saudi: ["aramco", "dammam", "saes", "eastern province", "noc"],
  norway: ["ncs", "stavanger", "equinor", "bergen", "barents"],
  commissioning: ["rfsu", "icaps", "systems completion", "punch", "start-up"],
  reservoir: ["eclipse", "petrel", "reserves", "decline", "simulation"],
};

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9+/]+/)
    .filter((t) => t.length > 1);
}

function expandQuery(tokens: string[]) {
  const expanded = new Set(tokens);
  for (const t of tokens) {
    for (const [key, vals] of Object.entries(SEMANTIC_EXPANSIONS)) {
      if (t.includes(key) || key.includes(t)) {
        vals.forEach((v) => expanded.add(v));
        expanded.add(key);
      }
      if (vals.some((v) => v.includes(t) || t.includes(v.split(" ")[0]))) {
        expanded.add(key);
        vals.forEach((v) => expanded.add(v));
      }
    }
  }
  return [...expanded];
}

export function searchJobs(
  query: string,
  mode: SearchMode,
  filters: SearchFilters
): RankedJob[] {
  const tokens = tokenize(query || "drilling aberdeen");
  const expanded = mode === "hybrid" ? expandQuery(tokens) : tokens;
  const rand = seededRandom(hashString(query + mode) || 1);

  let results: RankedJob[] = JOBS.map((job) => {
    const haystack = [
      job.title,
      job.company,
      job.location,
      job.description,
      ...job.skills,
      ...job.transferableSkills,
      ...job.keywords,
    ]
      .join(" ")
      .toLowerCase();

    let keywordHit = 0;
    const matchedTerms: string[] = [];
    for (const t of tokens) {
      if (haystack.includes(t)) {
        keywordHit += 1;
        matchedTerms.push(t);
      }
    }

    let semanticHit = keywordHit;
    if (mode === "hybrid") {
      for (const t of expanded) {
        if (!tokens.includes(t) && haystack.includes(t)) {
          semanticHit += 0.65;
          matchedTerms.push(`~${t}`);
        }
      }
      // Transferable skills boost in hybrid
      for (const s of job.transferableSkills) {
        if (expanded.some((t) => s.toLowerCase().includes(t) || t.includes(s.toLowerCase().split(" ")[0]))) {
          semanticHit += 0.4;
        }
      }
    }

    const base = mode === "keyword" ? keywordHit : semanticHit * 0.7 + keywordHit * 0.3;
    const noise = rand() * 0.15;
    const titleBoost = tokens.some((t) => job.title.toLowerCase().includes(t)) ? 1.2 : 0;
    const relevance = Math.min(99, Math.round((base * 18 + titleBoost * 10 + noise * 10 + 20) * 10) / 10);

    const rankReason =
      mode === "keyword"
        ? keywordHit > 0
          ? `Matched ${keywordHit} keyword${keywordHit === 1 ? "" : "s"} in title/body`
          : "Weak keyword overlap — try hybrid mode"
        : `Hybrid: ${keywordHit} keywords + semantic links across skills & transferable signals`;

    return {
      ...job,
      relevance,
      keywordHit,
      semanticHit: Math.round(semanticHit * 10) / 10,
      matchedTerms: [...new Set(matchedTerms)].slice(0, 8),
      rankReason,
    };
  });

  results = results.filter((j) => {
    if (filters.regions.length && !filters.regions.includes(j.region)) return false;
    if (filters.sources.length && !filters.sources.includes(j.source)) return false;
    if (filters.types.length && !filters.types.includes(j.type)) return false;
    if (filters.patterns.length && !filters.patterns.includes(j.pattern)) return false;
    if (filters.hideDuplicates && j.isDuplicate) return false;
    if (j.relevance < filters.minRelevance) return false;
    return true;
  });

  results.sort((a, b) => b.relevance - a.relevance);
  return results;
}

export const DEFAULT_FILTERS: SearchFilters = {
  regions: [],
  sources: [],
  types: [],
  patterns: [],
  hideDuplicates: true,
  minRelevance: 0,
};

export const SAMPLE_QUERIES = [
  "drilling engineer Aberdeen HPHT",
  "welding inspector transferable QA skills UAE",
  "FPSO commissioning Namibia",
  "subsea project engineer Stavanger",
  "Aramco QA/QC SAES",
  "decommissioning project manager North Sea",
];
