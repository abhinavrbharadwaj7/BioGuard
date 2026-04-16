"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  PlusCircle, 
  ClipboardList, 
  Users, 
  Activity,
  History,
  ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ role, items }) => {
  const pathname = usePathname();

  return (
    <div className="w-[var(--sidebar-width)] h-screen glass-panel rounded-none border-y-0 border-l-0 flex flex-col p-6 sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 mb-12 px-2">
        <Activity className="w-8 h-8 text-[#00f2ff]" />
        <h1 className="text-xl font-bold tracking-tight">BioGuard</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20" 
                  : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="text-xs text-[#64748b] mb-1">LOGGED IN AS</p>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#00ff88]">{role}</p>
        </div>
        
        <Link href="/">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#ff4757] hover:bg-[#ff4757]/10 transition-all cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
