"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Building2, CheckCircle2, Lock, Mail, Shield, User } from "lucide-react";
import Image from "next/image";

import { ROLE_LABELS, ROLES, getRoleHome } from "@/lib/roles";

function getInitialRole() {
  if (typeof window === "undefined") {
    return "tenant";
  }

  const role = new URLSearchParams(window.location.search).get("role");
  return ROLES.includes(role) ? role : "tenant";
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: getInitialRole(),
  });
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(data.error || "Unable to create account.");
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.replace("/login");
      return;
    }

    router.replace(data.redirectTo || getRoleHome(form.role));
    router.refresh();
  };

  return (
    <main className="auth-split">
      {/* Left Form Side */}
      <div className="auth-left">
        <div className="auth-content">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-8">
            <Activity className="w-6 h-6 text-primary" />
            BioGuard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 mb-8">Join BioGuard to streamline your biomedical operations.</p>

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User className="auth-icon" />
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="auth-input"
                  />
                </div>
              </div>

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
                    placeholder="you@company.com"
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
                    placeholder="Create a strong password"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Account Type</label>
                <div className="auth-input-wrapper">
                  <Building2 className="auth-icon" />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="auth-input appearance-none"
                  >
                    <option value="tenant">Hospital / Clinic (Tenant)</option>
                    <option value="vendor">Service Provider (Vendor)</option>
                    <option value="admin">System Administrator (Admin)</option>
                  </select>
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Log in here
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
