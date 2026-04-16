"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Clock, 
  ArrowRight,
  ChevronDown,
  Activity
} from "lucide-react";
import { useState } from "react";

export default function GlobalQueue() {
  const [filter, setFilter] = useState("All");

  const tickets = [
    { id: "T-8821", facility: "General Hospital", device: "GE MRI v3", priority: "Critical", status: "Unassigned", time: "12m ago" },
    { id: "T-8822", facility: "City Medical Center", device: "Philips Monitor", priority: "Normal", status: "Assigned", time: "45m ago", tech: "A. Chen" },
    { id: "T-8823", facility: "Northside Clinic", device: "Maquet Vent", priority: "High", status: "In-Repair", time: "1h ago", tech: "M. Rossi" },
    { id: "T-8824", facility: "General Hospital", device: "CardioScan X1", priority: "Normal", status: "Completed", time: "3h ago", tech: "J. Smith" },
    { id: "T-8825", facility: "West End Rehab", device: "Beds / Rails", priority: "Low", status: "Unassigned", time: "5h ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex gap-4">
          <div className="flex-1 glass-panel px-6 py-4 flex items-center gap-4">
              <Search className="text-[#64748b] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by Ticket ID, Device, or Facility..."
                className="bg-transparent border-none outline-none text-sm w-full text-[#e2e8f0]"
              />
          </div>
          <button className="glass-panel px-6 py-4 flex items-center gap-2 text-sm font-bold text-[#94a3b8] hover:text-[#00f2ff] transition-colors">
              <Filter className="w-4 h-4" />
              FILTER
              <ChevronDown className="w-4 h-4" />
          </button>
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden">
          <table className="w-full text-left border-collapse">
              <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Ticket Info</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Facility & Device</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Priority</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Handling</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                  {tickets.map((ticket, idx) => (
                      <motion.tr 
                        key={ticket.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      >
                          <td className="px-8 py-6">
                              <div className="text-sm font-bold text-[#00f2ff]">{ticket.id}</div>
                              <div className="text-[10px] text-[#64748b] flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {ticket.time}
                              </div>
                          </td>
                          <td className="px-8 py-6">
                              <div className="text-sm font-bold">{ticket.device}</div>
                              <div className="text-xs text-[#94a3b8] mt-1">{ticket.facility}</div>
                          </td>
                          <td className="px-8 py-6">
                              <div className={`status-badge text-[9px] ${
                                  ticket.priority === 'Critical' ? 'status-critical' :
                                  ticket.priority === 'High' ? 'status-high' : 'status-normal'
                              }`}>
                                  {ticket.priority}
                              </div>
                          </td>
                          <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                      ticket.status === 'Unassigned' ? 'bg-[#ff4757] animate-pulse' :
                                      ticket.status === 'Completed' ? 'bg-[#2ed573]' : 'bg-[#00f2ff]'
                                  }`} />
                                  <span className="text-xs font-medium">{ticket.status}</span>
                              </div>
                          </td>
                          <td className="px-8 py-6">
                              {ticket.tech ? (
                                  <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[#00ff88] border border-white/10 italic">
                                          {ticket.tech[0]}
                                      </div>
                                      <span className="text-xs text-[#e2e8f0] font-medium">{ticket.tech}</span>
                                  </div>
                              ) : (
                                  <span className="text-[10px] text-[#64748b] italic">Pending assignment</span>
                              )}
                          </td>
                          <td className="px-8 py-6">
                              <button className={`p-2 rounded-lg border transition-all ${
                                  ticket.status === 'Unassigned' 
                                  ? 'border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/10' 
                                  : 'border-white/5 text-[#64748b] hover:text-white'
                              }`}>
                                  {ticket.status === 'Unassigned' ? <UserPlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                              </button>
                          </td>
                      </motion.tr>
                  ))}
              </tbody>
          </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           <div className="glass-panel p-8 min-h-[300px] border-l-4 border-l-[#00f2ff]">
               <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold flex items-center gap-2">
                       <Activity className="text-[#00f2ff] w-5 h-5" />
                       Technician Workload
                   </h3>
                   <span className="text-xs text-[#94a3b8] uppercase">Live Update</span>
               </div>
               <div className="space-y-6">
                   {[
                       { name: "Andrew Chen", load: 85, color: "#ff4757" },
                       { name: "Maria Rossi", load: 40, color: "#00f2ff" },
                       { name: "John Smith", load: 65, color: "#ffa502" },
                       { name: "Elena Volkov", load: 10, color: "#00ff88" }
                   ].map(tech => (
                       <div key={tech.name}>
                           <div className="flex justify-between text-xs mb-2">
                               <span className="font-medium text-[#e2e8f0]">{tech.name}</span>
                               <span className="text-[#94a3b8]">{tech.load}% Capacity</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${tech.load}%` }}
                                 className="h-full"
                                 style={{ backgroundColor: tech.color, boxShadow: `0 0 10px ${tech.color}` }}
                               />
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           <div className="glass-panel p-8 border-l-4 border-l-[#ffa502]">
               <h3 className="font-bold mb-8">SLA Adherence</h3>
               <div className="flex items-center justify-center flex-col h-full gap-4 pb-8">
                   <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                           <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                           <circle cx="64" cy="64" r="56" fill="transparent" stroke="#00f2ff" strokeWidth="8" strokeDasharray="351.8" strokeDashoffset="70.3" strokeLinecap="round" />
                       </svg>
                       <span className="absolute text-2xl font-bold">80%</span>
                   </div>
                   <div className="text-center">
                       <div className="text-sm font-bold text-[#e2e8f0]">Weekly Dispatch Efficiency</div>
                       <div className="text-xs text-[#94a3b8] mt-1">Avg. Response Time: 42min</div>
                   </div>
               </div>
           </div>
      </div>
    </div>
  );
}
