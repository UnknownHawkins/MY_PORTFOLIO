"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  variant?: "blue-cyan" | "gold-orange" | "purple-pink" | "custom";
  className?: string;
  from?: string;
  to?: string;
}

export default function GradientText({
  children,
  variant = "blue-cyan",
  className = "",
  from = "from-blue-500",
  to = "to-cyan-400",
}: GradientTextProps) {
  const variantStyles = {
    "blue-cyan": "from-blue-500 via-indigo-400 to-cyan-400",
    "gold-orange": "from-amber-400 via-orange-400 to-red-500",
    "purple-pink": "from-violet-500 via-purple-400 to-pink-500",
    custom: `${from} ${to}`,
  };

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r font-bold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
