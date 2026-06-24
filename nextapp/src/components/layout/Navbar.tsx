"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { NAV_LINKS, OWNER } from "@/lib/constants";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playClickSound, playHoverSound } from "@/lib/sound";

export default function Navbar() {
  const { activeSection, mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useAppStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    playClickSound();
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      setMobileMenuOpen(false);
      
      const offset = 80; // height of header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-900/60 shadow-lg py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            onMouseEnter={playHoverSound}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-center transition-all group-hover:border-blue-500/50 shadow-md">
              <Image
                src={OWNER.logoUrl}
                alt="Brand Logo"
                fill
                sizes="36px"
                className="object-cover scale-110 transition-transform group-hover:scale-105"
              />
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {OWNER.name}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  onMouseEnter={playHoverSound}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide transition-all",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/5 border-b border-blue-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Actions Toolbar */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className={cn(
                buttonVariants({ variant: "default" }),
                "relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold border-0 cursor-pointer shadow-md rounded-xl flex items-center gap-1"
              )}
            >
              Admin
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Mobile Toolbar Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                playClickSound();
                toggleMobileMenu();
              }}
              onMouseEnter={playHoverSound}
              className="w-9 h-9 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-900"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
