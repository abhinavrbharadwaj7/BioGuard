"use client";

import { motion } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  History, 
  ArrowRight,
  ShieldAlert,
  Tool
} from "lucide-react";
import Link from "next/link";

export default function TechnicianJobs() {
  const myJobs = [
    { id: "T-8823", facility: "Northside Clinic", device: "Maquet Vent", serial: "M-44211", priority: "High", time: "Assigned 1h ago", location: "ICU B2" },
    { id: "T-8822", facility: "City Medical Center", device: "Philips Monitor", serial: "P-11029", priority: "Normal", time: "Assigned 2h ago", location: "Radiology" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 glass-panel flex items-center justify-center bg-[#00ff88]/10 border-[#00ff88]/20">
              <ShieldAlert className="text-[#00ff88]" />
          </div>
          <div>
              <h2 className="text-3xl font-bold">Assigned Tasks</h2>
              <p className="text-[#94a3b8]">2 Open work orders requiring attention</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 flex flex-col relative overflow-hidden group"
              >
                  {/* Priority Accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.05] rounded-full blur-3xl translate-x-1/2 translate-y--1/2 ${
                      job.priority === 'High' ? 'bg-[#ff4757]' : 'bg-[#00f2ff]'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <span className="text-[10px] font-bold text-[#00f2ff] tracking-[0.2em] mb-1 block uppercase">Job #{job.id}</span>
                          <h3 className="text-2xl font-bold">{job.device}</h3>
                          <p className="text-[#94a3b8] text-sm">{job.serial}</p>
                      </div>
                      <div className={`status-badge text-[9px] ${
                          job.priority === 'High' ? 'status-high' : 'status-normal'
                      }`}>
                          {job.priority}
                      </div>
                  </div>

                  <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                          <MapPin className="w-4 h-4 text-[#00ff88]" />
                          {job.facility} • <span className="text-[#94a3b8]">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                          <Clock className="w-4 h-4 text-[#ffa502]" />
                          {job.time}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                          <History className="w-4 h-4 text-[#7000ff]" />
                          Last Service: 142 days ago
                      </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                      <Link href={`/tech/report/${job.id}`} className="flex-1">
                          <button className="w-full btn-primary bg-white/5 text-white border border-white/10 hover:border-[#00ff88]/50 group-hover:bg-[#00ff88]/10 h-12 text-xs tracking-widest font-bold">
                              START REPAIR LOG
                          </button>
                      </Link>
                      <button className="px-4 glass-panel border-white/5 hover:border-[#00f2ff]/30 text-[#00f2ff]">
                          <MapPin className="w-4 h-4" />
                      </button>
                  </div>
              </motion.div>
          ))}
      </div>

      {/* Quick History Section */}
      <div className="mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748b] mb-6">Recently Resolved (48h)</h3>
          <div className="glass-panel overflow-hidden">
               <div className="p-6 flex items-center justify-between opacity-50 border-b border-white/5">
                   <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <History size={18} />
                        </div>
                        <div>
                            <div className="text-sm font-bold">Centrifuge X12</div>
                            <div className="text-[10px] text-[#94a3b8]">T-8819 • Completed yesterday</div>
                        </div>
                   </div>
                   <div className="text-xs font-bold text-[#00ff88]">LOG SUBMITTED</div>
               </div>
          </div>
      </div>
    </div>
  );
}
