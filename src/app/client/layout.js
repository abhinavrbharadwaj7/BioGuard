"use client";

import Sidebar from "@/components/Sidebar";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  ShieldCheck,
  Activity
} from "lucide-react";

export default function ClientLayout({ children }) {
  const clientItems = [
    { name: "Dashboard", href: "/client", icon: <LayoutDashboard size={20} /> },
    { name: "My Devices", href: "/client/devices", icon: <ShieldCheck size={20} /> },
    { name: "Report Issue", href: "/client/report", icon: <PlusCircle size={20} /> },
    { name: "Service Ticket History", href: "/client/history", icon: <History size={20} /> },
  ];

  return (
    <div className="flex bg-[#050a14] min-h-screen">
      <Sidebar role="Hospital Staff" items={clientItems} />
      <main className="flex-1 p-10 max-w-7xl mx-auto overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">General Hospital <span className="text-[#00f2ff]">Phase 1</span></h2>
            <p className="text-[#94a3b8]">Biomedical Infrastructure Overview</p>
          </div>
          <div className="flex gap-4">
             <div className="glass-panel px-4 py-2 border-[#00ff88]/20 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-xs font-bold text-[#00ff88] uppercase tracking-tighter">System Normal</span>
             </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
