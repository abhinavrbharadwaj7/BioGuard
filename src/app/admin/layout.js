"use client";

import Sidebar from "@/components/Sidebar";
import { 
  BarChart3, 
  Users, 
  Settings, 
  ClipboardList,
  AlertCircle
} from "lucide-react";

export default function AdminLayout({ children }) {
  const adminItems = [
    { name: "Global Queue", href: "/admin", icon: <ClipboardList size={20} /> },
    { name: "Technician Fleet", href: "/admin/techs", icon: <Users size={20} /> },
    { name: "Performance Docs", href: "/admin/reports", icon: <BarChart3 size={20} /> },
    { name: "System Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex bg-[#050a14] min-h-screen">
      <Sidebar role="Admin Dispatcher" items={adminItems} />
      <main className="flex-1 p-10 max-w-7xl mx-auto overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Main Hub <span className="text-[#00f2ff]">Dispatch</span></h2>
            <p className="text-[#94a3b8]">Service Operations Management</p>
          </div>
          <div className="flex gap-4">
             <div className="glass-panel px-4 py-2 border-[#ff4757]/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#ff4757]" />
                <span className="text-xs font-bold text-[#ff4757] uppercase tracking-tighter">1 Critical Alert</span>
             </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
