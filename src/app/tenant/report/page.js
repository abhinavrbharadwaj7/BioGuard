"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  AlertOctagon, 
  ArrowLeft,
  UploadCloud,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReportIssue() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [devices, setDevices] = useState([]);
  
  const [form, setForm] = useState({
    deviceId: "",
    priority: "low",
    errorCode: "",
    issueDescription: ""
  });

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch("/api/devices");
        const data = await res.json();
        setDevices(data.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deviceId || !form.issueDescription) return;
    
    setLoading(true);
    
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit ticket.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const deviceName = devices.find(d => d._id === form.deviceId)?.name || "the selected device";
    
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="med-card p-12 text-center max-w-2xl mx-auto mt-10"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
            <CheckCircle2 className="text-success w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-800">Ticket Generated</h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          Your service request for <strong>{deviceName}</strong> has been logged into the system. 
          The Dispatch Control team is currently reviewing and will assign a technician shortly.
        </p>
        <Link href="/tenant" className="btn-primary mx-auto inline-flex">
            RETURN TO DASHBOARD
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Link href="/tenant" className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group font-medium w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel and Return
      </Link>

      <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 border border-red-100">
              <AlertOctagon className="text-error" />
          </div>
          <div>
              <h2 className="text-3xl font-bold text-slate-800">Report Malfunction</h2>
              <p className="text-slate-500">Declare device failure for immediate dispatch</p>
          </div>
      </div>

      <form onSubmit={handleSubmit} className="med-card p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Device Identification</label>
                      <select 
                        required 
                        value={form.deviceId}
                        onChange={(e) => setForm({...form, deviceId: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      >
                          <option value="">Select Device...</option>
                          {devices.map(d => (
                            <option key={d._id} value={d._id}>
                              {d.name} (SN: {d.serialNumber})
                            </option>
                          ))}
                      </select>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Priority Level</label>
                      <div className="grid grid-cols-3 gap-3">
                          {['low', 'high', 'critical'].map((p) => (
                              <button 
                                key={p} 
                                type="button"
                                onClick={() => setForm({...form, priority: p})}
                                className={`py-3 rounded-lg border text-sm font-bold capitalize transition-all ${
                                    form.priority === p 
                                    ? p === 'critical' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-200 text-primary'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                  {p}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Error Code (Optional)</label>
                      <input 
                        type="text" 
                        value={form.errorCode}
                        onChange={(e) => setForm({...form, errorCode: e.target.value})}
                        placeholder="e.g. ERR_VNT_404"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                  </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Issue Description</label>
                      <textarea 
                        required
                        value={form.issueDescription}
                        onChange={(e) => setForm({...form, issueDescription: e.target.value})}
                        rows={6}
                        placeholder="Detailed description of the hardware or software anomaly..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Media Documentation</label>
                      <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center hover:border-primary/30 transition-colors cursor-pointer group">
                          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors mb-2" />
                          <p className="text-sm font-medium text-slate-600">Drag and drop images</p>
                          <p className="text-xs text-slate-400 mt-1">Max 5MB per file</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 text-lg justify-center shadow-lg shadow-blue-500/20"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "SUBMIT TICKET"}
            </button>
          </div>
      </form>
    </div>
  );
}
