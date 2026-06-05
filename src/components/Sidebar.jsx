"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Activity } from "lucide-react";
import { signOut } from "next-auth/react";

const Sidebar = ({ role, items }) => {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="nav-brand">
        <Activity className="w-6 h-6" />
        <span>BioGuard</span>
      </div>

      <div className="nav-section mt-4">
        <p className="nav-label">MAIN</p>
        <nav className="flex flex-col">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`nav-item ${isActive ? "active" : ""}`}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto nav-section">
        <p className="nav-label">ACCOUNT</p>
        <div className="flex flex-col">
          <div className="nav-item cursor-default text-xs" style={{ background: "transparent" }}>
            <span className="font-bold text-slate-400 uppercase">Role: {role}</span>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="nav-item text-slate-500 hover:text-red-500 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
