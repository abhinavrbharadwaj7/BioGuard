"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardCheck, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  PenTool,
  Clock,
  Wrench
} from "lucide-react";
import Link from "next/link";
import SignatureCanvas from "react-signature-canvas";

export default function ServiceReport({ params }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const sigCanvas = useRef({});

  const clear = () => sigCanvas.current.clear();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (sigCanvas.current.isEmpty()) {
       alert("Official Signature is required for compliance.");
       return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00ff88]/30">
            <CheckCircle2 className="text-[#00ff88] w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Service Finalized</h2>
        <p className="text-[#94a3b8] mb-10 leading-relaxed">
          The Digital Service Report for **{params.id}** has been encrypted and sent to the Hospital Administrator. 
          A copy has also been sent to the Client.
        </p>
        <Link href="/tech">
            <button className="btn-primary mx-auto">RETURN TO JOBS</button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/tech" className="flex items-center gap-2 text-[#64748b] hover:text-[#00f2ff] mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel and Return
      </Link>

      <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 glass-panel flex items-center justify-center bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]">
              <ClipboardCheck />
          </div>
          <div>
              <h2 className="text-3xl font-bold">Service Report</h2>
              <p className="text-[#94a3b8]">Documentation for Ticket <b>{params.id}</b></p>
          </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Work Done */}
              <div className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Summary of Actions</label>
                      <textarea 
                        required
                        rows={8}
                        placeholder="Detail the technical procedures, diagnostics, and repairs performed..."
                        className="w-full bg-[#0a1120] border border-white/10 rounded-xl px-5 py-4 focus:border-[#00ff88]/50 outline-none text-[#e2e8f0] resize-none text-sm"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Parts Replaced</label>
                      <input 
                        type="text" 
                        placeholder="e.g. He-304 Sensor, Cooling Fan Unit"
                        className="w-full bg-[#0a1120] border border-white/10 rounded-xl px-5 py-4 focus:border-[#00ff88]/50 outline-none text-[#e2e8f0] text-sm"
                      />
                  </div>
              </div>

              {/* Right Column: Time & Signature */}
              <div className="space-y-6 flex flex-col">
                  <div className="glass-panel p-6 mb-6">
                      <div className="flex items-center gap-2 text-[#00ff88] mb-4">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Time Tracking</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[9px] text-[#64748b] block mb-1">HOURS SPENT</label>
                              <input type="number" defaultValue={2} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#00ff88]/50 outline-none" />
                          </div>
                           <div>
                              <label className="text-[9px] text-[#64748b] block mb-1">TRAVEL TIME</label>
                              <input type="number" defaultValue={1} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#00ff88]/50 outline-none" />
                          </div>
                      </div>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col">
                      <div className="flex justify-between items-end">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Client Sign-off</label>
                          <button type="button" onClick={clear} className="text-[10px] font-bold text-[#ff4757] flex items-center gap-1 hover:opacity-80">
                              <Trash2 className="w-3 h-3" /> CLEAR
                          </button>
                      </div>
                      <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden min-h-[160px] relative">
                          <SignatureCanvas 
                            ref={sigCanvas}
                            penColor='#00ff88'
                            canvasProps={{width: 500, height: 200, className: 'sigCanvas w-full h-full cursor-crosshair'}} 
                          />
                          <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                              <PenTool className="text-[#00ff88] w-6 h-6 rotate-45" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full btn-primary bg-gradient-to-r from-[#00ff88] to-[#00f2ff] h-16 text-lg justify-center shadow-[0_0_30px_rgba(0,255,136,0.2)] text-[#050a14]"
          >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "FINALIZE SERVICE & UPLOAD REPORT"}
          </motion.button>
      </form>
    </div>
  );
}
