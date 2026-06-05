"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardCheck, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  PenTool,
  Clock
} from "lucide-react";
import Link from "next/link";
import SignatureCanvas from "react-signature-canvas";

export default function ServiceReport({ params }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [form, setForm] = useState({
    workDone: "",
    partsReplaced: "",
    hoursSpent: 2,
    travelTime: 1
  });
  
  const sigCanvas = useRef({});

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        const ticket = data.data?.find(t => t._id === params.id);
        if (ticket) {
          setTicketData(ticket);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTicket();
  }, [params.id]);

  const clear = () => sigCanvas.current?.clear();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sigCanvas.current.isEmpty()) {
       alert("Official Signature is required for compliance.");
       return;
    }
    setLoading(true);
    
    try {
      const res = await fetch(`/api/tickets/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "completed",
          serviceReport: {
            ...form,
            signature: sigCanvas.current.toDataURL()
          }
        })
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit service report.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving report.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="med-card p-12 text-center max-w-2xl mx-auto mt-10"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
            <CheckCircle2 className="text-success w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-800">Service Finalized</h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          The Digital Service Report for <strong>{ticketData?.deviceId?.name || params.id}</strong> has been encrypted and sent to the Hospital Administrator. 
        </p>
        <Link href="/vendor" className="btn-primary mx-auto inline-flex">
            RETURN TO JOBS
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Link href="/vendor" className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group font-medium w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel and Return
      </Link>

      <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-100 text-primary">
              <ClipboardCheck />
          </div>
          <div>
              <h2 className="text-3xl font-bold text-slate-800">Service Report</h2>
              <p className="text-slate-500">Documentation for Ticket <b>{params.id}</b></p>
          </div>
      </div>

      <form onSubmit={handleSubmit} className="med-card p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Work Done */}
              <div className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Summary of Actions</label>
                      <textarea 
                        required
                        rows={8}
                        value={form.workDone}
                        onChange={(e) => setForm({...form, workDone: e.target.value})}
                        placeholder="Detail the technical procedures, diagnostics, and repairs performed..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-700 resize-none transition-all"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Parts Replaced (Optional)</label>
                      <input 
                        type="text" 
                        value={form.partsReplaced}
                        onChange={(e) => setForm({...form, partsReplaced: e.target.value})}
                        placeholder="e.g. He-304 Sensor, Cooling Fan Unit"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-700 transition-all"
                      />
                  </div>
              </div>

              {/* Right Column: Time & Signature */}
              <div className="space-y-6 flex flex-col">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                          <Clock className="w-5 h-5 text-primary" />
                          <span>Time Tracking</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">HOURS SPENT</label>
                              <input type="number" value={form.hoursSpent} onChange={(e) => setForm({...form, hoursSpent: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:border-primary outline-none text-slate-800 transition-all" />
                          </div>
                           <div>
                              <label className="text-xs text-slate-500 font-semibold block mb-1 uppercase tracking-wide">TRAVEL TIME</label>
                              <input type="number" value={form.travelTime} onChange={(e) => setForm({...form, travelTime: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:border-primary outline-none text-slate-800 transition-all" />
                          </div>
                      </div>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col">
                      <div className="flex justify-between items-end mb-1">
                          <label className="text-sm font-semibold text-slate-700">Client Sign-off</label>
                          <button type="button" onClick={clear} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:text-red-700 transition-colors">
                              <Trash2 className="w-3 h-3" /> CLEAR
                          </button>
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden min-h-[160px] relative shadow-inner">
                          <SignatureCanvas 
                            ref={sigCanvas}
                            penColor='#0f172a'
                            canvasProps={{className: 'w-full h-full cursor-crosshair'}} 
                          />
                          <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                              <PenTool className="text-slate-400 w-6 h-6 rotate-45" />
                          </div>
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
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "FINALIZE SERVICE & UPLOAD REPORT"}
            </button>
          </div>
      </form>
    </div>
  );
}
