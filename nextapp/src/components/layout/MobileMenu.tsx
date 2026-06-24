"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Shield } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { NAV_LINKS, OWNER } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, activeSection } = useAppStore();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      setMobileMenuOpen(false);
      
      const offset = 80; // height of navbar
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black md:hidden"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className="fixed top-0 left-0 w-full z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 shadow-2xl pt-20 pb-6 px-4 md:hidden flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-1.5 mt-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={cn(
                      "px-4 py-3.5 rounded-xl text-base font-semibold transition-all",
                      isActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-500/5 border-l-2 border-blue-500"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <hr className="border-slate-200 dark:border-slate-900 my-2" />

            <div className="flex flex-col gap-3 px-2">
              {/* <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white justify-center h-11 rounded-xl cursor-pointer flex items-center"
                )}
              >
                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                Admin Gateway
                <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" />
              </Link> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
