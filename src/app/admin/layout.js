"use client";

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings
} from "lucide-react";

export default function AdminLayout({ children }) {
  const adminItems = [
    { name: "Dispatch Control", href: "/admin", icon: <BarChart3 size={20} /> },
    { name: "Vendor Fleet", href: "/admin/vendors", icon: <Users size={20} /> },
    { name: "All Tickets", href: "/admin/tickets", icon: <FileText size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" items={adminItems} />
      <div className="main-content">
        <TopNav title="Dispatch Control" userName="A" />
        <main className="page-container mt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
