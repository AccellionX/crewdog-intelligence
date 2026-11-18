import type { AgencyListing, EmployerReveal } from "@/lib/types";

export const AGENCY_LISTINGS: AgencyListing[] = [
  {
    id: "ag-001",
    jobTitle: "Drilling Supervisor – Rotational",
    agencyName: "Rigline Recruitment",
    location: "Dammam, Saudi Arabia",
    region: "Saudi Arabia",
    postedAt: "2026-11-12",
    description:
      "Our client, a major NOC in the Kingdom, requires an experienced Drilling Supervisor for a multi-rig land campaign in the Eastern Province. IWCF Level 4 mandatory. 28/28 rotation.",
    clues: ["major NOC", "Eastern Province", "multi-rig land campaign", "28/28"],
  },
  {
    id: "ag-002",
    jobTitle: "Commissioning Engineer – FPSO",
    agencyName: "Air Energi",
    location: "Namibia / Singapore",
    region: "Namibia",
    postedAt: "2026-11-16",
    description:
      "Urgent requirement supporting an FPSO destined for the Orange Basin. Client is a leading lease-and-operate floater contractor. ICAPS / systems completion experience essential.",
    clues: ["Orange Basin", "lease-and-operate floater", "FPSO", "ICAPS"],
  },
  {
    id: "ag-003",
    jobTitle: "Welding Inspector CSWIP 3.1",
    agencyName: "Oil & Gas People",
    location: "Abu Dhabi Offshore",
    region: "UAE",
    postedAt: "2026-11-10",
    description:
      "Pipeline welding inspector for an ADNOC-related subsea construction scope. Working via a Tier-1 SURF contractor currently mobilising spread in the Gulf.",
    clues: ["ADNOC-related", "SURF contractor", "pipeline welding", "Gulf"],
  },
  {
    id: "ag-004",
    jobTitle: "HSE Advisor – Offshore Construction",
    agencyName: "Air Energi",
    location: "Walvis Bay, Namibia",
    region: "Namibia",
    postedAt: "2026-11-15",
    description:
      "HSE Advisor for hook-up and commissioning campaign linked to Venus development logistics. Client is EPCI / floater partner on the project.",
    clues: ["Venus development", "HUC", "floater partner", "Walvis Bay"],
  },
  {
    id: "ag-005",
    jobTitle: "QA/QC Inspector – Facilities",
    agencyName: "Petroplan",
    location: "Dammam, Saudi Arabia",
    region: "Saudi Arabia",
    postedAt: "2026-11-04",
    description:
      "QA/QC Inspector for onshore facilities upgrade. Must know SAES. Client is the Kingdom’s national oil company working through an EPCI JV.",
    clues: ["SAES", "national oil company", "facilities upgrade", "EPCI JV"],
  },
  {
    id: "ag-006",
    jobTitle: "Subsea Interface Engineer",
    agencyName: "NES Fircroft",
    location: "Stavanger, Norway",
    region: "Norway",
    postedAt: "2026-11-01",
    description:
      "Interface engineer for NCS tie-back EPCI. Client recently awarded SURF package by the Norwegian major operator. Stavanger-based with offshore trips.",
    clues: ["NCS tie-back", "SURF package", "Norwegian major", "Stavanger"],
  },
];

export const EMPLOYER_REVEALS: Record<string, EmployerReveal> = {
  "ag-001": {
    listing: AGENCY_LISTINGS[0],
    inferredEmployer: "Saudi Aramco",
    confidence: 0.91,
    evidence: [
      {
        type: "Language",
        label: "NOC language match",
        detail: "“Major NOC in the Kingdom” + Eastern Province strongly indicates Aramco",
        weight: 0.32,
      },
      {
        type: "Contract",
        label: "Active drilling campaign",
        detail: "Jafurah / Eastern Province multi-rig activity correlates with posting timing",
        weight: 0.28,
      },
      {
        type: "Pattern",
        label: "Agency posting pattern",
        detail: "Rigline historically posts Aramco land drilling roles with 28/28 language",
        weight: 0.18,
      },
      {
        type: "Location",
        label: "Dammam mobilisation hub",
        detail: "Dammam is the primary mobilisation point for Eastern Province land campaigns",
        weight: 0.13,
      },
    ],
    alternatives: [
      { name: "Saudi Aramco (JV partner ops)", confidence: 0.06 },
      { name: "Other Saudi NOC affiliate", confidence: 0.03 },
    ],
  },
  "ag-002": {
    listing: AGENCY_LISTINGS[1],
    inferredEmployer: "SBM Offshore",
    confidence: 0.94,
    evidence: [
      {
        type: "Contract",
        label: "FPSO award match",
        detail: "SBM awarded Orange Basin FPSO – matches lease-and-operate wording",
        weight: 0.4,
      },
      {
        type: "Language",
        label: "Unique phrasing",
        detail: "“Lease-and-operate floater contractor” is distinctive to SBM positioning",
        weight: 0.28,
      },
      {
        type: "Project",
        label: "Venus / Orange Basin",
        detail: "Singapore yard + Namibia destination aligns with known SBM build path",
        weight: 0.2,
      },
      {
        type: "Pattern",
        label: "Agency channel",
        detail: "Air Energi frequently staffs SBM commissioning campaigns",
        weight: 0.06,
      },
    ],
    alternatives: [
      { name: "Modelec / yard partner", confidence: 0.04 },
      { name: "TotalEnergies (direct)", confidence: 0.02 },
    ],
  },
  "ag-003": {
    listing: AGENCY_LISTINGS[2],
    inferredEmployer: "Subsea7",
    confidence: 0.86,
    evidence: [
      {
        type: "Language",
        label: "Tier-1 SURF contractor",
        detail: "Wording points to Subsea7 or TechnipFMC; pipeline focus tilts Subsea7",
        weight: 0.3,
      },
      {
        type: "Project",
        label: "ADNOC subsea construction",
        detail: "Subsea7 has active ADNOC pipeline/construction scopes in period",
        weight: 0.28,
      },
      {
        type: "Pattern",
        label: "Duplicate listing signal",
        detail: "Near-identical CSWIP role also posted via NES referencing Subsea7",
        weight: 0.2,
      },
      {
        type: "Location",
        label: "Abu Dhabi offshore spread",
        detail: "Mobilisation language matches Subsea7 Gulf assets",
        weight: 0.08,
      },
    ],
    alternatives: [
      { name: "TechnipFMC", confidence: 0.1 },
      { name: "Saipem", confidence: 0.04 },
    ],
  },
  "ag-004": {
    listing: AGENCY_LISTINGS[3],
    inferredEmployer: "TechnipFMC / SBM campaign partner",
    confidence: 0.82,
    evidence: [
      {
        type: "Project",
        label: "Venus HUC link",
        detail: "Explicit Venus development logistics reference",
        weight: 0.34,
      },
      {
        type: "Contract",
        label: "Floater partner",
        detail: "HSE advisor roles cluster around SBM FPSO + EPCI partners",
        weight: 0.26,
      },
      {
        type: "Location",
        label: "Walvis Bay",
        detail: "Primary Namibian logistics hub for Orange Basin campaigns",
        weight: 0.14,
      },
      {
        type: "Pattern",
        label: "Air Energi Namibia cluster",
        detail: "Same agency posting multiple Venus-linked roles this week",
        weight: 0.08,
      },
    ],
    alternatives: [
      { name: "SBM Offshore (direct)", confidence: 0.12 },
      { name: "TotalEnergies HSE", confidence: 0.06 },
    ],
  },
  "ag-005": {
    listing: AGENCY_LISTINGS[4],
    inferredEmployer: "Saudi Aramco",
    confidence: 0.93,
    evidence: [
      {
        type: "Language",
        label: "SAES requirement",
        detail: "SAES is Aramco engineering standards – near-definitive signal",
        weight: 0.42,
      },
      {
        type: "Contract",
        label: "Facilities upgrade award",
        detail: "Eastern Province facilities upgrade preferred bidder activity",
        weight: 0.28,
      },
      {
        type: "Language",
        label: "NOC wording",
        detail: "“Kingdom’s national oil company” explicitly maps to Aramco",
        weight: 0.18,
      },
      {
        type: "Pattern",
        label: "Petroplan Aramco channel",
        detail: "High historical precision for Aramco QA/QC via Petroplan",
        weight: 0.05,
      },
    ],
    alternatives: [
      { name: "Saipem JV (hiring on behalf)", confidence: 0.05 },
      { name: "Other Saudi operator", confidence: 0.02 },
    ],
  },
  "ag-006": {
    listing: AGENCY_LISTINGS[5],
    inferredEmployer: "TechnipFMC",
    confidence: 0.9,
    evidence: [
      {
        type: "Contract",
        label: "SURF award",
        detail: "TechnipFMC awarded Equinor NCS tie-back EPCI – matches description",
        weight: 0.38,
      },
      {
        type: "Language",
        label: "Norwegian major operator",
        detail: "Equinor is the clear referent for “Norwegian major”",
        weight: 0.24,
      },
      {
        type: "Location",
        label: "Stavanger base",
        detail: "TechnipFMC NCS project engineering hub",
        weight: 0.16,
      },
      {
        type: "Pattern",
        label: "NES Fircroft channel",
        detail: "NES frequently staffs TechnipFMC Stavanger interfaces",
        weight: 0.12,
      },
    ],
    alternatives: [
      { name: "Equinor (direct staff)", confidence: 0.07 },
      { name: "Aker Solutions", confidence: 0.03 },
    ],
  },
};
