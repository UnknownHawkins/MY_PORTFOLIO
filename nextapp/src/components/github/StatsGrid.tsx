"use client";

import React from "react";
import { BookOpen, Star, GitFork, Users, Sparkles } from "lucide-react";
import type { GitHubStats } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface StatsGridProps {
  stats: GitHubStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: "Public Repositories",
      value: stats.totalRepos ?? stats.user.publicRepos,
      icon: <BookOpen className="h-5 w-5 text-blue-400" />,
      color: "group-hover:border-blue-500/30",
      glow: "rgba(59, 130, 246, 0.03)",
    },
    {
      label: "Total Star Count",
      value: stats.totalStars,
      icon: <Star className="h-5 w-5 text-amber-400 animate-pulse" />,
      color: "group-hover:border-amber-500/30",
      glow: "rgba(245, 158, 11, 0.03)",
    },
    {
      label: "Total Repo Forks",
      value: stats.totalForks,
      icon: <GitFork className="h-5 w-5 text-purple-400" />,
      color: "group-hover:border-purple-500/30",
      glow: "rgba(168, 85, 247, 0.03)",
    },
    {
      label: "Followers Count",
      value: stats.user.followers,
      icon: <Users className="h-5 w-5 text-cyan-400" />,
      color: "group-hover:border-cyan-500/30",
      glow: "rgba(6, 182, 212, 0.03)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`bg-card/40 dark:bg-slate-950/40 border-border dark:border-slate-900 transition-all duration-300 group overflow-hidden ${item.color} relative`}
        >
          {/* Subtle glow background */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{
              background: `radial-gradient(circle at center, ${item.glow} 0%, transparent 70%)`,
            }}
          />

          <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest block">
                {item.label}
              </span>
              <span className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono block">
                {formatNumber(item.value)}
              </span>
            </div>
            
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              {item.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
