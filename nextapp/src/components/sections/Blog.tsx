"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, User, Clock, ArrowRight, FileText } from "lucide-react";

import type { Blog } from "@/types";
import { BLOGS } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { playClickSound, playHoverSound } from "@/lib/sound";

interface BlogSectionProps {
  initialBlogs?: Blog[];
}

// ── Streaming handwriting renderer ─────────────────────────────────────────────
function StreamingContent({ content }: { content: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    // 3 chars/frame → ~180 chars/sec — feels like fast handwriting
    const CHARS_PER_FRAME = 3;

    const tick = () => {
      if (indexRef.current >= content.length) {
        setDone(true);
        return;
      }
      const next = Math.min(indexRef.current + CHARS_PER_FRAME, content.length);
      setDisplayed(content.slice(0, next));
      indexRef.current = next;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [content]);

  return (
    <div
      style={{
        fontFamily: "'Caveat', 'Segoe Script', 'Bradley Hand', cursive",
        fontSize: "1.15rem",
        lineHeight: "2rem",
        color: "#1a1a2e",
        background: `repeating-linear-gradient(
          transparent,
          transparent calc(2rem - 1px),
          #c8d8e8 calc(2rem - 1px),
          #c8d8e8 2rem
        )`,
        minHeight: "12rem",
        padding: "0.25rem 0.5rem 0.25rem 1rem",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }}
    >
      {displayed}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1.1em",
            background: "#2563eb",
            marginLeft: "1px",
            verticalAlign: "middle",
            animation: "blink 0.7s step-end infinite",
          }}
        />
      )}
    </div>
  );
}

export default function BlogSection({ initialBlogs }: BlogSectionProps) {
  const blogsData = initialBlogs && initialBlogs.length > 0 ? initialBlogs : BLOGS;
  const sortedBlogs = [...blogsData].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200) || 1;
  };

  const handleOpenBlog = (blog: Blog) => {
    playClickSound();
    setSelectedBlog(blog);
  };

  const handleCloseBlog = () => {
    playClickSound();
    setSelectedBlog(null);
  };

  return (
    <>
      {/* Inject Caveat handwriting font + blink keyframe */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <section
        id="blog"
        className="py-24 bg-background dark:bg-[#030712] relative border-t border-border dark:border-slate-900/40 overflow-hidden"
      >
        {/* Background gradients */}
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <SectionTitle
              title="Knowledge & Insights"
              subtitle="My Blog"
              center={true}
              className="mb-14"
            />
          </ScrollReveal>

          {sortedBlogs.length === 0 ? (
            <ScrollReveal delay={0.2}>
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/20 dark:bg-slate-950/20 backdrop-blur-md max-w-lg mx-auto">
                <FileText className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No Articles Yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  I am currently drafting some amazing write-ups. Stay tuned!
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedBlogs.map((blog, idx) => {
                const readTime = calculateReadTime(blog.content);
                return (
                  <ScrollReveal key={blog.id} delay={idx * 0.1}>
                    <Card
                      onClick={() => handleOpenBlog(blog)}
                      onMouseEnter={playHoverSound}
                      className="bg-white/40 dark:bg-slate-900/10 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:bg-white/80 dark:hover:bg-slate-900/30 backdrop-blur-md transition-all duration-300 group overflow-hidden flex flex-col h-[360px] rounded-3xl shadow-sm hover:shadow-lg relative select-none cursor-pointer"
                    >
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:w-44 group-hover:h-44 transition-all duration-500" />

                      <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                        <Badge className="bg-blue-50/80 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 rounded-xl font-extrabold text-[10px] tracking-widest px-3 py-1 uppercase hover:bg-blue-100/50 dark:hover:bg-blue-950/40">
                          {blog.partNo}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{readTime} min read</span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 pt-2 flex-grow flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                            {blog.content}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0 border-t border-slate-100 dark:border-slate-900/50 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>{blog.author || "Anubhav Singh"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1.5 transition-transform duration-300">
                          <ArrowRight className="h-4.5 w-4.5" />
                        </div>
                      </CardFooter>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {/* ── Notebook paper reader dialog ── */}
          <Dialog open={!!selectedBlog} onOpenChange={handleCloseBlog}>
            <DialogContent
              className="p-0 border-0 shadow-2xl overflow-hidden"
              style={{
                maxWidth: "48vw",
                width: "48vw",
                maxHeight: "90vh",
                borderRadius: "4px",
                background: "transparent",
              }}
            >
              {selectedBlog && (
                <div
                  style={{
                    background: "#fefefe",
                    borderRadius: "4px",
                    boxShadow:
                      "0 4px 6px rgba(0,0,0,0.07), 0 10px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "90vh",
                    overflow: "hidden",
                  }}
                >
                  {/* Page header strip */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "14px",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.25)",
                          borderRadius: "6px",
                          padding: "2px 10px",
                          fontSize: "10px",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {selectedBlog.partNo}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600 }}>
                        <Clock style={{ display: "inline", width: 12, height: 12, marginRight: 4 }} />
                        {calculateReadTime(selectedBlog.content)} min read
                      </span>
                    </div>
                  </div>

                  {/* Paper body */}
                  <div
                    style={{
                      overflowY: "auto",
                      flex: 1,
                      display: "flex",
                    }}
                  >
                    {/* Red margin line */}
                    <div
                      style={{
                        width: "3px",
                        background: "#f87171",
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    />

                    <div style={{ flex: 1, padding: "24px 28px 32px 24px" }}>
                      {/* Title in handwriting */}
                      <DialogHeader>
                        <DialogTitle
                          style={{
                            fontFamily: "'Caveat', 'Segoe Script', cursive",
                            fontSize: "1.75rem",
                            fontWeight: 700,
                            color: "#1e293b",
                            lineHeight: 1.2,
                            marginBottom: "6px",
                          }}
                        >
                          {selectedBlog.title}
                        </DialogTitle>
                        <DialogDescription className="hidden">Blog reader</DialogDescription>
                      </DialogHeader>

                      {/* Meta info */}
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "18px",
                          paddingBottom: "12px",
                          borderBottom: "1px solid #e2e8f0",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: "0.95rem",
                            color: "#64748b",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <User size={13} style={{ color: "#2563eb" }} />
                          By {selectedBlog.author || "Anubhav Singh"}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: "0.95rem",
                            color: "#64748b",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Calendar size={13} style={{ color: "#2563eb" }} />
                          {new Date(selectedBlog.updatedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* ── Streaming handwriting content ── */}
                      <StreamingContent key={selectedBlog.id} content={selectedBlog.content} />
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}
