"use client";

import { useEffect, useState } from "react";
import { History, Search, Activity, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#2ed573]';
      case 'in-progress': return 'bg-[#ffa502]';
      case 'in-repair': return 'bg-[#ffa502]';
      case 'assigned': return 'bg-[#00f2ff]';
      default: return 'bg-[#ff4757] animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <History className="text-primary w-8 h-8" />
            Service Ticket History
          </h1>
          <p className="text-slate-500 mt-2">Track the maintenance and repair history of your facility's equipment.</p>
        </div>
        <div className="search-bar">
           <Search className="w-5 h-5 text-slate-400" />
           <input type="text" placeholder="Search tickets..." />
        </div>
      </div>

      <div className="med-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
             <Activity className="w-8 h-8 animate-pulse text-primary mb-4" />
             Loading ticket history...
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
             No service tickets found.
          </div>
        ) : (
          <div className="med-table-wrapper rounded-none border-0">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Ticket Number</th>
                  <th>Equipment & Dept</th>
                  <th>Problem Reported</th>
                  <th>Company Name</th>
                  <th>Vendor Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>
                      <div className="font-semibold text-primary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {ticket.ticketNumber || ticket._id.toString().slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-800">{ticket.deviceId?.name || "Unknown"}</div>
                      <div className="text-xs text-slate-500 mt-1">{ticket.deviceId?.department || "Unspecified Dept"}</div>
                    </td>
                    <td className="max-w-xs truncate" title={ticket.description}>
                      {ticket.description || "No description provided"}
                    </td>
                    <td className="text-slate-500">
                      {ticket.companyName || "N/A"}
                    </td>
                    <td>
                      <div className="text-sm font-medium">{ticket.vendorName || "Unassigned"}</div>
                      <div className="text-xs text-slate-500 mt-1">{ticket.vendorContact || ""}</div>
                    </td>
                    <td>
                      <span className={`status-tag ${ticket.status === 'completed' ? 'tag-green' : ticket.status === 'in-progress' ? 'tag-amber' : ticket.status === 'assigned' ? 'tag-blue' : 'tag-red'}`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
