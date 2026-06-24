"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after 1.5 seconds or when page finishes mounting
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712]"
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Logo Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)] overflow-hidden"
            >
              {/* Spinning gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 animate-spin opacity-30" />
              <div className="absolute inset-[2px] bg-slate-950 rounded-[22px] flex items-center justify-center">
                <span className="text-white text-3xl font-black font-sans tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
                  A
                </span>
              </div>
            </motion.div>

            {/* Glowing bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.3, duration: 1.0, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-6 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            />
            
            <p className="mt-3 text-xs tracking-widest text-slate-500 uppercase font-semibold">
              Loading Portfolio...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
