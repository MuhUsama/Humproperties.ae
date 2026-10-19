"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Phone, Mail, MapPin, Camera, Globe, ShieldCheck, Lock, Key, User, Eye, EyeOff, Construction, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Admin Credentials & Password Change State
  const [adminUsername, setAdminUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [settings, setSettings] = useState({
    mortgage_interest_rate: "4.5",
    contact_email: "",
    contact_phone: "",
    contact_whatsapp: "",
    contact_address: "",
    social_instagram: "",
    show_instagram: "false",
    social_facebook: "",
    show_facebook: "false",
    social_twitter: "",
    show_twitter: "false",
    social_linkedin: "",
    show_linkedin: "false",
    social_tiktok: "",
    show_tiktok: "false",
    social_youtube: "",
    show_youtube: "false"
  });

  useEffect(() => {
    // Fetch site settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const newSettings = { ...settings };
          data.forEach((item: any) => {
            if (item.key in newSettings) {
              (newSettings as any)[item.key] = item.value;
            }
          });
          setSettings(newSettings);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });

    // Fetch current admin username
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setAdminUsername(data.username);
      })
      .catch(() => {});
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newUsername: adminUsername,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to update password.");
      }
    } catch (err) {
      toast.error("Network error while updating password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const promises = Object.entries(settings).map(([key, value]) => 
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: String(value) })
        })
      );
      
      await Promise.all(promises);
      toast.success("Settings saved successfully.");
    } catch (e) {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500 mt-1">Manage global settings, contact information, and calculator defaults.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-brand-black">Contact Information</h2>
            <p className="text-gray-500 text-sm mt-1">This information will be displayed on the Contact page, Footer, and globally across the site.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
                  placeholder="info@mfreuae.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
                  placeholder="+971 4 123 4567"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <input 
                  type="text"
                  value={settings.contact_whatsapp}
                  onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
                  placeholder="+971 50 123 4567"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea 
                  value={settings.contact_address}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors min-h-[100px]"
                  placeholder="Office 123, Business Bay, Dubai, UAE"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-brand-black">Social Media Links</h2>
            <p className="text-gray-500 text-sm mt-1">Configure your social platforms and individually toggle which ones to display in the footer.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instagram */}
            <div className="space-y-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.show_instagram === "true"} onChange={(e) => handleChange('show_instagram', e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
              <div className="relative">
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 w-5 h-5" />
                <input type="url" value={settings.social_instagram} onChange={(e) => handleChange('social_instagram', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" placeholder="https://instagram.com/yourprofile" />
              </div>
            </div>

            {/* Facebook */}
            <div className="space-y-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.show_facebook === "true"} onChange={(e) => handleChange('show_facebook', e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input type="url" value={settings.social_facebook} onChange={(e) => handleChange('social_facebook', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" placeholder="https://facebook.com/yourprofile" />
              </div>
            </div>

            {/* Twitter / X */}
            <div className="space-y-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Twitter (X)</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.show_twitter === "true"} onChange={(e) => handleChange('show_twitter', e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-800 font-bold font-serif text-lg leading-none">X</div>
                <input type="url" value={settings.social_twitter} onChange={(e) => handleChange('social_twitter', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" placeholder="https://x.com/yourprofile" />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">LinkedIn</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.show_linkedin === "true"} onChange={(e) => handleChange('show_linkedin', e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 w-5 h-5" />
                <input type="url" value={settings.social_linkedin} onChange={(e) => handleChange('social_linkedin', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
            </div>

            {/* TikTok */}
            <div className="space-y-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TikTok</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.show_tiktok === "true"} onChange={(e) => handleChange('show_tiktok', e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                <input type="url" value={settings.social_tiktok} onChange={(e) => handleChange('social_tiktok', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" placeholder="https://tiktok.com/@yourprofile" />
              </div>
            </div>

            {/* YouTube */}
            <div className="space-y-3 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">YouTube</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.show_youtube === "true"} onChange={(e) => handleChange('show_youtube', e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                <input type="url" value={settings.social_youtube} onChange={(e) => handleChange('social_youtube', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" placeholder="https://youtube.com/@yourprofile" />
              </div>
            </div>

          </div>
        </div>

        {/* Mortgage Calculator Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-brand-black">Mortgage Calculator</h2>
            <p className="text-gray-500 text-sm mt-1">These settings affect the global mortgage calculator values.</p>
          </div>
          
          <div className="p-6">
            <div className="max-w-md">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Fixed Interest Rate (%)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.mortgage_interest_rate}
                  onChange={(e) => handleChange('mortgage_interest_rate', e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
                  placeholder="e.g. 3.75"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This rate will be locked and displayed to users on the frontend calculator.
              </p>
            </div>
          </div>
        </div>

        {/* Under Construction & Maintenance Mode Link Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <Construction className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-black">Under Construction Mode</h2>
              <p className="text-gray-500 text-xs mt-0.5">Control public access and display the under construction maintenance page.</p>
            </div>
          </div>
          <a
            href="/admin/under-construction"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white font-bold text-xs transition-colors shrink-0"
          >
            <span>Manage Under Construction</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Admin Security & Password Change */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-black">Admin Security & Password</h2>
                <p className="text-gray-500 text-sm mt-0.5">Manage your administrator credentials and update your login password.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Protected Account
            </span>
          </div>

          <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admin Username */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Admin Username / Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm font-medium"
                    placeholder="admin"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Identifier used to log in to the admin panel.</p>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Required to authenticate and authorize this change.</p>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Minimum 6 characters. Use letters & numbers.</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm font-medium"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Must match the new password above exactly.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={updatingPassword}
                className="bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {updatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
