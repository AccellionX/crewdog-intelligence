import { CANDIDATES, TRANSFERABLE_MAP } from "@/lib/data/candidates";
import { JOBS } from "@/lib/data/jobs";
import type { Candidate, MatchResult } from "@/lib/types";
import { hashString, seededRandom } from "@/lib/utils";

export function getCandidate(id: string) {
  return CANDIDATES.find((c) => c.id === id) ?? CANDIDATES[0];
}

export function matchCandidateToJobs(candidateId: string): MatchResult[] {
  const candidate = getCandidate(candidateId);
  const rand = seededRandom(hashString(candidateId) || 42);
  const candSkills = candidate.skills.map((s) => s.name.toLowerCase());
  const candTickets = candidate.tickets.map((t) => t.toLowerCase());

  const results: MatchResult[] = JOBS.filter((j) => !j.isDuplicate).map((job) => {
    const jobSkills = [...job.skills, ...job.transferableSkills].map((s) => s.toLowerCase());

    const matchedSkills: string[] = [];
    let keywordScore = 0;
    for (const js of job.skills) {
      const hit = candSkills.some(
        (cs) => cs.includes(js.toLowerCase()) || js.toLowerCase().includes(cs)
      );
      const ticketHit = candTickets.some(
        (t) => t.includes(js.toLowerCase()) || js.toLowerCase().includes(t)
      );
      if (hit || ticketHit) {
        matchedSkills.push(js);
        keywordScore += 12;
      }
    }

    const transferableMatches: MatchResult["transferableMatches"] = [];
    for (const skill of candidate.skills.filter((s) => s.category === "Transferable" || s.category === "Soft")) {
      const maps = TRANSFERABLE_MAP[skill.name] ?? [];
      for (const m of maps) {
        if (
          jobSkills.some((js) => js.includes(m.to.toLowerCase()) || m.to.toLowerCase().includes(js)) ||
          job.description.toLowerCase().includes(m.to.toLowerCase())
        ) {
          transferableMatches.push({ from: skill.name, to: m.to, reason: m.reason });
        }
      }
      // Also match transferable skill names directly onto job transferable list
      if (job.transferableSkills.some((t) => t.toLowerCase() === skill.name.toLowerCase())) {
        transferableMatches.push({
          from: skill.name,
          to: skill.name,
          reason: "Direct transferable skill overlap with role requirements",
        });
      }
    }

    // Region affinity
    let semanticScore = keywordScore * 0.5 + transferableMatches.length * 8;
    if (candidate.region === job.region) semanticScore += 12;
    if (
      (candidate.region === "Aberdeen" && job.region === "North Sea") ||
      (candidate.region === "North Sea" && job.region === "Aberdeen")
    ) {
      semanticScore += 8;
    }

    // Title similarity
    const titleTokens = job.title.toLowerCase().split(/\s+/);
    const candTitle = candidate.title.toLowerCase();
    if (titleTokens.some((t) => t.length > 3 && candTitle.includes(t))) semanticScore += 15;

    const transferableScore = Math.min(100, transferableMatches.length * 18 + (rand() * 8));
    const score = Math.min(
      98,
      Math.round(keywordScore * 0.35 + semanticScore * 0.4 + transferableScore * 0.25 + rand() * 5)
    );

    const gaps: MatchResult["gaps"] = [];
    for (const js of job.skills.slice(0, 6)) {
      const covered =
        matchedSkills.includes(js) ||
        transferableMatches.some((t) => t.to.toLowerCase() === js.toLowerCase());
      if (!covered) {
        const severity =
          js.includes("IWCF") || js.includes("CSWIP") || js.includes("API") || js.includes("NEBOSH")
            ? "high"
            : js.length > 12
              ? "medium"
              : "low";
        gaps.push({
          skill: js,
          severity,
          recommendation:
            severity === "high"
              ? `Prioritise obtaining or evidencing ${js} — often a gate for shortlist`
              : `Highlight adjacent experience or plan short upskilling on ${js}`,
        });
      }
    }

    const recommendation =
      score >= 80
        ? `Strong fit — emphasise ${matchedSkills.slice(0, 2).join(" & ") || "transferable strengths"} and regional experience.`
        : score >= 60
          ? `Viable match via transferable skills. Close ${gaps.filter((g) => g.severity !== "low").length} key gaps before applying.`
          : `Partial fit. Use hybrid search to find roles aligned to ${candidate.skills.filter((s) => s.category === "Transferable")[0]?.name ?? "core strengths"}.`;

    return {
      job,
      score,
      keywordScore: Math.min(100, Math.round(keywordScore)),
      semanticScore: Math.min(100, Math.round(semanticScore)),
      transferableScore: Math.round(transferableScore),
      matchedSkills,
      transferableMatches: transferableMatches.slice(0, 5),
      gaps: gaps.slice(0, 4),
      recommendation,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

export function extractSkillsNarrative(candidate: Candidate) {
  const technical = candidate.skills.filter((s) => s.category === "Technical" || s.category === "Ticket");
  const transferable = candidate.skills.filter((s) => s.category === "Transferable" || s.category === "Soft");
  return {
    headline: `Extracted ${candidate.skills.length} skills across ${new Set(candidate.skills.map((s) => s.category)).size} categories`,
    technical,
    transferable,
    tickets: candidate.tickets,
    insight: `${candidate.name}'s transferable stack (${transferable
      .slice(0, 3)
      .map((s) => s.name)
      .join(", ")}) unlocks roles beyond literal keyword matches — the core CrewDog differentiator.`,
  };
}
