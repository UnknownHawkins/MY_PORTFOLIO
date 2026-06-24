"use client";

import React from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const completion = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-900/50 z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-100 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
