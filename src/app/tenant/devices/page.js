"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Activity, Search } from "lucide-react";

export default function MyDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch("/api/devices");
        const data = await res.json();
        setDevices(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-primary w-8 h-8" />
            Device Inventory
          </h1>
          <p className="text-slate-500 mt-2">Manage and view all your clinical assets in one place.</p>
        </div>
        <div className="search-bar">
           <Search className="w-5 h-5 text-slate-400" />
           <input type="text" placeholder="Search by name, SN..." />
        </div>
      </div>

      <div className="med-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
             <Activity className="w-8 h-8 animate-pulse text-primary mb-4" />
             Loading your assets...
          </div>
        ) : devices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
             No devices found. Use the Bulk Import tool to add devices to your registry.
          </div>
        ) : (
          <div className="med-table-wrapper rounded-none border-0">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th>Serial Number</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device._id}>
                    <td className="font-semibold text-slate-800">{device.name}</td>
                    <td className="text-slate-500">{device.serialNumber}</td>
                    <td>{device.location}</td>
                    <td>
                      <span className={`status-tag ${device.status === 'active' ? 'tag-green' : device.status === 'malfunctioning' ? 'tag-red' : 'tag-amber'}`}>
                        {device.status.toUpperCase()}
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
