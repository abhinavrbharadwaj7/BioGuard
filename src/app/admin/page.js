"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Clock,
  ShieldAlert,
  Users,
  ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tickRes, vendRes] = await Promise.all([
          fetch("/api/tickets"),
          fetch("/api/users?role=vendor")
        ]);
        const tickData = await tickRes.json();
        const vendData = await vendRes.json();
        
        setTickets(tickData.data || []);
        setVendors(vendData.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const openTickets = tickets.filter(t => t.status !== "completed");
  const unassignedCount = tickets.filter(t => t.status === "received").length;
  const criticalCount = tickets.filter(t => t.priority === "critical" && t.status !== "completed").length;
  
  const vendorStats = vendors.map(v => {
    const activeJobs = tickets.filter(t => t.assignedVendorId?._id === v._id && t.status !== "completed").length;
    const load = Math.min(activeJobs * 20, 100);
    return { name: v.name, load };
  });

  const avgVendorLoad = vendorStats.length > 0 ? Math.round(vendorStats.reduce((a, b) => a + b.load, 0) / vendorStats.length) : 0;

  const stats = [
    { label: "Open Queue", value: openTickets.length.toString(), trend: `-${unassignedCount}`, trendType: "up", icon: Activity, tone: "blue" },
    { label: "Critical Alerts", value: criticalCount.toString(), trend: "+2", trendType: "down", icon: ShieldAlert, tone: "red" },
    { label: "Avg Vendor Load", value: `${avgVendorLoad}%`, trend: "+5%", trendType: "up", icon: Users, tone: "green" },
    { label: "SLA At Risk", value: "0", trend: "0", trendType: "up", icon: Clock, tone: "amber" },
  ];

  const displayTickets = tickets.slice(0, 10).map(t => ({
    id: t._id.toString().slice(-6).toUpperCase(),
    facility: t.hospitalId?.hospital || t.hospitalId?.name || "Unknown",
    device: t.deviceId?.name || "Unknown",
    priority: t.priority,
    status: t.status,
    time: new Date(t.createdAt).toLocaleDateString(),
    vendor: t.assignedVendorId?.name || "Unassigned"
  }));

  if (loading) return <div className="p-10 text-muted">Loading dispatch board...</div>;

  return (
    <div>
      <div className="stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-header">
                <div className={`stat-icon-wrapper stat-icon-${stat.tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.label}
              </div>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className={`trend-badge trend-${stat.trendType}`}>
                  {stat.trendType === "up" ? "↗" : "↘"} {stat.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="med-card">
        <div className="card-header">
          <h2 className="card-title">Live Dispatch Queue</h2>
          <button className="text-primary text-sm font-semibold flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="med-table-wrapper">
          <table className="med-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Facility</th>
                <th>Device</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayTickets.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No tickets found.</td></tr>
              ) : displayTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="font-semibold text-primary">{ticket.id}</td>
                  <td>{ticket.facility}</td>
                  <td>{ticket.device}</td>
                  <td>
                    <span className={`status-tag ${ticket.priority === 'critical' ? 'tag-red' : ticket.priority === 'high' ? 'tag-amber' : 'tag-blue'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="capitalize">{ticket.status.replace('-', ' ')}</td>
                  <td>
                    {ticket.vendor === "Unassigned" ? (
                      <span className="status-tag tag-amber">Unassigned</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                          {ticket.vendor.charAt(0)}
                        </div>
                        {ticket.vendor}
                      </div>
                    )}
                  </td>
                  <td>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
