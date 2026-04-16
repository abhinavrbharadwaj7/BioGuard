"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Hammer, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const roles = [
    {
      id: "client",
      title: "Hospital Staff",
      description: "Manage your medical device inventory and report malfunctions instantly.",
      icon: <CheckCircle2 className="w-8 h-8 text-[#00ff88]" />,
      action: "/client",
      features: ["Device Registry", "Quick Ticket", "Status Tracking"]
    },
    {
      id: "admin",
      title: "Admin Dispatcher",
      description: "Centralized hub for managing service requests and assigning technicians.",
      icon: <Activity className="w-8 h-8 text-[#00f2ff]" />,
      action: "/admin",
      features: ["Ticket Queue", "Tech Management", "SLA Monitoring"]
    },
    {
      id: "tech",
      title: "Technician",
      description: "Access your assigned tasks, history, and submit digital reports.",
      icon: <Hammer className="w-8 h-8 text-[#7000ff]" />,
      action: "/tech",
      features: ["Job List", "Service Logs", "Digital Signature"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#050a14] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f2ff] opacity-[0.05] rounded-full blur-120" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00ff88] opacity-[0.05] rounded-full blur-120" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-[#00f2ff] animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Bio<span className="gradient-text">Guard</span>
          </h1>
        </div>
        <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
          High-precision biomedical equipment servicing platform. 
          Minimizing downtime for life-saving hardware.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
        <AnimatePresence>
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 flex flex-col"
            >
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
              <p className="text-[#94a3b8] mb-8 leading-relaxed">
                {role.description}
              </p>
              
              <ul className="mb-8 space-y-3">
                {role.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#cbd5e1]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/50" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={role.action} className="mt-auto group">
                <button className="w-full btn-primary bg-white/5 text-white border border-white/10 hover:border-[#00f2ff]/50 group-hover:bg-[#00f2ff]/10">
                  Enter Portal
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center text-[#64748b] text-sm flex items-center gap-4"
      >
        <span>HIPAA READY</span>
        <div className="w-1 h-1 bg-[#1e293b] rounded-full" />
        <span>v1.0.0-BETA</span>
        <div className="w-1 h-1 bg-[#1e293b] rounded-full" />
        <span>GDPR COMPLIANT</span>
      </motion.div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #00f2ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  );
}
