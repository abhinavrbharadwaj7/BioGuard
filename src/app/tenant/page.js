"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Wrench,
  ChevronRight
} from "lucide-react";

export default function TenantDashboard() {
  const [devices, setDevices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [devRes, tickRes] = await Promise.all([
          fetch("/api/devices"),
          fetch("/api/tickets")
        ]);
        const devData = await devRes.json();
        const tickData = await tickRes.json();
        
        setDevices(devData.data || []);
        setTickets(tickData.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const faultyCount = devices.filter(d => d.status === "malfunctioning").length;
  const inRepairCount = devices.filter(d => d.status === "under-repair").length;
  const condemnedCount = devices.filter(d => d.status === "condemned").length;
  const activeCount = devices.length - condemnedCount; // Assuming active is all non-condemned, or maybe just operational. Let's just use total devices for now or operational + in-repair + faulty.
  
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);
  
  const pmDueCount = devices.filter(d => d.nextServiceDate && new Date(d.nextServiceDate) <= nextMonth).length;
  const calibDueCount = devices.filter(d => d.calibDueDate && new Date(d.calibDueDate) <= nextMonth).length;

  const stats = [
    { label: "Active Devices", value: activeCount.toString(), icon: ShieldCheck, tone: "blue" },
    { label: "Faulty Units", value: faultyCount.toString(), icon: AlertTriangle, tone: "red" },
    { label: "In Repair", value: inRepairCount.toString(), icon: Wrench, tone: "amber" },
    { label: "PM Due Date", value: pmDueCount.toString(), icon: CalendarClock, tone: "green" },
    { label: "Calib Due Date", value: calibDueCount.toString(), icon: Clock, tone: "cyan" },
    { label: "Condemned Devices", value: condemnedCount.toString(), icon: AlertTriangle, tone: "gray" },
  ];

  const recentTickets = tickets.slice(0, 5).map(t => ({
    id: t._id.toString().slice(-6).toUpperCase(),
    device: t.deviceId?.name || "Unknown Device",
    status: t.status,
    priority: t.priority,
    time: new Date(t.createdAt).toLocaleDateString()
  }));

  if (loading) return <div className="p-10 text-muted">Loading dashboard...</div>;

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
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        <div className="med-card">
          <div className="card-header">
            <h2 className="card-title">Recent Tickets</h2>
            <button className="text-primary text-sm font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="med-table-wrapper">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Device</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted">No tickets found.</td></tr>
                ) : recentTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="font-semibold text-primary">{ticket.id}</td>
                    <td>{ticket.device}</td>
                    <td>{ticket.time}</td>
                    <td>
                      <span className={`status-tag ${ticket.priority === 'critical' ? 'tag-red' : ticket.priority === 'high' ? 'tag-amber' : 'tag-blue'}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="capitalize">{ticket.status.replace('-', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="med-card">
          <div className="card-header">
            <h2 className="card-title">Today's Tasks</h2>
            <button className="btn-icon" style={{ width: 28, height: 28 }}>+</button>
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {[
              { time: "10 am", title: "Approve vendor dispatch for MRI", done: true },
              { time: "11 am", title: "Review PM checklist for Ward 4", done: true },
              { time: "1 pm", title: "Meeting with service lead", done: false },
              { time: "3 pm", title: "Sign off on Ventilator repair", done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-sm text-muted w-12 pt-1">{task.time}</span>
                <div className="flex-1 text-sm">{task.title}</div>
                {task.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-amber-300 bg-amber-50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
