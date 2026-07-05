"use client";

import React, { useState, useEffect, useRef } from "react";
import { Github, ExternalLink, ChevronLeft, ChevronRight, Folder } from "lucide-react";

import type { Project } from "@/types";
import { PROJECTS, STATUS_LABELS } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playClickSound, playHoverSound } from "@/lib/sound";

interface ProjectsProps {
  initialProjects?: Project[];
}

export default function Projects({ initialProjects }: ProjectsProps) {
  const projectsData = initialProjects && initialProjects.length > 0 ? initialProjects : PROJECTS;
  const sortedProjects = [...projectsData].sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    setMounted(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, sortedProjects.length - visibleCards);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340; // 24px gap
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    playClickSound();
    const nextIdx = Math.max(0, currentIndex - 1);
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    playClickSound();
    const nextIdx = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(nextIdx);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
    const newIdx = Math.round(container.scrollLeft / cardWidth);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx <= maxIndex) {
      setCurrentIndex(newIdx);
    }
  };

  const getStatusBadge = (status: string) => {
    const info = STATUS_LABELS[status] || { label: status, color: "bg-slate-500" };
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-xs",
        info.color
      )}>
        {info.label}
      </span>
    );
  };

  return (
    <section id="projects" className="py-24 bg-background dark:bg-[#030712] relative border-t border-border dark:border-slate-900/40 overflow-hidden">
      {/* Decorative backdrops */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title and Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <SectionTitle 
            title="Featured Projects" 
            subtitle="Portfolio" 
            center={false}
            className="mb-0"
          />
          
          {mounted && sortedProjects.length > visibleCards && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                onMouseEnter={playHoverSound}
                className={cn(
                  "w-10 h-10 border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-xs",
                  currentIndex === 0 ? "" : "hover:-translate-x-0.5"
                )}
                aria-label="Previous Project"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                onMouseEnter={playHoverSound}
                className={cn(
                  "w-10 h-10 border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-xs",
                  currentIndex >= maxIndex ? "" : "hover:translate-x-0.5"
                )}
                aria-label="Next Project"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Projects Container */}
        <div className="relative mb-16 px-1">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 -my-4 px-1 scrollbar-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Card className="bg-white/40 dark:bg-slate-900/20 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:bg-white/80 dark:hover:bg-slate-900/40 backdrop-blur-md transition-all duration-300 group flex flex-col min-h-[350px] sm:min-h-[360px] h-full rounded-2xl shadow-xs hover:shadow-lg relative select-none overflow-hidden justify-between">
                  
                  {/* Glowing effect inside card */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:w-36 group-hover:h-36 transition-all duration-500" />
                  
                  {/* Header: Project type & status */}
                  <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0 shrink-0">
                    <div>
                      {project.type ? (
                        <Badge className="bg-blue-50/80 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 rounded-lg font-bold text-[10px] tracking-wide px-2.5 py-0.5 uppercase hover:bg-blue-100/50 dark:hover:bg-blue-950/50">
                          {project.type}
                        </Badge>
                      ) : (
                        <div className="h-5" />
                      )}
                    </div>
                    <div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Title with Folder Icon */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-wide flex items-center gap-2 line-clamp-1">
                        <Folder className="h-5 w-5 text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110 shrink-0" />
                        <span className="truncate">{project.title}</span>
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-900/60 text-slate-600 dark:text-slate-300 text-[9px] sm:text-[10px] font-semibold tracking-wide rounded-md px-2 py-0.5"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-900/60 text-slate-600 dark:text-slate-300 text-[9px] sm:text-[10px] font-semibold tracking-wide rounded-md px-2 py-0.5"
                        >
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  {/* Action buttons footer */}
                  <CardFooter className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between gap-3 shrink-0 mt-auto w-full">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClickSound}
                        onMouseEnter={playHoverSound}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "flex-1 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl h-9 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        )}
                      >
                        <Github className="h-3.5 w-3.5 text-blue-500" />
                        Code
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClickSound}
                        onMouseEnter={playHoverSound}
                        className={cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl h-9 text-xs font-bold shadow-xs border-0 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        )}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live
                      </a>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Slider Pagination Dots */}
          {mounted && sortedProjects.length > visibleCards && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClickSound();
                    scrollToIndex(i);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    currentIndex === i ? "w-6 bg-blue-600 dark:bg-blue-500" : "w-2 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
