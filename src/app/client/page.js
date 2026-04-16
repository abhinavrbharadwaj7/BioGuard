"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  ArrowUpRight,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const stats = [
    { label: "Active Devices", value: "142", icon: <ShieldCheck className="text-[#00ff88]" />, color: "border-[#00ff88]/20" },
    { label: "Faulty Units", value: "3", icon: <AlertTriangle className="text-[#ff4757]" />, color: "border-[#ff4757]/20" },
    { label: "In Repair", value: "7", icon: <Wrench className="text-[#00f2ff]" />, color: "border-[#00f2ff]/20" },
    { label: "PM Due (30d)", value: "12", icon: <Clock className="text-[#ffa502]" />, color: "border-[#ffa502]/20" },
  ];

  const recentTickets = [
    { id: "T-8821", device: "GE MRI Scanner v3", status: "In Repair", priority: "Critical", time: "2h ago" },
    { id: "T-8822", device: "Philips Patient Monitor", status: "Received", priority: "Normal", time: "5h ago" },
    { id: "T-8823", device: "Maquet Ventilator", status: "Assigned", priority: "High", time: "1d ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-6 border-l-4 ${stat.color}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-[#94a3b8] text-sm font-medium">{stat.label}</div>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device Health Chart Area (Mock) */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold">Facility Health Trends</h3>
            <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10">7D</button>
                <button className="px-3 py-1 rounded-lg bg-[#00f2ff]/20 border border-[#00f2ff]/30 text-xs text-[#00f2ff]">30D</button>
            </div>
          </div>
          
          <div className="h-[240px] flex items-end justify-between gap-2 px-4">
              {[60, 45, 80, 55, 90, 70, 85, 40, 95, 80, 75, 85].map((h, i) => (
                <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + (i * 0.05) }}
                    className="w-full bg-gradient-to-t from-[#00f2ff]/10 to-[#00f2ff]/40 rounded-t-sm border-t border-[#00f2ff]/30"
                />
              ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] text-[#64748b] uppercase tracking-widest font-bold">
              <span>JAN</span>
              <span>JUN</span>
              <span>DEC</span>
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="space-y-8">
            <Link href="/client/report">
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary bg-gradient-to-r from-[#00f2ff] to-[#00ff88] shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                    <Plus className="w-5 h-5" />
                    REPORT NEW MALFUNCTION
                </motion.button>
            </Link>

            <div className="glass-panel p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#94a3b8] mb-6">Recent Tickets</h3>
                <div className="space-y-5">
                    {recentTickets.map((ticket, idx) => (
                        <div key={ticket.id} className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <div className="text-sm font-bold group-hover:text-[#00f2ff] transition-colors">{ticket.device}</div>
                                <div className="text-[11px] text-[#64748b] flex items-center gap-2 mt-1">
                                    <span className="text-[#94a3b8]">{ticket.id}</span>
                                    <span>•</span>
                                    <span>{ticket.time}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`status-badge text-[9px] mb-1 ${
                                    ticket.status === 'In Repair' ? 'status-high' : 'status-normal'
                                }`}>{ticket.status}</div>
                                <div className="text-[10px] font-bold text-[#ff4757]">{ticket.priority}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
