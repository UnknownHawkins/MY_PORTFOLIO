"use client";

import React from "react";
import { Award, ExternalLink, FileText, ArrowRight, ShieldCheck, Cpu, Terminal, Layers } from "lucide-react";

import type { Certification } from "@/types";
import { CERTIFICATIONS, CERTIFICATIONS_DRIVE_URL } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CertificationsProps {
  initialCertifications?: Certification[];
}

export default function Certifications({ initialCertifications }: CertificationsProps) {
  const certsData = initialCertifications && initialCertifications.length > 0 ? initialCertifications : CERTIFICATIONS;

  const getIssuerIcon = (iconName: string | null | undefined) => {
    switch (iconName?.toLowerCase()) {
      case "meta":
        return <Layers className="h-6 w-6" />;
      case "microsoft":
        return <Cpu className="h-6 w-6" />;
      case "google":
        return <ShieldCheck className="h-6 w-6" />;
      case "robot":
        return <Terminal className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  return (
    <section id="certifications" className="py-24 bg-slate-50/50 dark:bg-[#050b18]/60 relative border-t border-slate-200/60 dark:border-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle title="Professional Badges" subtitle="Certifications" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {certsData.map((cert, index) => (
            <ScrollReveal
              key={cert.id}
              direction="up"
              delay={index * 0.08}
            >
              <Card className="bg-card/40 dark:bg-slate-900/40 border-border dark:border-slate-900 hover:border-border/80 dark:hover:border-slate-800/80 hover:bg-card/60 dark:hover:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 group overflow-hidden relative">
                {/* Visual glow ribbon */}
                <div
                  className="absolute top-0 left-0 w-[4px] h-full transition-all"
                  style={{ backgroundColor: cert.color || "#3b82f6" }}
                />
                
                <CardContent className="p-6 flex gap-5 items-start">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-border dark:border-slate-800 bg-background dark:bg-slate-950/80 transition-all group-hover:scale-105"
                    style={{ color: cert.color || "#3b82f6" }}
                  >
                    {getIssuerIcon(cert.icon)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {cert.issuer} &bull; {cert.year}
                      </span>
                      {cert.category && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-background dark:bg-slate-950 text-slate-400 border border-border dark:border-slate-900">
                          {cert.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cert.name}
                    </h3>

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      {cert.pdfUrl && (
                        <a
                          href={cert.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "h-8 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg pl-0 hover:bg-transparent flex items-center"
                          )}
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                          View PDF
                        </a>
                      )}

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "h-8 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-transparent flex items-center"
                          )}
                        >
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-cyan-500" />
                          Verify Credential
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Global Credentials Folder Card */}
        <ScrollReveal direction="up" delay={0.3} className="flex justify-center">
          <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-500/20 max-w-lg w-full text-center hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden">
            <CardContent className="p-8">
              <Award className="h-10 w-10 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">View All Certificates</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                I have collected additional credentials and badges in cybersecurity, scripting, and cloud architecture. Access my public folder to inspect them all.
              </p>
              <a
                href={CERTIFICATIONS_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)] border-0 flex items-center justify-center w-fit mx-auto"
                )}
              >
                Access Public Folder
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </ScrollReveal>

      </div>
    </section>
  );
}
