"use client";
import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, Lock, ShieldCheck, MessageSquare, Phone, ChevronDown, Check } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const inquiryOptions = [
  "Acquire Luxury Property (Buy)",
  "Premium Residential Leasing (Rent)",
  "List / Sell My Property",
  "Investment Portfolio Advisory",
  "General Consultation"
];

import { useSettings } from "@/context/SettingsContext";

const ContactForm = memo(function ContactForm() {
  const { siteInfo } = useSettings();
  const phone = siteInfo?.contact_phone || "+971 (04) 334 1131";
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "Acquire Luxury Property (Buy)",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      // Combine firstName and lastName for our backend API
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        inquiryType: formData.inquiryType,
        message: formData.message
      };

      // 1. Save inquiry to backend database (/api/contact)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. Simultaneously send automated email from client browser (so FormSubmit receives valid browser Origin headers like Home Page)
        try {
          await fetch(`https://formsubmit.co/ajax/${email}`, {
            method: "POST",
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              Name: payload.name,
              Email: payload.email,
              Phone: payload.phone || "N/A",
              "Consultation Subject": payload.inquiryType,
              Message: payload.message,
              _subject: `New VIP Consultation Lead (${payload.inquiryType}): Mohd. Alfalasi Real Estate`
            })
          });
        } catch (emailErr) {
          console.error("Notice: FormSubmit email delivery error:", emailErr);
        }

        setStatus({
          type: "success",
          message: data.message || "Thank you! Your confidential inquiry has been received by our senior advisory desk."
        });
        setFormData({ firstName: "", lastName: "", email: "", phone: "", inquiryType: "Acquire Luxury Property (Buy)", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Please verify your information and try again."
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error occurred. Please connect with our advisory desk via WhatsApp."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-auto flex flex-col items-center justify-center">
      {/* Rich Introductory Advisory Header (Fills out top spacing nicely in mobile screen frame) */}
      <div className="text-center max-w-lg mx-auto mb-3 sm:mb-5">
        <motion.span variants={fadeInUp} className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-brand-gold font-extrabold block mb-1">
          Confidential Application
        </motion.span>
        <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-brand-black mb-1.5">
          Request Private Consultation
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed px-2 md:hidden">
          Our Senior Advisory Desk operates with absolute discretion. Complete your inquiry below for priority access to our private consultation suites and VIP concierge.
        </motion.p>
      </div>

      {/* Pristine Minimalist White Card (Roomy and comfortable to fill mobile screen frame) */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="bg-white p-5 sm:p-7 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-gray-100 w-full"
      >
        <AnimatePresence mode="wait">
          {status.type && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 rounded-xl mb-3 flex items-start space-x-2 text-xs font-medium shadow-sm ${
                status.type === "success"
                  ? "bg-green-50/90 border border-green-200 text-green-900"
                  : "bg-red-50/90 border border-red-200 text-red-900"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-bold mb-0.5">{status.type === "success" ? "Message Sent" : "Submission Error"}</h4>
                <p className="text-[11px] font-light leading-relaxed">{status.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Row 1: First Name & Last Name (Side-by-Side on mobile too: grid-cols-2) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="firstName" className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-black mb-1">
                FIRST NAME
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. John"
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200/80 bg-white text-brand-black placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-black mb-1">
                LAST NAME
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Doe"
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200/80 bg-white text-brand-black placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Row 2: Email & Phone (Side-by-Side on mobile too: grid-cols-2) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="email" className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-black mb-1">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200/80 bg-white text-brand-black placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-black mb-1">
                PHONE
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+971 50..."
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200/80 bg-white text-brand-black placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Row 3: Custom Luxury Consultation Subject Dropdown (Never Overflows Mobile Screen & Breathtaking Style) */}
          <div className="relative w-full">
            <label htmlFor="inquiryType" className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-black mb-1">
              CONSULTATION SUBJECT
            </label>
            
            {/* Hidden native input for form submission compatibility */}
            <input type="hidden" name="inquiryType" value={formData.inquiryType} />

            {/* Custom Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-left bg-white text-brand-black text-xs sm:text-sm transition-all duration-200 font-medium shadow-sm flex items-center justify-between group ${
                isDropdownOpen 
                  ? "border-brand-gold ring-2 ring-brand-gold/30 shadow-md" 
                  : "border-gray-200/80 hover:border-gray-300"
              }`}
            >
              <span className="truncate pr-2 font-semibold text-brand-black/90">
                {formData.inquiryType}
              </span>
              <ChevronDown className={`w-4 h-4 text-brand-gold flex-shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Full-Screen Transparent Overlay to close cleanly when clicking outside */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-40 bg-transparent cursor-default"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}

            {/* Animated Custom Options List */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 right-0 top-full mt-1.5 w-full bg-white/98 backdrop-blur-xl border border-gray-200/80 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] z-50 overflow-hidden max-h-[220px] sm:max-h-[280px] overflow-y-auto divide-y divide-gray-100/60"
                >
                  {inquiryOptions.map((option) => {
                    const isSelected = formData.inquiryType === option;
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, inquiryType: option }));
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-[#c4a259]/15 text-brand-black font-bold pl-4 border-l-4 border-[#c4a259]"
                            : "text-gray-700 hover:bg-gray-50 hover:text-brand-black hover:pl-4"
                        }`}
                      >
                        <span className="truncate pr-2">{option}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#c4a259] flex-shrink-0" />}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 4: Message */}
          <div>
            <label htmlFor="message" className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-black mb-1">
              MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="I am interested in..."
              className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200/80 bg-white text-brand-black placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all duration-200 resize-none font-light leading-relaxed shadow-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#c4a259] hover:bg-[#b08e45] text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-xs sm:text-sm md:text-base tracking-wide text-center disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Confidential Security & Direct Assistance Footer (Visible on mobile to fill vertical space, hidden on desktop to obey screen frame) */}
      <div className="mt-4 sm:mt-5 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-light space-y-2 sm:space-y-0 px-2 md:hidden">
        <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200/60 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
          <span className="font-medium text-gray-600">256-Bit SSL Encrypted & Non-Disclosure Protected</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold text-brand-black">
          <a href="https://wa.me/971043341131" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 text-green-600 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp Desk</span>
          </a>
          <span>•</span>
          <a href={`tel:${phone}`} className="hover:text-brand-gold transition-colors flex items-center space-x-1">
            <Phone className="w-3.5 h-3.5 text-brand-gold" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
});

export default ContactForm;
