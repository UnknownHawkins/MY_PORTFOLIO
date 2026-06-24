"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#030712] overflow-hidden bg-dots">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center px-4 max-w-md">
        <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 animate-pulse">
          404
        </h1>
        
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Page Not Found
        </h2>
        
        <p className="mt-4 text-base text-slate-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, renamed, or deleted.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "relative group bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center"
            )}
          >
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
