"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Database, ShieldAlert, Wrench, Sparkles } from "lucide-react";

import type { Skill, SkillCategory } from "@/types";
import { SKILLS } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SkillsProps {
  initialSkills?: Skill[];
}

export default function Skills({ initialSkills }: SkillsProps) {
  // Use DB data if available, otherwise static constants
  const skillsData = initialSkills && initialSkills.length > 0 ? initialSkills : SKILLS;
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("languages");

  const categories: { id: SkillCategory; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "languages",
      label: "Languages",
      icon: <Code2 className="h-4.5 w-4.5" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "databases",
      label: "Databases",
      icon: <Database className="h-4.5 w-4.5" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "security",
      label: "Security & OS",
      icon: <ShieldAlert className="h-4.5 w-4.5" />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "tools",
      label: "Tools & Skills",
      icon: <Wrench className="h-4.5 w-4.5" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Filter skills for active category
  const filteredSkills = skillsData.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-slate-50/50 dark:bg-[#050b18]/60 relative border-t border-slate-200/60 dark:border-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle title="Technical Expertise" subtitle="Skills" />

        {/* Categories Tab Swapper */}
        <ScrollReveal direction="up" delay={0.1} className="flex justify-center mb-12">
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900 backdrop-blur-md rounded-2xl gap-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300",
                    isActive
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-slate-800/80 dark:border-b-blue-500/30"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-900/30"
                  )}
                >
                  <span className={isActive ? "text-blue-400" : "text-slate-500"}>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Skills Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-card/40 dark:bg-slate-900/40 border-border dark:border-slate-900 hover:border-border/80 dark:hover:border-slate-800/80 hover:bg-card/60 dark:hover:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 group overflow-hidden relative">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Fake circular icon placeholder or FontAwesome indicator icon */}
                        <div
                           className="w-10 h-10 rounded-xl flex items-center justify-center border border-border dark:border-slate-800 bg-background dark:bg-slate-950 text-xl transition-all group-hover:scale-105"
                          style={{ color: skill.color || "#2563eb" }}
                        >
                          {skill.name.substring(0, 2).toUpperCase()}
                        </div>
                        <h3 className="font-bold text-foreground tracking-wide text-base group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </h3>
                      </div>
                      <span className="text-sm font-extrabold font-mono text-slate-400">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Proficiency Level</span>
                        <span className="flex items-center gap-0.5">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          {skill.proficiency >= 85
                            ? "Expert"
                            : skill.proficiency >= 70
                            ? "Advanced"
                            : "Intermediate"}
                        </span>
                      </div>
                      <Progress
                        value={skill.proficiency}
                        className="h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900"
                        style={
                          {
                            "--progress-foreground": skill.color || "#2563eb",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
