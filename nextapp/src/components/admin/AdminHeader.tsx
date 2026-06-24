"use client";

import React from "react";
import { User, LogOut, ShieldAlert } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminHeader() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-slate-950 border-b border-slate-900/60 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Mobile Title */}
      <div className="flex items-center gap-2 md:hidden">
        <ShieldAlert className="h-5 w-5 text-blue-500" />
        <span className="font-extrabold text-white tracking-wider text-sm">
          PORTFOLIO ADMIN
        </span>
      </div>

      <div className="hidden md:block">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          Secure Session Active
        </span>
      </div>

      {/* User Session status */}
      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">
                {session.user.name || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-500 leading-none">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="h-8 border-slate-900 bg-slate-950/20 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 rounded-lg md:hidden cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
