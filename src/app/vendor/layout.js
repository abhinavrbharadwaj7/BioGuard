"use client";

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { 
  Briefcase, 
  MapPin, 
  FileSignature, 
  Package
} from "lucide-react";

export default function VendorLayout({ children }) {
  const vendorItems = [
    { name: "My Work Orders", href: "/vendor", icon: <Briefcase size={20} /> },
    { name: "Route Map", href: "/vendor/route", icon: <MapPin size={20} /> },
    { name: "Sign-offs", href: "/vendor/signoffs", icon: <FileSignature size={20} /> },
    { name: "Parts Inventory", href: "/vendor/parts", icon: <Package size={20} /> },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="Vendor" items={vendorItems} />
      <div className="main-content">
        <TopNav title="Field Service" userName="V" />
        <main className="page-container mt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
