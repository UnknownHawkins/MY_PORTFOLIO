"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, X, Send, Sparkles, User, Search, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { playClickSound, playHoverSound } from "@/lib/sound";

interface Message {
  role: "user" | "friday";
  content: string;
  searchQuery?: string;
  searchResults?: { title: string; url: string; snippet: string }[];
}

export default function FridayChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [assistantName, setAssistantName] = useState("Friday");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    setAssistantName(today);
    setMessages([
      {
        role: "friday",
        content: `Hey this is ${today} Mr Anubhav Portfolio Website. Able to answer with about Mr Anubhav Singh and, his projects, technologies that he used, about hobbies. My name changes automatically every day—today I'm ${today}!`,
      },
    ]);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading, searchStatus]);

  const handleToggle = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    playClickSound();
    setInput("");
    
    // Add user message
    const updatedMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(updatedMessages);
    setIsLoading(true);
    setSearchStatus(null);

    try {
      // We pass the history to the backend endpoint
      const response = await fetch("/api/friday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with Friday.");
      }

      // If search was executed, show what was queried
      if (data.searchQuery) {
        setSearchStatus(`Searched: "${data.searchQuery}"`);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "friday",
          content: data.reply,
          searchQuery: data.searchQuery || undefined,
          searchResults: data.searchResults || undefined
        }
      ]);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setMessages(prev => [
        ...prev,
        {
          role: "friday",
          content: `I ran into an issue connecting to my core services: ${errorMessage}. Please make sure my API key is configured.`
        }
      ]);
    } finally {
      setIsLoading(false);
      setSearchStatus(null);
    }
  };

  const recommendedPrompts = [
    { label: "Skills & Proficiency", text: "Tell me all of Mr. Anubhav's technical skills along with their exact proficiency levels." },
    { label: "Live GitHub Repos", text: "Show me Mr. Anubhav's live GitHub profile stats and top repositories." },
    { label: "Blogs & Stories", text: "What blog posts and stories has Mr. Anubhav written?" },
    { label: "Education & Degree", text: "What is Mr. Anubhav's educational background and graduation status?" },
    { label: "Work Experience", text: "Tell me about Mr. Anubhav's internships and work experience." },
    { label: "Search Tech News", text: "Search the web for the latest news in artificial intelligence and tech." },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {/* Floating Action Button */}
      <motion.button
        onClick={handleToggle}
        onMouseEnter={playHoverSound}
        className={cn(
          "w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 cursor-pointer border border-blue-400/30 relative group overflow-hidden"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow backdrop inside button */}
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isOpen ? (
          <X className="w-6 h-6 transition-transform rotate-0 duration-300" />
        ) : (
          <div className="relative">
            <MessageSquareText className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-indigo-600 animate-ping" />
          </div>
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden select-text"
          >
            {/* Glowing background highlights */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-slate-200/60 dark:border-slate-900/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center relative">
                  <Sparkles className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-950" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm tracking-wide flex items-center gap-1.5">
                    {assistantName}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">
                    AI Assistant
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleToggle}
                onMouseEnter={playHoverSound}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin relative z-10">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2.5 max-w-[85%] animate-fade-in-up",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {/* Icon Profile */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0 shadow-sm border",
                      msg.role === "user"
                        ? "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble Container */}
                  <div className="space-y-1.5">
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm",
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-100/80 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-900/60 rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </div>

                    {/* If search results are present, render source cards */}
                    {msg.searchResults && msg.searchResults.length > 0 && (
                      <div className="space-y-1 pl-1">
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider flex items-center gap-1 uppercase select-none">
                          <Search className="w-2.5 h-2.5 text-blue-500" />
                          Web References:
                        </span>
                        <div className="flex flex-col gap-1">
                          {msg.searchResults.map((ref, rIdx) => (
                            <a
                              key={rIdx}
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 rounded-lg bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-900/40 hover:border-blue-500/30 hover:bg-slate-200/20 dark:hover:bg-slate-900/20 transition-all text-[10px] text-slate-500 dark:text-slate-400 font-medium"
                            >
                              <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between gap-1 line-clamp-1">
                                {ref.title}
                                <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              </div>
                              <p className="line-clamp-2 mt-0.5 text-slate-400 dark:text-slate-500 font-normal">
                                {ref.snippet}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loader */}
              {isLoading && (
                <div className="flex gap-2.5 mr-auto max-w-[85%] items-center animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  
                  <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-900/60 rounded-tl-none flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 select-none">
                      {searchStatus ? (
                        <>
                          <Search className="w-3 h-3 text-blue-500 animate-bounce" />
                          Searching the internet...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                          Synthesizing reply...
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts list (only shows when not loading) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2 pt-1 border-t border-slate-200/30 dark:border-slate-900/30 bg-slate-50/20 dark:bg-slate-950/20 relative z-10">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mb-1.5 select-none">
                  Quick Actions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedPrompts.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleSend(chip.text)}
                      onMouseEnter={playHoverSound}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-blue-500/5 dark:hover:bg-blue-500/5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-[10px] font-semibold cursor-pointer shadow-sm"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-slate-200/60 dark:border-slate-900/60 bg-slate-50/80 dark:bg-slate-950/60 flex items-center gap-2 relative z-10"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${assistantName} anything...`}
                disabled={isLoading}
                className="flex-grow px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-blue-500/50 focus:border-blue-500 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                onMouseEnter={playHoverSound}
                className={cn(
                  "w-8.5 h-8.5 rounded-xl flex items-center justify-center shadow-md transition-all cursor-pointer select-none border border-blue-500/20 shrink-0",
                  input.trim() && !isLoading
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-105"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-400 border-transparent cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
