"use client";

import React from "react";
import { Briefcase, Calendar, CheckCircle2, Award } from "lucide-react";

import type { Experience } from "@/types";
import { EXPERIENCE } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ExperienceProps {
  initialExperience?: Experience[];
}

export default function Experience({ initialExperience }: ExperienceProps) {
  const experienceData = initialExperience && initialExperience.length > 0 ? initialExperience : EXPERIENCE;

  return (
    <section id="experience" className="py-24 bg-slate-50/50 dark:bg-[#050b18]/60 relative border-t border-slate-200/60 dark:border-slate-900/40">
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle title="Work History" subtitle="Experience" />

        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-8 md:pl-10 space-y-12">
          {experienceData.map((exp, index) => {
            const formattedStart = formatDate(exp.startDate);
            const formattedEnd = exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : "";

            return (
              <ScrollReveal
                key={exp.id}
                direction="left"
                delay={index * 0.1}
                className="relative timeline-item"
              >
                {/* Timeline node icon */}
                <div className="absolute -left-[46px] md:-left-[54px] top-1.5 w-9 h-9 rounded-xl border border-border dark:border-slate-800 bg-card dark:bg-slate-950 flex items-center justify-center shadow-md text-blue-400">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>

                <Card className="border-border/60 dark:border-slate-900/60 bg-card/20 dark:bg-slate-900/20 backdrop-blur-sm hover:border-border/80 dark:hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group">
                  {/* Glowing vertical bar on hover */}
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-wide">
                          {exp.title}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm sm:text-base mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900 text-slate-500 dark:text-slate-400 w-fit shrink-0">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        {formattedStart} &mdash; {formattedEnd}
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-2 mt-4">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-200 dark:border-slate-900">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-semibold tracking-wide rounded-md hover:bg-slate-200 dark:hover:bg-slate-900"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
