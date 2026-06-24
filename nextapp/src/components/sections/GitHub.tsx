"use client";

import React from "react";
import { Github, ArrowUpRight } from "lucide-react";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import { OWNER } from "@/lib/constants";

import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StatsGrid from "@/components/github/StatsGrid";
import LanguageChart from "@/components/github/LanguageChart";
import ContributionGraph from "@/components/github/ContributionGraph";
import RepoCard from "@/components/github/RepoCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function GitHub() {
  const { data: stats, isLoading, isError } = useGitHubStats();

  return (
    <section id="github" className="py-24 bg-background dark:bg-[#030712] relative border-t border-border dark:border-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle title="Open Source Contributions" subtitle="GitHub Activity" />

        {isLoading ? (
          <div className="space-y-6">
            {/* Stats skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 bg-muted/60 dark:bg-slate-900 rounded-xl" />
              ))}
            </div>
            {/* Main content grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 bg-muted/60 dark:bg-slate-900 rounded-xl lg:col-span-2" />
              <Skeleton className="h-64 bg-muted/60 dark:bg-slate-900 rounded-xl" />
            </div>
          </div>
        ) : isError || !stats ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-200 dark:border-slate-900 text-slate-500 dark:text-slate-400">
            <p className="mb-4">Failed to fetch live GitHub stats. Displaying offline records.</p>
            <a
              href={`https://github.com/${OWNER.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center w-fit mx-auto border-0"
              )}
            >
              View GitHub Profile
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Stats grid */}
            <ScrollReveal direction="up" delay={0.1}>
              <StatsGrid stats={stats} />
            </ScrollReveal>

            {/* Heatmap & language charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Heatmap */}
              <ScrollReveal direction="up" delay={0.15} className="lg:col-span-8 flex">
                <ContributionGraph graph={stats.contributionsLastYear ? { totalContributions: stats.contributionsLastYear, weeks: [] } : { totalContributions: 0, weeks: [] }} />
              </ScrollReveal>

              {/* Language distribution donut list */}
              <ScrollReveal direction="up" delay={0.2} className="lg:col-span-4 flex">
                <LanguageChart languages={stats.topLanguages} />
              </ScrollReveal>
              
            </div>

            {/* Pinned Repository List */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-foreground tracking-wide">
                  Top Repositories
                </h3>
                <a
                  href={`https://github.com/${OWNER.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-1 cursor-pointer font-semibold"
                  )}
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.pinnedRepos && stats.pinnedRepos.length > 0 ? (
                  stats.pinnedRepos.map((repo, idx) => (
                    <ScrollReveal
                      key={repo.name || idx}
                      direction="up"
                      delay={idx * 0.05}
                    >
                      <RepoCard repo={repo} />
                    </ScrollReveal>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 text-slate-500 text-sm">
                    No repositories found.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
