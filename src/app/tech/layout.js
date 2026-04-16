"use client";

import Sidebar from "@/components/Sidebar";
import { 
  Wrench, 
  History, 
  MapPin, 
  ClipboardCheck,
  Package
} from "lucide-react";

export default function TechLayout({ children }) {
  const techItems = [
    { name: "My Assignments", href: "/tech", icon: <Wrench size={20} /> },
    { name: "Equipment History", href: "/tech/equipment", icon: <History size={20} /> },
    { name: "Parts Inventory", href: "/tech/parts", icon: <Package size={20} /> },
    { name: "Service Logs", href: "/tech/logs", icon: <ClipboardCheck size={20} /> },
  ];

  return (
    <div className="flex bg-[#050a14] min-h-screen">
      <Sidebar role="Field Technician" items={techItems} />
      <main className="flex-1 p-10 max-w-7xl mx-auto overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tech <span className="text-[#00ff88]">Worksuite</span></h2>
            <p className="text-[#94a3b8]">Personal Assignment Environment</p>
          </div>
          <div className="flex gap-4">
             <div className="glass-panel px-4 py-2 border-[#00f2ff]/20 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00f2ff]" />
                <span className="text-xs font-bold text-[#00f2ff] uppercase tracking-tighter">On-Site: Gen Hospital</span>
             </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
