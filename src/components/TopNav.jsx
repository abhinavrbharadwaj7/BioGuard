"use client";

import { Bell, Search, Settings } from "lucide-react";
import Image from "next/image";

export default function TopNav({ title = "Dashboard", userName = "User" }) {
  return (
    <div className="top-nav">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="search-bar">
          <Search className="w-4 h-4 text-muted" />
          <input type="text" placeholder="Search" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="btn-icon">
            <Bell className="w-5 h-5" />
          </button>
          <button className="btn-icon" style={{ background: "transparent", color: "var(--text-muted)" }}>
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 border-l pl-4 ml-2 border-slate-200">
            <div className="avatar">
              <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
