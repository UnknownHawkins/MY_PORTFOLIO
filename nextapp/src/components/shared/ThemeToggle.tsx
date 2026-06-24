"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { playClickSound, playHoverSound } from "@/lib/sound";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering icons once mounted
  useEffect(() => {
    setMounted(true);
    // Initialize theme from localStorage or default
    const savedTheme = localStorage.getItem("theme-preference") as any;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
    }
  }, [setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 border border-slate-800 rounded-lg">
        <span className="sr-only">Toggle theme</span>
        <div className="w-4 h-4 rounded-full bg-slate-800 animate-pulse" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button
          onClick={playClickSound}
          onMouseEnter={playHoverSound}
          variant="ghost"
          size="icon"
          className="w-9 h-9 border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          {theme === "light" && <Sun className="h-4.5 w-4.5 text-amber-500" />}
          {theme === "dark" && <Moon className="h-4.5 w-4.5 text-blue-400" />}
          {theme === "system" && <Laptop className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      } />
      <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
        <DropdownMenuItem
          onClick={() => {
            playClickSound();
            setTheme("light");
          }}
          onMouseEnter={playHoverSound}
          className="flex items-center gap-2 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white cursor-pointer"
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            playClickSound();
            setTheme("dark");
          }}
          onMouseEnter={playHoverSound}
          className="flex items-center gap-2 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white cursor-pointer"
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            playClickSound();
            setTheme("system");
          }}
          onMouseEnter={playHoverSound}
          className="flex items-center gap-2 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white cursor-pointer"
        >
          <Laptop className="h-4 w-4 text-slate-400" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
