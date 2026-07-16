"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics service or server console
    console.error("Global app error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#030712] overflow-hidden bg-dots">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center px-4 max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Something went wrong
        </h2>

        <p className="mt-4 text-base text-slate-400">
          An unexpected error occurred in the application. Please try reloading
          or click the button below to recover.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={() => reset()}
            size="lg"
            className="relative group bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
          >
            <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-45" />
            Try Again
          </Button>
          
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:text-white flex items-center justify-center"
            )}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
