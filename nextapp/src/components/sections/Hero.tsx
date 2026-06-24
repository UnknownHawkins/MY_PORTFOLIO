"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, FileText, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { motion } from "framer-motion";

import { OWNER, SOCIAL_LINKS } from "@/lib/constants";
import ParticleCanvas from "@/components/animations/ParticleCanvas";
import GradientText from "@/components/animations/GradientText";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playClickSound, playHoverSound } from "@/lib/sound";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let timer: any;
    const activeRole = OWNER.roles[roleIndex];
    const typingSpeed = isDeleting ? 40 : 85;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeRole.substring(0, currentText.length - 1));
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeRole.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    // Handle typing state changes
    if (!isDeleting && currentText === activeRole) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % OWNER.roles.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github": return <Github className="h-5 w-5" />;
      case "linkedin": return <Linkedin className="h-5 w-5" />;
      case "twitter": return <Twitter className="h-5 w-5" />;
      case "instagram": return <Instagram className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center bg-background dark:bg-[#030712] pt-24 overflow-hidden bg-dots"
    >
      {/* Cinematic Particle Background */}
      <ParticleCanvas />

      {/* Radiant Glow Lights */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center text-center py-12">
        {/* Intro Text Centered Column */}
        <div className="flex flex-col justify-center items-center text-center max-w-3xl">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Open to Opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4 leading-tight"
          >
            Hey, I&apos;m <GradientText variant="blue-cyan">{OWNER.name}</GradientText>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300 mb-6 h-10 flex items-center justify-center"
          >
            <span className="text-slate-400 mr-2">I am a</span>
            <span className="text-slate-900 dark:text-white border-r-2 border-blue-500 pr-1 typewriter-cursor font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
              {currentText}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {OWNER.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <Button
              onClick={() => {
                playClickSound();
                handleScrollToSection("contact");
              }}
              onMouseEnter={playHoverSound}
              size="lg"
              className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-12 px-6 rounded-xl cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all w-full sm:w-auto"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              onClick={() => {
                playClickSound();
                handleScrollToSection("projects");
              }}
              onMouseEnter={playHoverSound}
              variant="outline"
              size="lg"
              className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white h-12 px-6 rounded-xl cursor-pointer w-full sm:w-auto font-bold"
            >
              View Work
            </Button>
            
            <a
              href={OWNER.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl w-full sm:w-auto font-bold cursor-pointer flex items-center gap-1.5 justify-center"
              )}
            >
              <FileText className="h-4.5 w-4.5" />
              View Resume
            </a>
          </motion.div>

          {/* Social Links Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all hover:-translate-y-0.5 shadow-sm"
                title={link.label}
              >
                {getSocialIcon(link.icon)}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Profile Avatar Right Column (Commented Out)
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
          >
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-900 flex items-center justify-center">
              <div className="relative w-[90%] h-[90%] overflow-hidden rounded-[20px] bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <Image
                  src={OWNER.avatarUrl}
                  alt={OWNER.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 250px, (max-width: 1024px) 320px, 380px"
                  className="object-cover scale-110"
                />
              </div>
            </div>
          </motion.div>
        </div>
        */}
      </div>

      {/* Floating Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        onClick={() => {
          playClickSound();
          handleScrollToSection("skills");
        }}
        onMouseEnter={playHoverSound}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
