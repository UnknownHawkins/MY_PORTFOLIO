import React from "react";
import AdminNav from "@/components/admin/AdminNav";
import AdminHeader from "@/components/admin/AdminHeader";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#030712] text-foreground">
      {/* Sidebar Nav */}
      <AdminNav />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
