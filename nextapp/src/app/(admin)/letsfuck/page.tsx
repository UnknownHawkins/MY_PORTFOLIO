import React from "react";
import Link from "next/link";
import { FolderKanban, Mail, MailOpen, ShieldCheck, ArrowRight, Calendar, User, FileText } from "lucide-react";
import prisma from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { timeAgo, cn } from "@/lib/utils";
import { auth } from "@/auth";
import LoginForm from "@/components/admin/LoginForm";

// Prevent layout caching to ensure fresh metrics
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    return <LoginForm />;
  }
  let projectCount = 0;
  let messageCount = 0;
  let unreadCount = 0;
  let blogCount = 0;
  let recentMessages: any[] = [];
  let databaseStatus = "Disconnected (Offline Fallback)";

  if (process.env.TURSO_DATABASE_URL) {
    try {
      const [dbProjects, dbMessages, dbUnread, dbRecent, dbBlogs] = await Promise.all([
        prisma.project.count(),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.blog.count(),
      ]);

      projectCount = dbProjects;
      messageCount = dbMessages;
      unreadCount = dbUnread;
      recentMessages = dbRecent;
      blogCount = dbBlogs;
      databaseStatus = "Connected (Turso Database)";
    } catch (dbError) {
      console.error("Dashboard database metrics failed:", dbError);
    }
  }

  const statCards = [
    {
      title: "Total Projects",
      value: projectCount,
      description: "Projects registered in the showcase",
      icon: <FolderKanban className="h-5 w-5 text-blue-400" />,
      href: "/letsfuck/projects",
    },
    {
      title: "Total Blogs",
      value: blogCount,
      description: "Articles published on the website",
      icon: <FileText className="h-5 w-5 text-emerald-400" />,
      href: "/letsfuck/blogs",
    },
    {
      title: "Inbox Messages",
      value: messageCount,
      description: `${unreadCount} unread message(s) awaiting reply`,
      icon: <Mail className="h-5 w-5 text-indigo-400" />,
      href: "/letsfuck/messages",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            System overview and quick access stats
          </p>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 w-fit">
          <span className={`w-2 h-2 rounded-full ${process.env.TURSO_DATABASE_URL ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
          DB: {databaseStatus}
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="bg-slate-900/40 border-slate-900 hover:border-slate-800/80 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                {card.value}
              </div>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
              <Link
                href={card.href}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-blue-400 hover:text-blue-300 text-xs px-0 mt-4 cursor-pointer flex items-center gap-1"
                )}
              >
                Manage items
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent messages box */}
      <Card className="bg-slate-900/40 border-slate-900">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-white">Recent Inbox Messages</CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-1">
              Showing the latest contact form entries
            </CardDescription>
          </div>
          <Link
            href="/letsfuck/messages"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg cursor-pointer flex items-center justify-center"
            )}
          >
            View All
          </Link>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {recentMessages.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No messages received yet. Submit the contact form to verify.
            </div>
          ) : (
            <div className="divide-y divide-slate-900">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 group">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      msg.read ? "bg-slate-950 border-slate-900 text-slate-600" : "bg-indigo-950 border-indigo-900 text-indigo-400"
                    }`}>
                      {msg.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${msg.read ? "text-slate-400" : "text-white"}`}>
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {msg.email}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 font-mono shrink-0">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    {timeAgo(msg.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
