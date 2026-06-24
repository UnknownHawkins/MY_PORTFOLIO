"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  Home,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/messages", label: "Messages", icon: Mail },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900/60 hidden md:flex flex-col justify-between min-h-screen sticky top-0">
      <div className="p-6 space-y-8">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-blue-500" />
          <span className="font-extrabold tracking-wider text-white text-base">
            PORTFOLIO ADMIN
          </span>
        </div>

        {/* Links list */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start rounded-xl h-10 px-3 text-sm font-semibold cursor-pointer flex items-center",
                  isActive
                    ? "bg-slate-900 text-blue-400 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                )}
              >
                <Icon className="mr-2.5 h-4.5 w-4.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-6 border-t border-slate-900 space-y-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start border-slate-900 bg-slate-950/20 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl h-10 flex items-center"
          )}
        >
          <Home className="mr-2.5 h-4.5 w-4.5" />
          View Live Site
        </Link>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10 cursor-pointer"
        >
          <LogOut className="mr-2.5 h-4.5 w-4.5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
