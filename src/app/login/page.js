"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { getRoleHome } from "@/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    const safeCallbackUrl = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : null;

    router.replace(safeCallbackUrl || getRoleHome(session?.user?.role));
    router.refresh();
  };

  return (
    <main className="auth-split">
      {/* Left Form Side */}
      <div className="auth-left">
        <div className="auth-content">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-12">
            <Shield className="w-6 h-6 text-primary" />
            BioGuard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 mb-8">Access your clinical workspace to manage devices.</p>

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-icon" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@hospital.com"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-icon" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="auth-input"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100 mb-4">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary auth-submit"
              >
                {loading ? "Signing in..." : "Log in to Workspace"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="auth-right">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,var(--primary-light)_0%,transparent_70%)]"></div>
        <div className="relative w-full max-w-lg h-[600px]">
           <Image 
             src="/hero-illustration.png"
             alt="Medical Staff"
             fill
             className="object-contain drop-shadow-2xl"
           />
        </div>
      </div>
    </main>
  );
}
