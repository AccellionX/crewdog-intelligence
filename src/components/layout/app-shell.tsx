"use client";

import { DemoProvider } from "@/hooks/use-demo-state";
import { Sidebar } from "@/components/layout/sidebar";
import { JourneyBar } from "@/components/layout/journey-bar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <TooltipProvider delayDuration={200}>
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
          <Sidebar />
          <main className="flex-1 pt-16 lg:pt-0">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <JourneyBar />
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </DemoProvider>
  );
}
