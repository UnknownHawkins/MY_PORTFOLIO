"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Calendar, Phone, User, Inbox, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { toggleMessageRead, deleteMessage } from "@/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/utils";

export default function MessagesInboxPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages client-side for dynamic reactivity
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const payload = await res.json();
        if (payload.success) {
          setMessages(payload.data);
        }
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    
    // Optimistic UI update
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: nextRead } : msg))
    );

    try {
      const res = await toggleMessageRead(id, nextRead);
      if (res.success) {
        toast.success(`Marked message as ${nextRead ? "read" : "unread"}`);
        router.refresh();
      } else {
        toast.error("Failed to update status.");
        fetchMessages(); // revert
      }
    } catch (err) {
      toast.error("Operation failed.");
      fetchMessages(); // revert
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    // Optimistic delete
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    try {
      const res = await deleteMessage(id);
      if (res.success) {
        toast.success("Message deleted successfully.");
        router.refresh();
      } else {
        toast.error("Failed to delete message.");
        fetchMessages(); // revert
      }
    } catch (err) {
      toast.error("Delete failed.");
      fetchMessages(); // revert
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Inbox Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review and manage enquiries from your portfolio contact form
        </p>
      </div>

      <Card className="bg-slate-900/40 border-slate-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white">Inbox ({messages.length})</CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Toggle read statuses or remove messages
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 bg-slate-900/60 rounded-xl w-full" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm flex flex-col items-center justify-center gap-4">
              <Inbox className="h-12 w-12 text-slate-700" />
              <span>Your inbox is empty. No messages received yet.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-900/60 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group transition-colors ${
                    msg.read ? "opacity-60" : "opacity-100"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Read Status circle */}
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.read)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border cursor-pointer transition-all ${
                        msg.read
                          ? "bg-slate-950 border-slate-900 text-slate-600 hover:text-slate-400"
                          : "bg-indigo-950 border-indigo-900 text-indigo-400 hover:bg-indigo-900"
                      }`}
                      title={msg.read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.read ? <MailOpen className="h-4.5 w-4.5" /> : <Mail className="h-4.5 w-4.5" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                          {msg.name}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-0.5">
                            <Phone className="h-3 w-3" />
                            {msg.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 bg-slate-950/20 border border-slate-950/40 p-3 rounded-xl max-w-2xl leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions right panel */}
                  <div className="flex items-center gap-4 shrink-0 sm:self-center">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      {timeAgo(msg.createdAt)}
                    </div>
                    
                    <Button
                      onClick={() => handleDelete(msg.id)}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
