"use client";

import React from "react";
import { GraduationCap, School, BookOpen, Calendar, MapPin, Award } from "lucide-react";

import type { Education } from "@/types";
import { EDUCATION } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

interface EducationProps {
  initialEducation?: Education[];
}

export default function Education({ initialEducation }: EducationProps) {
  const educationData = initialEducation && initialEducation.length > 0 ? initialEducation : EDUCATION;

  const getIcon = (iconName: string | null | undefined) => {
    switch (iconName?.toLowerCase()) {
      case "graduation-cap":
        return <GraduationCap className="h-5 w-5 text-blue-400" />;
      case "school":
        return <School className="h-5 w-5 text-indigo-400" />;
      case "book":
      case "book-open":
        return <BookOpen className="h-5 w-5 text-cyan-400" />;
      default:
        return <GraduationCap className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <section id="education" className="py-24 bg-background dark:bg-[#030712] relative border-t border-border dark:border-slate-900/40">
      {/* Glow lights */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle title="Academic History" subtitle="Education" />

        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-8 md:pl-10 space-y-12">
          {educationData.map((edu, index) => {
            const isCurrent = edu.status === "current";
            return (
              <ScrollReveal
                key={edu.id}
                direction="left"
                delay={index * 0.1}
                className="relative timeline-item"
              >
                {/* Timeline node icon */}
                <div className="absolute -left-[46px] md:-left-[54px] top-1.5 w-9 h-9 rounded-xl border border-border dark:border-slate-800 bg-card dark:bg-slate-950 flex items-center justify-center shadow-md">
                  {getIcon(edu.icon)}
                </div>

                <Card className={`border-border/60 dark:border-slate-900/60 bg-card/20 dark:bg-slate-900/20 backdrop-blur-sm hover:border-border/80 dark:hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden group ${
                  isCurrent ? "border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.05)]" : ""
                }`}>
                  {/* Glowing vertical bar on hover */}
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {edu.degree}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900 text-slate-500 dark:text-slate-400 w-fit shrink-0">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        {isCurrent ? "Present" : edu.endYear}
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 font-semibold mb-3 flex items-center gap-1 text-sm md:text-base">
                      {edu.institution}
                    </p>

                    {edu.location && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                        <MapPin className="h-3 w-3 text-indigo-500" />
                        {edu.location}
                      </div>
                    )}

                    {edu.grade && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-900 text-sm">
                        <Award className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400" />
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Grade / Status:</span>
                        <span className="text-slate-900 dark:text-white font-extrabold font-mono">{edu.grade}</span>
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
