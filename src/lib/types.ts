export type Region =
  | "Aberdeen"
  | "North Sea"
  | "Norway"
  | "Saudi Arabia"
  | "Namibia"
  | "UAE"
  | "Qatar";

export type JobSource = "Direct" | "Agency" | "Unknown";
export type EmploymentType = "Contract" | "Staff" | "Day Rate";
export type WorkPattern = "Offshore" | "Onshore" | "Hybrid" | "Rotational";

export interface Skill {
  name: string;
  category: "Technical" | "Ticket" | "Soft" | "Domain" | "Transferable";
  level?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  agency?: string;
  location: string;
  region: Region;
  source: JobSource;
  type: EmploymentType;
  pattern: WorkPattern;
  rate?: string;
  postedAt: string;
  description: string;
  skills: string[];
  transferableSkills: string[];
  citations: Citation[];
  duplicateGroup?: string;
  isDuplicate?: boolean;
  keywords: string[];
}

export interface Citation {
  id: string;
  source: string;
  url: string;
  snippet: string;
  confidence: number;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  region: Region;
  yearsExperience: number;
  summary: string;
  skills: Skill[];
  tickets: string[];
  experience: ExperienceItem[];
  availability: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface MatchResult {
  job: Job;
  score: number;
  keywordScore: number;
  semanticScore: number;
  transferableScore: number;
  matchedSkills: string[];
  transferableMatches: { from: string; to: string; reason: string }[];
  gaps: { skill: string; severity: "low" | "medium" | "high"; recommendation: string }[];
  recommendation: string;
}

export interface ContractAward {
  id: string;
  title: string;
  operator: string;
  contractor: string;
  value: string;
  region: Region;
  location: string;
  awardedAt: string;
  disciplines: string[];
  inferredDemand: DemandSignal[];
  status: "Awarded" | "Preferred Bidder" | "Tender";
}

export interface DemandSignal {
  role: string;
  urgency: "Immediate" | "3 months" | "6 months";
  estimatedHeadcount: number;
  confidence: number;
}

export interface Project {
  id: string;
  name: string;
  operator: string;
  region: Region;
  location: string;
  phase: "Exploration" | "Development" | "Production" | "Decommissioning";
  startDate: string;
  disciplines: string[];
  hiringOutlook: string;
  confidence: number;
}

export interface CompanyIntel {
  id: string;
  name: string;
  type: "Operator" | "EPCI" | "Service" | "Agency";
  region: Region;
  hq: string;
  activeProjects: number;
  openRoles: number;
  hiringTrend: "Rising" | "Stable" | "Cooling";
  specialties: string[];
  recentAwards: string[];
}

export interface AgencyListing {
  id: string;
  jobTitle: string;
  agencyName: string;
  location: string;
  region: Region;
  postedAt: string;
  description: string;
  clues: string[];
}

export interface EmployerReveal {
  listing: AgencyListing;
  inferredEmployer: string;
  confidence: number;
  evidence: EvidenceItem[];
  alternatives: { name: string; confidence: number }[];
}

export interface EvidenceItem {
  type: "Contract" | "Project" | "Pattern" | "Language" | "Location";
  label: string;
  detail: string;
  weight: number;
}

export interface AgentStep {
  id: string;
  agent: string;
  status: "pending" | "running" | "done" | "fallback";
  latencyMs: number;
  costUsd: number;
  detail: string;
  sources?: string[];
}

export interface IntelligenceQuery {
  id: string;
  question: string;
  answer: string;
  steps: AgentStep[];
  citations: Citation[];
  totalLatencyMs: number;
  totalCostUsd: number;
  mode: "database-first" | "web-fallback" | "hybrid";
}

export interface CreditTxn {
  id: string;
  at: string;
  action: string;
  module: string;
  credits: number;
  costUsd: number;
  balance: number;
}

export type SearchMode = "keyword" | "hybrid";

export interface DemoState {
  credits: number;
  plan: "Explorer" | "Professional" | "Enterprise";
  selectedCandidateId: string | null;
  selectedJobId: string | null;
  lastSearchQuery: string;
  journeyStep: number;
  usage: CreditTxn[];
}
