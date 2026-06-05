"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function VendorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeJobs = tickets.filter(t => t.status !== "completed");
  const completedJobs = tickets.filter(t => t.status === "completed");
  const urgentCount = activeJobs.filter(t => t.priority === "critical" || t.priority === "high").length;

  const stats = [
    { label: "Assigned Jobs", value: activeJobs.length.toString(), trend: `${urgentCount} urgent`, trendType: "down", icon: Briefcase, tone: "blue" },
    { label: "Parts Reserved", value: "0", trend: "-2", trendType: "down", icon: Package, tone: "amber" },
    { label: "Completed Week", value: completedJobs.length.toString(), trend: "+3", trendType: "up", icon: CheckCircle2, tone: "green" },
  ];

  const jobs = activeJobs.map(t => ({
    id: t._id.toString().slice(-6).toUpperCase(),
    facility: t.hospitalId?.hospital || t.hospitalId?.name || "Unknown",
    device: t.deviceId?.name || "Unknown",
    serial: t.deviceId?.serialNumber || "Unknown",
    priority: t.priority,
    time: new Date(t.createdAt).toLocaleDateString(),
    location: t.deviceId?.location || "General",
  }));

  if (loading) return <div className="p-10 text-muted">Loading field service data...</div>;

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

      <div className="grid-2">
        <div className="med-card">
          <div className="card-header">
            <h2 className="card-title">Today's Repair Route</h2>
            <button className="text-primary text-sm font-semibold flex items-center gap-1">
              Open Map <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {jobs.length === 0 ? <p className="text-muted">No jobs assigned.</p> : jobs.map((job) => (
              <div key={job.id} className="p-4 border border-slate-200 rounded-xl hover:border-primary/30 transition-colors bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-main">{job.device}</h3>
                    <p className="text-sm text-muted">SN: {job.serial} | Job #{job.id}</p>
                  </div>
                  <span className={`status-tag ${job.priority === 'critical' ? 'tag-red' : job.priority === 'high' ? 'tag-amber' : 'tag-blue'}`}>
                    {job.priority}
                  </span>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200 text-sm text-muted">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.facility} - {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.time}</span>
                </div>
                <div className="mt-3">
                   <Link href={`/vendor/report/${job.id}`} className="text-primary text-sm font-medium hover:underline">
                     Start Repair Report &rarr;
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="med-card">
            <div className="card-header">
              <h2 className="card-title">Required Parts</h2>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">No parts reserved for today's route.</p>
            </div>
          </div>

          <div className="med-card">
            <div className="card-header">
              <h2 className="card-title">Schedule</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { time: "08:00 AM", label: "Start Shift", active: false },
                { time: "08:15 AM", label: "Review Assigned Jobs", active: false },
                { time: "09:00 AM", label: "Dispatch to Site", active: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`text-sm ${item.active ? 'text-primary font-bold' : 'text-muted'}`}>{item.time}</div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className={`text-sm ${item.active ? 'text-main font-medium' : 'text-muted'}`}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
