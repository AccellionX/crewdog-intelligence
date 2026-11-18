"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CREDIT_COSTS, INITIAL_USAGE } from "@/lib/data/billing";
import type { CreditTxn, DemoState } from "@/lib/types";

interface DemoContextValue extends DemoState {
  spend: (action: keyof typeof CREDIT_COSTS, module: string, costUsd?: number) => boolean;
  topUp: (credits: number) => void;
  setPlan: (plan: DemoState["plan"]) => void;
  selectCandidate: (id: string | null) => void;
  selectJob: (id: string | null) => void;
  setLastSearchQuery: (q: string) => void;
  setJourneyStep: (n: number) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const initial: DemoState = {
  credits: 2147,
  plan: "Professional",
  selectedCandidateId: "cv-001",
  selectedJobId: null,
  lastSearchQuery: "drilling engineer Aberdeen HPHT",
  journeyStep: 0,
  usage: INITIAL_USAGE,
};

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initial);

  const spend = useCallback((action: keyof typeof CREDIT_COSTS, module: string, costUsd = 0.02) => {
    const amount = CREDIT_COSTS[action] ?? 1;
    let ok = true;
    setState((prev) => {
      if (prev.credits < amount) {
        ok = false;
        return prev;
      }
      const txn: CreditTxn = {
        id: `tx-${Date.now()}`,
        at: new Date().toISOString(),
        action,
        module,
        credits: -amount,
        costUsd,
        balance: prev.credits - amount,
      };
      return { ...prev, credits: prev.credits - amount, usage: [txn, ...prev.usage].slice(0, 40) };
    });
    return ok;
  }, []);

  const topUp = useCallback((credits: number) => {
    setState((prev) => {
      const txn: CreditTxn = {
        id: `tx-${Date.now()}`,
        at: new Date().toISOString(),
        action: `Top-up +${credits}`,
        module: "Billing",
        credits,
        costUsd: 0,
        balance: prev.credits + credits,
      };
      return { ...prev, credits: prev.credits + credits, usage: [txn, ...prev.usage] };
    });
  }, []);

  const setPlan = useCallback((plan: DemoState["plan"]) => {
    setState((prev) => ({ ...prev, plan }));
  }, []);

  const selectCandidate = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedCandidateId: id }));
  }, []);

  const selectJob = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedJobId: id }));
  }, []);

  const setLastSearchQuery = useCallback((q: string) => {
    setState((prev) => ({ ...prev, lastSearchQuery: q }));
  }, []);

  const setJourneyStep = useCallback((n: number) => {
    setState((prev) => ({ ...prev, journeyStep: n }));
  }, []);

  const resetDemo = useCallback(() => setState(initial), []);

  const value = useMemo(
    () => ({
      ...state,
      spend,
      topUp,
      setPlan,
      selectCandidate,
      selectJob,
      setLastSearchQuery,
      setJourneyStep,
      resetDemo,
    }),
    [state, spend, topUp, setPlan, selectCandidate, selectJob, setLastSearchQuery, setJourneyStep, resetDemo]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
