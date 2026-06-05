"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("Security");
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);

  const tabs = [
    "My Profile",
    "Security",
    "Teams",
    "Team Member",
    "Notifications",
    "Billing",
    "Data Export"
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Settings</h2>
      
      <div className="settings-layout">
        {/* Left Sidebar */}
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <div 
              key={tab} 
              className={`settings-nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
          
          <div className="settings-nav-item danger">
            Delete Account
          </div>
        </div>

        {/* Right Content Area */}
        <div className="settings-content">
          <h3 className="settings-content-title">Security</h3>
          
          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Email address</h4>
              <p>The email address associated with your account.</p>
            </div>
            <div className="settings-row-action">
              <div className="text-right">
                <div className="settings-value">admin@demo.com</div>
                <div className="settings-badge">Unverified</div>
              </div>
              <button className="settings-btn-outline">
                Edit <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Password</h4>
              <p>Set a unique password to protect your account.</p>
            </div>
            <div className="settings-row-action">
              <button className="settings-btn-outline">
                Change Password
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>2-step verification</h4>
              <p>Make your account extra secure. Along with your password, you'll need to enter a code.</p>
            </div>
            <div className="settings-row-action">
              <div 
                className={`toggle-switch ${twoStepEnabled ? "on" : ""}`} 
                onClick={() => setTwoStepEnabled(!twoStepEnabled)}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Restricted Members</h4>
              <p>This will shut down your account. Your account will be reactive when you sign in again.</p>
            </div>
            <div className="settings-row-action">
              <span className="text-muted text-sm font-medium">None</span>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Deactivate my account</h4>
              <p>This will shut down your account. Your account will be reactive when you sign in again.</p>
            </div>
            <div className="settings-row-action">
              <button className="settings-btn-danger">Deactivate</button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Delete Account</h4>
              <p>This will delete your account. Your account will be permanently deleted from BioGuard.</p>
            </div>
            <div className="settings-row-action">
              <button className="settings-btn-danger">Delete</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
