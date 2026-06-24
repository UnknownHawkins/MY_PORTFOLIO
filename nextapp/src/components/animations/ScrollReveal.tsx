"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
}: ScrollRevealProps) {
  const getVariants = () => {
    const offset = 40;
    
    const hiddenMap = {
      up: { opacity: 0, y: offset },
      down: { opacity: 0, y: -offset },
      left: { opacity: 0, x: offset },
      right: { opacity: 0, x: -offset },
      none: { opacity: 0 },
    };

    return {
      hidden: hiddenMap[direction],
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.21, 0.47, 0.32, 0.98] as const, // smooth spring-like bezier curve
        },
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
