"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { OWNER, SOCIAL_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { playClickSound, playHoverSound } from "@/lib/sound";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <Github className="h-4.5 w-4.5" />;
      case "linkedin":
        return <Linkedin className="h-4.5 w-4.5" />;
      case "twitter":
        return <Twitter className="h-4.5 w-4.5" />;
      case "instagram":
        return <Instagram className="h-4.5 w-4.5" />;
      default:
        return null;
    }
  };

  const currentYear = 2025;

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/60 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} {OWNER.name}. All Rights Reserved.
          </p>
          <p className="text-xs text-slate-600">
            Designed and built with passion using Next.js 15 &amp; Tailwind v4.
          </p>
        </div>

        {/* Social Links Row */}
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.platform}
              href={link.url}
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all hover:scale-105"
              title={link.label}
            >
              {getIcon(link.icon)}
            </Link>
          ))}
        </div>

        {/* Back to Top */}
        <div>
          <Button
            onClick={() => {
              playClickSound();
              handleScrollToTop();
            }}
            onMouseEnter={playHoverSound}
            variant="ghost"
            size="icon"
            className="w-10 h-10 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40 cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
