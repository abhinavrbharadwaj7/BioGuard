"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Hammer,
  Shield,
  HeartPulse,
  ActivitySquare,
  Stethoscope,
  Microscope
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const roles = [
    {
      id: "tenant",
      title: "Hospital Operations",
      description: "Track every device, flag failures, and keep clinical teams informed.",
      icon: <Building2 className="w-6 h-6 text-[#2563eb]" />,
      action: "/tenant?demo=1",
      metric: "142 Active Assets",
      bg: "bg-blue-50"
    },
    {
      id: "admin",
      title: "Dispatch Control",
      description: "Prioritize service requests, assign vendors, and watch response health.",
      icon: <Activity className="w-6 h-6 text-[#16a34a]" />,
      action: "/admin?demo=1",
      metric: "42m Avg Response",
      bg: "bg-green-50"
    },
    {
      id: "vendor",
      title: "Field Service",
      description: "Open assignments, document repairs, and close the loop with signatures.",
      icon: <Hammer className="w-6 h-6 text-[#d97706]" />,
      action: "/vendor?demo=1",
      metric: "2 Urgent Jobs",
      bg: "bg-amber-50"
    }
  ];

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link href="/" className="brand-lockup">
          <Shield className="w-6 h-6 text-primary" />
          <span>BioGuard</span>
        </Link>
        <div className="nav-links">
          <Link href="#about">About</Link>
          <Link href="#platform">Platform</Link>
          <Link href="#blog">Blog</Link>
          <Link href="#contact">Contact</Link>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="btn-outline">Log in</Link>
          <Link href="/signup" className="btn-primary">Create an account</Link>
        </div>
      </nav>

      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Empowering Medical Device Reliability</h1>
          <p>
            Navigating Health Together: Your Trusted Biomedical Resource. 
            BioGuard connects hospitals, dispatchers, and field technicians into one cohesive workspace.
          </p>
          <Link href="/signup" className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
            Get started now <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            <Image 
              src="/hero-illustration.png" 
              alt="Medical Team Illustration" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </motion.div>
      </section>

      <section className="trust-banner">
        <div className="trust-banner-logo"><HeartPulse /> Omada Health</div>
        <div className="trust-banner-logo"><ActivitySquare /> Robinhood Med</div>
        <div className="trust-banner-logo"><Microscope /> Samsara Clinical</div>
        <div className="trust-banner-logo"><Stethoscope /> Firstbase Health</div>
        <div className="trust-banner-logo"><Shield /> EXODUS</div>
      </section>

      <section className="landing-entry-points">
        <h2>Your Bridge to Better Health<br/>Start Your Journey Today</h2>
        <div className="entry-grid">
          {roles.map((role, idx) => (
            <motion.div 
              key={role.id}
              className="entry-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`entry-card-icon ${role.bg}`}>
                {role.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{role.title}</h3>
              <p className="text-muted text-sm mb-4 leading-relaxed h-16">
                {role.description}
              </p>
              <div className="flex items-center gap-2 mb-6 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-success" />
                {role.metric}
              </div>
              <Link href={role.action} className="text-primary font-semibold flex items-center gap-2 hover:underline">
                Open Demo Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      {/* --- ABOUT SECTION --- */}
      <section id="about" className="landing-section">
        <div className="section-header">
          <h2>About BioGuard</h2>
          <p>
            We are on a mission to ensure medical facilities operate at peak efficiency. 
            When equipment fails, patient care is compromised. BioGuard bridges the gap 
            between hospitals and service vendors.
          </p>
        </div>
        <div className="about-grid">
          <div className="about-image">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-light)_0%,transparent_70%)] opacity-50"></div>
            <HeartPulse className="w-32 h-32 text-primary opacity-20" />
          </div>
          <div className="about-content">
            <h3>Built for Healthcare Heroes</h3>
            <p>
              Founded by biomedical engineers and software experts, BioGuard understands the 
              intricate regulatory landscape of healthcare. We built a platform that not only 
              tracks assets but predicts failures before they happen, ensuring zero downtime 
              for critical life-saving equipment.
            </p>
            <div className="about-list">
              <div className="about-list-item">
                <CheckCircle2 className="text-primary w-6 h-6" /> 99.9% Platform Uptime
              </div>
              <div className="about-list-item">
                <CheckCircle2 className="text-primary w-6 h-6" /> HIPAA Compliant Infrastructure
              </div>
              <div className="about-list-item">
                <CheckCircle2 className="text-primary w-6 h-6" /> 24/7 Priority Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PLATFORM SECTION --- */}
      <section id="platform" className="landing-section bg-alt">
        <div className="landing-section-inner">
          <div className="section-header">
            <h2>The Platform</h2>
            <p>
              Everything you need to manage the lifecycle of clinical assets.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <ActivitySquare className="w-10 h-10 text-blue-500 mb-6" />
              <h3>Live Tracking</h3>
              <p>
                Monitor the status of all hospital devices in real-time. Know exactly which machines are active, down, or under repair.
              </p>
            </div>
            <div className="feature-card">
              <Hammer className="w-10 h-10 text-amber-500 mb-6" />
              <h3>Automated Dispatch</h3>
              <p>
                Instantly route service tickets to the most qualified vendor based on device type, urgency, and geographic location.
              </p>
            </div>
            <div className="feature-card">
              <Shield className="w-10 h-10 text-green-500 mb-6" />
              <h3>Compliance Logs</h3>
              <p>
                Generate instant digital sign-offs and audit-ready compliance logs for joint commission inspections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section id="blog" className="landing-section">
        <div className="blog-header">
          <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Latest Insights</h2>
            <p style={{ margin: 0 }}>Read the latest news from the BioGuard team.</p>
          </div>
          <button className="text-primary font-semibold hover:underline hidden sm:block">View all posts →</button>
        </div>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-image"></div>
            <div className="blog-category">PRODUCT UPDATE</div>
            <h3>Introducing Predictive Analytics</h3>
            <p>How machine learning is helping hospitals predict ventilator failures before they happen.</p>
          </div>
          <div className="blog-card">
            <div className="blog-image"></div>
            <div className="blog-category" style={{ color: '#16a34a' }}>COMPLIANCE</div>
            <h3>2026 Audit Preparation Guide</h3>
            <p>Ensure your clinical engineering department is ready for the upcoming regulatory changes.</p>
          </div>
          <div className="blog-card">
            <div className="blog-image"></div>
            <div className="blog-category" style={{ color: '#d97706' }}>CASE STUDY</div>
            <h3>Memorial Hospital Success Story</h3>
            <p>How a regional hospital network reduced equipment downtime by 40% in six months.</p>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="landing-section bg-dark">
        <div className="landing-section-inner contact-grid">
          <div className="contact-info">
            <Shield className="w-12 h-12 text-primary mb-6" />
            <h2>Ready to upgrade your biomedical operations?</h2>
            <p>
              Get in touch with our sales team to schedule a custom demo for your facility.
            </p>
            <div className="contact-details">
              <p><strong>Email:</strong> hello@bioguard.example.com</p>
              <p><strong>Phone:</strong> +1 (800) 555-0199</p>
              <p><strong>Office:</strong> 100 Healthway Drive, San Francisco, CA</p>
            </div>
          </div>
          <div className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="jane@hospital.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="btn-contact">
              Send Message
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
