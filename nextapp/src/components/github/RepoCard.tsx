"use client";

import React from "react";
import { Star, GitFork, BookMarked, ExternalLink } from "lucide-react";
import type { GitHubRepo } from "@/types";
import { getLanguageColor } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RepoCardProps {
  repo: GitHubRepo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card className="bg-card/40 dark:bg-slate-950/40 border-border dark:border-slate-900 hover:border-border/80 dark:hover:border-slate-800/80 hover:bg-card/60 dark:hover:bg-slate-900/40 backdrop-blur-sm transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Top hover light strip */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-5 space-y-4">
        {/* Title / Name */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookMarked className="h-4.5 w-4.5 text-blue-400 shrink-0" />
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 tracking-wide text-sm sm:text-base transition-colors line-clamp-1"
            >
              {repo.name}
            </a>
          </div>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-10">
          {repo.description || "No description provided."}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge
                key={topic}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-500 text-[9px] hover:bg-slate-200 dark:hover:bg-slate-900 rounded-md font-semibold tracking-wider"
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer Metrics */}
      <CardFooter className="px-5 py-3 border-t border-slate-200 dark:border-slate-900/60 bg-slate-50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-500">
        {/* Language Dot */}
        {repo.language ? (
          <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: getLanguageColor(repo.language),
                boxShadow: `0 0 6px ${getLanguageColor(repo.language)}40`,
              }}
            />
            {repo.language}
          </div>
        ) : (
          <div className="text-slate-600">Unknown</div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 font-mono font-bold">
          <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
            <Star className="h-3.5 w-3.5" />
            {repo.stargazersCount}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <GitFork className="h-3.5 w-3.5" />
            {repo.forksCount}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
