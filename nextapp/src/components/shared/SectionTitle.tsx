"use client";

import React from "react";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  center = true,
  className = "",
}: SectionTitleProps) {
  return (
    <ScrollReveal
      direction="up"
      className={`mb-12 flex flex-col ${center ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      {subtitle && (
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
        {title}
      </h2>
      <div className="mt-3 w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
    </ScrollReveal>
  );
}
