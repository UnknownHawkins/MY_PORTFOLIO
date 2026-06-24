"use client";

import React from "react";
import { getLanguageColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LanguageChartProps {
  languages: Record<string, number>;
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  // Calculate total counts
  const entries = Object.entries(languages);
  const totalCount = entries.reduce((sum, [_, count]) => sum + count, 0);

  if (entries.length === 0) {
    return null;
  }

  // Map to list with percentages and sort
  const languagesList = entries
    .map(([name, count]) => {
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return {
        name,
        count,
        percentage,
        color: getLanguageColor(name),
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 languages

  return (
    <Card className="bg-card/40 dark:bg-slate-950/40 border-border dark:border-slate-900 overflow-hidden relative h-full">
      <CardHeader className="pb-3 pt-6 px-6">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Core Languages
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 space-y-4">
        {languagesList.map((lang) => (
          <div key={lang.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: lang.color,
                    boxShadow: `0 0 6px ${lang.color}30`,
                  }}
                />
                <span className="text-slate-900 dark:text-white">{lang.name}</span>
              </div>
              <span className="text-slate-400 font-mono font-bold">{lang.percentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-900/60">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
