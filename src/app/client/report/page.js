"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  MapPin, 
  Tag, 
  AlertOctagon, 
  ArrowLeft,
  Camera,
  UploadCloud,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function ReportIssue() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00ff88]/30">
            <PlusCircle className="text-[#00ff88] w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Ticket Generated Successfully</h2>
        <p className="text-[#94a3b8] mb-10 leading-relaxed">
          Your request for the **GE MRI Scanner v3 (SN: 98122)** has been logged. 
          The Dispatcher is currently assigning a specialized Technician.
        </p>
        <Link href="/client">
            <button className="btn-primary mx-auto">BACK TO DASHBOARD</button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/client" className="flex items-center gap-2 text-[#64748b] hover:text-[#00f2ff] mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel and Return
      </Link>

      <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 glass-panel flex items-center justify-center bg-[#ff4757]/10 border-[#ff4757]/20">
              <AlertOctagon className="text-[#ff4757]" />
          </div>
          <div>
              <h2 className="text-3xl font-bold">Report Malfunction</h2>
              <p className="text-[#94a3b8]">Declare device failure for immediate dispatch</p>
          </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Device Identification</label>
                      <select required className="w-full bg-[#0a1120] border border-white/10 rounded-xl px-5 py-4 focus:border-[#00f2ff]/50 outline-none text-[#e2e8f0]">
                          <option value="">Select Device...</option>
                          <option value="1">GE MRI Scanner v3 (SN: 98122)</option>
                          <option value="2">Philips Patient Monitor (SN: 11029)</option>
                          <option value="3">Maquet Ventilator (SN: 44211)</option>
                      </select>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Priority Level</label>
                      <div className="grid grid-cols-3 gap-3">
                          {['LOW', 'HIGH', 'CRITICAL'].map((p) => (
                              <button 
                                key={p} 
                                type="button"
                                className={`py-3 rounded-lg border text-[10px] font-bold tracking-widest ${
                                    p === 'CRITICAL' 
                                    ? 'bg-[#ff4757]/10 border-[#ff4757]/40 text-[#ff4757]' 
                                    : 'bg-white/5 border-white/10 text-[#94a3b8] hover:border-[#00f2ff]/30'
                                }`}
                              >
                                  {p}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Error Code (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ERR_VNT_404"
                        className="w-full bg-[#0a1120] border border-white/10 rounded-xl px-5 py-4 focus:border-[#00f2ff]/50 outline-none text-[#e2e8f0]"
                      />
                  </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Issue Description</label>
                      <textarea 
                        required
                        rows={6}
                        placeholder="Detailed description of the hardware or software anomaly..."
                        className="w-full bg-[#0a1120] border border-white/10 rounded-xl px-5 py-4 focus:border-[#00f2ff]/50 outline-none text-[#e2e8f0] resize-none"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Media Documentation</label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:border-[#00f2ff]/30 transition-colors cursor-pointer group">
                          <UploadCloud className="w-10 h-10 text-[#64748b] group-hover:text-[#00f2ff] transition-colors mb-4" />
                          <p className="text-sm font-medium text-[#94a3b8]">Drag and drop images or video</p>
                          <p className="text-[10px] text-[#64748b] mt-1 uppercase">Max 250MB per file</p>
                      </div>
                  </div>
              </div>
          </div>

          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full btn-primary bg-[#00f2ff] h-16 text-lg justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)]"
          >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "DISPATCH EMERGENCY SERVICE"}
          </motion.button>
      </form>
    </div>
  );
}
