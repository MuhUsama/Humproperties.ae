"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, Lock, ShieldCheck, Phone, Award } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

import { useSettings } from "@/context/SettingsContext";

interface PropertyInquiryProps {
  property: {
    id: string;
    title: string;
    price: string;
    location: string;
  };
}

const PropertyInquiry = memo(function PropertyInquiry({ property }: PropertyInquiryProps) {
  const { siteInfo } = useSettings();
  const phone = siteInfo?.contact_phone || "+971 (04) 334 1131";
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: `I am requesting confidential consultation regarding Reference ID: [${property.id}] - ${property.title} (${property.price}). Please schedule a private briefing.`
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const inquirySubject = `Property Acquisition Inquiry: [${property.id}] - ${property.title}`;

      const payload = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        inquiryType: inquirySubject,
        message: formData.message
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        try {
          await fetch(`https://formsubmit.co/ajax/${email}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              Name: fullName,
              Email: payload.email,
              Phone: payload.phone || "N/A",
              "Consultation Subject": inquirySubject,
              "Property Ref ID": property.id,
              "Property Title": property.title,
              "Property Price": property.price,
              Message: payload.message,
              _subject: `VIP Property Lead (${property.id}): Mohd. Alfalasi Real Estate`
            })
          });
        } catch (emailErr) {
          console.error("Notice: FormSubmit email delivery error:", emailErr);
        }

        setStatus({
          type: "success",
          message: "Thank you! Your confidential listing inquiry has been transmitted to our senior advisory desk."
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: `I am requesting confidential consultation regarding Reference ID: [${property.id}] - ${property.title} (${property.price}). Please schedule a private briefing.`
        });
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
    <section 
      id="consultation-desk" 
      className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)] scroll-mt-20 overflow-hidden"
    >
      {/* Delicate ambient gold museum glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* =========================================================================
          SECTION 05: PRIORITY ADVISORY ACCESS DOSSIER CARD (IDENTICAL TO ABOUT US CARD)
         ========================================================================= */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="w-full flex-1 bg-white text-[#101014] rounded-[2rem] md:rounded-[2.5rem] border border-[#d4af37]/35 shadow-[0_20px_70px_rgba(0,0,0,0.06),_0_0_40px_rgba(212,175,55,0.05)] p-6 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-hidden z-10"
      >
            {/* Subtle luxury architectural watermark */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-[#d4af37]/15 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Top Eyebrow Header Bar */}
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5 sm:pb-3 mb-2 sm:mb-5 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                    05 / Priority Advisory Access
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                  [ EMAAR ROYAL CONSULTATION DESK ]
                </span>
              </div>

              {/* Editorial Story & Consultation Form Grid */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 content-around sm:content-center my-2 sm:my-auto">
                
                {/* Left Column: Editorial & Executive Contact Details */}
                <div className="lg:col-span-5 text-left space-y-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] block font-semibold mb-1">
                      CONFIDENTIAL ADVISORY DESK
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#101014] leading-tight">
                      Private Consultation Suite
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 font-sans font-light leading-relaxed">
                    Inquire directly for private viewings, financial structuring, and confidential portfolio advisory regarding <span className="text-[#101014] font-semibold">{property.title}</span>.
                  </p>

                  {/* VIP Advisory Credentials Box */}
                  <div className="hidden sm:block space-y-2.5 pt-1">
                    <div className="bg-[#fcfbf7] border border-[#e8e4da] p-3 rounded-xl flex items-center space-x-3 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-serif font-semibold text-[#101014]">Senior Private Office Desk</div>
                        <div className="text-[10px] text-gray-500 font-sans">Emaar Royal Collection Specialists</div>
                      </div>
                    </div>

                    <div className="bg-[#fcfbf7] border border-[#e8e4da] p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-[#101014] shadow-2xs">
                      <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors flex items-center space-x-1.5">
                        <svg className="w-4 h-4 text-green-600 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp VIP Desk</span>
                      </a>
                      <span className="text-gray-300">•</span>
                      <a href={`tel:${phone}`} className="hover:text-[#d4af37] transition-colors flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{phone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sleek Compact Dossier Form */}
                <div className="lg:col-span-7">
                  <div className="bg-[#fcfbf7] border border-[#e8e4da] p-5 sm:p-6 rounded-2xl shadow-inner relative">
                    <AnimatePresence mode="wait">
                      {status.type === "success" ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-10 px-4 text-center"
                        >
                          <div className="w-14 h-14 bg-[#d4af37] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                            <CheckCircle2 className="w-7 h-7" />
                          </div>
                          <h4 className="text-xl font-serif font-bold text-[#101014] mb-1">Inquiry Transmitted</h4>
                          <p className="text-gray-600 text-xs sm:text-sm font-light max-w-sm mx-auto mb-5">
                            {status.message}
                          </p>
                          <button
                            onClick={() => setStatus({ type: null, message: "" })}
                            className="text-xs font-bold uppercase tracking-widest text-[#101014] hover:text-[#d4af37] transition-colors underline decoration-[#d4af37]/50 underline-offset-4"
                          >
                            Submit Another Inquiry
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form key="form" onSubmit={handleSubmit} className="space-y-3">
                          {status.type === "error" && (
                            <div className="p-3 bg-red-50/80 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 text-xs">
                              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span>{status.message}</span>
                            </div>
                          )}

                          {/* Reference Asset Bar */}
                          <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Asset ID</span>
                            <span className="font-serif font-bold text-[#101014] truncate max-w-[200px] sm:max-w-[300px]">
                              [{property.id}] {property.title}
                            </span>
                          </div>

                          {/* First & Last Name */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label htmlFor="firstName" className="block text-[10px] font-bold uppercase tracking-wider text-[#101014] mb-1">
                                FIRST NAME *
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="e.g. Sheikh"
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 outline-none transition-all text-xs text-[#101014] placeholder-gray-400 font-medium"
                              />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-[10px] font-bold uppercase tracking-wider text-[#101014] mb-1">
                                LAST NAME *
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Alfalasi"
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 outline-none transition-all text-xs text-[#101014] placeholder-gray-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* Email & Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-[#101014] mb-1">
                                CONFIDENTIAL EMAIL *
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="client@familyoffice.com"
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 outline-none transition-all text-xs text-[#101014] placeholder-gray-400 font-medium"
                              />
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-wider text-[#101014] mb-1">
                                DIRECT PHONE / WHATSAPP
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+971 50 000 0000"
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 outline-none transition-all text-xs text-[#101014] placeholder-gray-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* Advisory Notes */}
                          <div>
                            <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-wider text-[#101014] mb-1">
                              ADVISORY BRIEFING NOTES *
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              required
                              rows={2}
                              value={formData.message}
                              onChange={handleChange}
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/10 outline-none transition-all text-xs text-[#101014] placeholder-gray-400 font-medium resize-none"
                            ></textarea>
                          </div>

                          {/* Submit Button */}
                          <div className="pt-1">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3 px-6 rounded-xl bg-[#101014] hover:bg-[#d4af37] text-white hover:text-[#101014] font-bold text-xs tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                                  <span>Transmitting Securely...</span>
                                </>
                              ) : (
                                <>
                                  <span>Transmit Confidential Inquiry</span>
                                  <Send className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

              {/* Bottom Signature Footer Inside Card */}
              <div className="pt-3 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-sans tracking-wider uppercase">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>256-BIT SSL ENCRYPTED & NON-DISCLOSURE PROTECTED</span>
                </span>
                <span>◆ EMAAR PRIVATE CONSULTATION SUITE</span>
              </div>
            </div>
          </motion.div>
    </section>
  );
});

export default PropertyInquiry;
