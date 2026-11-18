import type { Candidate } from "@/lib/types";

export const CANDIDATES: Candidate[] = [
  {
    id: "cv-001",
    name: "James MacLeod",
    title: "Senior Drilling Engineer",
    location: "Aberdeen, UK",
    region: "Aberdeen",
    yearsExperience: 14,
    availability: "Immediate – 4 weeks notice",
    summary:
      "North Sea drilling engineer with HPHT and extended-reach experience across Harbour, bp and independent operators. Strong well design, DWOP facilitation and operational support background. Seeking staff or long-term contract in Aberdeen or rotational Middle East.",
    skills: [
      { name: "Well Design", category: "Technical", level: 5 },
      { name: "HPHT", category: "Technical", level: 5 },
      { name: "Well Integrity", category: "Technical", level: 4 },
      { name: "DWOP", category: "Domain", level: 5 },
      { name: "Well Control", category: "Technical", level: 4 },
      { name: "AFE Preparation", category: "Domain", level: 4 },
      { name: "Risk Assessment", category: "Transferable", level: 5 },
      { name: "Stakeholder Management", category: "Soft", level: 4 },
      { name: "Mentoring", category: "Soft", level: 4 },
      { name: "Performance Optimisation", category: "Transferable", level: 4 },
    ],
    tickets: ["IWCF Level 4", "BOSIET", "MIST", "OGUK Medical"],
    experience: [
      {
        role: "Senior Drilling Engineer",
        company: "Independent Operator",
        location: "Aberdeen",
        period: "2021 – Present",
        highlights: [
          "Delivered 8-well HPHT campaign with zero well control incidents",
          "Reduced AFE variance to <6% through real-time performance tracking",
        ],
      },
      {
        role: "Drilling Engineer",
        company: "bp",
        location: "Aberdeen / Offshore",
        period: "2016 – 2021",
        highlights: [
          "Well design and operations support for CNS assets",
          "Led DWOP workshops and lessons-learned programmes",
        ],
      },
    ],
  },
  {
    id: "cv-002",
    name: "Sara Al-Harbi",
    title: "QA/QC & Welding Inspector",
    location: "Dammam, Saudi Arabia",
    region: "Saudi Arabia",
    yearsExperience: 11,
    availability: "2 weeks notice",
    summary:
      "CSWIP 3.1 and API 510 inspector with extensive Aramco project exposure. Transitioning toward broader quality leadership roles. Experience spans pipelines, pressure vessels and structural fabrication.",
    skills: [
      { name: "CSWIP 3.1", category: "Ticket", level: 5 },
      { name: "API 510", category: "Ticket", level: 4 },
      { name: "API 570", category: "Ticket", level: 3 },
      { name: "SAES Standards", category: "Domain", level: 5 },
      { name: "Pipeline Welding", category: "Technical", level: 5 },
      { name: "NCR Management", category: "Domain", level: 4 },
      { name: "Quality Assurance", category: "Transferable", level: 5 },
      { name: "Vendor Surveillance", category: "Transferable", level: 4 },
      { name: "Documentation Control", category: "Transferable", level: 4 },
      { name: "Arabic / English", category: "Soft", level: 5 },
    ],
    tickets: ["CSWIP 3.1", "API 510", "ASNT Level II UT", "NEBOSH IGC"],
    experience: [
      {
        role: "Senior Welding Inspector",
        company: "EPCI Contractor",
        location: "Eastern Province",
        period: "2019 – Present",
        highlights: [
          "Led inspection team on 120km pipeline loop project",
          "Reduced weld repair rate from 4.2% to 1.1%",
        ],
      },
      {
        role: "QA/QC Inspector",
        company: "Fabrication Yard",
        location: "Jubail",
        period: "2015 – 2019",
        highlights: ["Pressure vessel and structural steel inspection for Aramco"],
      },
    ],
  },
  {
    id: "cv-003",
    name: "Ingrid Solberg",
    title: "Subsea / Completions Engineer",
    location: "Stavanger, Norway",
    region: "Norway",
    yearsExperience: 9,
    availability: "Immediate",
    summary:
      "Hybrid subsea and completions background spanning Equinor tie-backs and North Sea well delivery. Strong interface management and systems engineering skills. Open to Norway staff roles or Namibia rotational campaigns.",
    skills: [
      { name: "SURF", category: "Technical", level: 4 },
      { name: "Subsea Tie-backs", category: "Technical", level: 4 },
      { name: "Completions Design", category: "Technical", level: 4 },
      { name: "Interface Management", category: "Domain", level: 5 },
      { name: "Technical Assurance", category: "Domain", level: 4 },
      { name: "Sand Control", category: "Technical", level: 3 },
      { name: "Systems Engineering", category: "Transferable", level: 5 },
      { name: "Vendor Management", category: "Transferable", level: 4 },
      { name: "Risk Management", category: "Transferable", level: 4 },
      { name: "Norwegian / English", category: "Soft", level: 5 },
    ],
    tickets: ["BOSIET", "HUET", "IWCF Level 3"],
    experience: [
      {
        role: "Subsea Project Engineer",
        company: "Equinor (contract)",
        location: "Stavanger",
        period: "2022 – Present",
        highlights: [
          "Interface lead on SURF package for NCS tie-back",
          "Managed 14 vendor interfaces through FAT and installation",
        ],
      },
      {
        role: "Completions Engineer",
        company: "Operator – North Sea",
        location: "Aberdeen / Stavanger",
        period: "2018 – 2022",
        highlights: ["Lower completions design including sand control"],
      },
    ],
  },
  {
    id: "cv-004",
    name: "Thabo Nangolo",
    title: "HSE Advisor / Commissioning Support",
    location: "Walvis Bay, Namibia",
    region: "Namibia",
    yearsExperience: 8,
    availability: "Immediate",
    summary:
      "HSE professional with FPSO and construction experience across West Africa. Recently supporting Orange Basin mobilisation activities. Combines NEBOSH discipline with practical commissioning HSE support.",
    skills: [
      { name: "NEBOSH", category: "Ticket", level: 5 },
      { name: "Permit to Work", category: "Domain", level: 5 },
      { name: "HUC Support", category: "Domain", level: 4 },
      { name: "Incident Investigation", category: "Technical", level: 4 },
      { name: "Behavioural Safety", category: "Transferable", level: 5 },
      { name: "Audit", category: "Transferable", level: 4 },
      { name: "Training Delivery", category: "Soft", level: 4 },
      { name: "Commissioning Awareness", category: "Domain", level: 3 },
      { name: "Stakeholder Engagement", category: "Soft", level: 4 },
    ],
    tickets: ["NEBOSH NGC", "BOSIET", "OGUK Medical", "IOSH Managing Safely"],
    experience: [
      {
        role: "HSE Advisor",
        company: "FPSO Project – West Africa",
        location: "Offshore / Yard",
        period: "2021 – Present",
        highlights: [
          "Supported hook-up and commissioning HSE for FPSO campaign",
          "Delivered PTW coaching reducing permit rejections by 35%",
        ],
      },
      {
        role: "HSE Officer",
        company: "Construction Contractor",
        location: "Namibia / Angola",
        period: "2017 – 2021",
        highlights: ["Site HSE for fabrication and load-out operations"],
      },
    ],
  },
];

export const TRANSFERABLE_MAP: Record<string, { to: string; reason: string }[]> = {
  "Risk Assessment": [
    { to: "Well Integrity", reason: "Structured hazard evaluation transfers to barrier management" },
    { to: "HSE Leadership", reason: "Same methodology applied to operational risk" },
  ],
  "Stakeholder Management": [
    { to: "Interface Management", reason: "Cross-party coordination is core to both" },
    { to: "Vendor Management", reason: "Supplier and internal stakeholder patterns align" },
  ],
  "Quality Assurance": [
    { to: "Technical Assurance", reason: "Verification mindset applies across disciplines" },
    { to: "Documentation Control", reason: "Traceability and audit readiness" },
  ],
  "Systems Engineering": [
    { to: "SURF", reason: "Interface-driven systems thinking maps to subsea packages" },
    { to: "Completions Design", reason: "Holistic well system view" },
  ],
  "Vendor Surveillance": [
    { to: "Vendor Management", reason: "Direct overlap in contractor oversight" },
    { to: "Quality Assurance", reason: "Inspection and acceptance criteria" },
  ],
  "Performance Optimisation": [
    { to: "Drilling Programme", reason: "KPI-driven improvement applies to ROP and NPT" },
    { to: "Cost Control", reason: "Efficiency gains feed AFE performance" },
  ],
  "Behavioural Safety": [
    { to: "HSE Leadership", reason: "Culture and coaching underpin HSE advisor roles" },
    { to: "Crew Leadership", reason: "Influence without authority transfers offshore" },
  ],
  "Fault Finding": [
    { to: "Troubleshooting", reason: "Diagnostic approach is discipline-agnostic" },
    { to: "Commissioning", reason: "Punch and system fault resolution" },
  ],
  Mentoring: [
    { to: "Training Delivery", reason: "Knowledge transfer skillset" },
    { to: "Crew Leadership", reason: "Developing others under operational pressure" },
  ],
  "Project Planning": [
    { to: "Drilling Programme", reason: "Sequence, dependency and contingency planning" },
    { to: "Project Management", reason: "Same planning primitives" },
  ],
};
