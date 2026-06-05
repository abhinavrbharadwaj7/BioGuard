"use client";

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  ShieldCheck,
  Upload
} from "lucide-react";

export default function TenantLayout({ children }) {
  const tenantItems = [
    { name: "Dashboard", href: "/tenant", icon: <LayoutDashboard size={20} /> },
    { name: "My Devices", href: "/tenant/devices", icon: <ShieldCheck size={20} /> },
    { name: "Bulk Import", href: "/tenant/import", icon: <Upload size={20} /> },
    { name: "Report Issue", href: "/tenant/report", icon: <PlusCircle size={20} /> },
    { name: "Service Ticket History", href: "/tenant/history", icon: <History size={20} /> },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="Tenant" items={tenantItems} />
      <div className="main-content">
        <TopNav title="Hospital Dashboard" userName="T" />
        <main className="page-container mt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
