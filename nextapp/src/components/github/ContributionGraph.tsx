"use client";

import React from "react";
import type { ContributionGraph as GraphType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContributionGraphProps {
  graph: GraphType;
}

export default function ContributionGraph({ graph }: ContributionGraphProps) {
  const levelColors = {
    0: "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-950",
    1: "bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300",
    2: "bg-blue-300 dark:bg-blue-800 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-200",
    3: "bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500 text-white dark:text-blue-100",
    4: "bg-cyan-500 dark:bg-cyan-400 border-cyan-600 dark:border-cyan-300 text-white dark:text-slate-900",
  };

  // If no data, render a dummy grid representing last 12 weeks of no activity
  const weeks = graph?.weeks && graph.weeks.length > 0 ? graph.weeks : [];

  return (
    <Card className="bg-card/40 dark:bg-slate-950/40 border-border dark:border-slate-900 overflow-hidden relative w-full">
      <CardHeader className="pb-3 pt-6 px-6 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
          GitHub Contributions
        </CardTitle>
        <span className="text-xs font-bold text-slate-400 font-mono">
          {graph?.totalContributions || 0} contributions in the last year
        </span>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        {weeks.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            Configure GITHUB_TOKEN to activate contribution calendar heatmap.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scrollable Container */}
            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex gap-[3px] min-w-[700px] select-none">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.days.map((day, dIdx) => (
                      <div
                        key={day.date || dIdx}
                        className={`w-2.5 h-2.5 rounded-[2px] border ${levelColors[day.level]} transition-colors hover:scale-115`}
                        title={`${day.count} contributions on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend row */}
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-2">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] border bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-950" />
              <div className="w-2.5 h-2.5 rounded-[2px] border bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-900" />
              <div className="w-2.5 h-2.5 rounded-[2px] border bg-blue-300 dark:bg-blue-800 border-blue-400 dark:border-blue-700" />
              <div className="w-2.5 h-2.5 rounded-[2px] border bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500" />
              <div className="w-2.5 h-2.5 rounded-[2px] border bg-cyan-500 dark:bg-cyan-400 border-cyan-600 dark:border-cyan-300" />
              <span>More</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
