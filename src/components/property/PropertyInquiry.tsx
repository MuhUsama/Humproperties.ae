"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, Phone } from "lucide-react";

import { useSettings } from "@/context/SettingsContext";

interface PropertyInquiryProps {
  property: {
    id: string;
    title: string;
    price: string;
    location: string;
    image?: string;
  };
}

const PropertyInquiry = memo(function PropertyInquiry({ property }: PropertyInquiryProps) {
  const { siteInfo } = useSettings();
  const phone = siteInfo?.contact_phone || "+971 (04) 334 1131";
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const defaultMessage = `Hello, I'm interested in ${property.title}${property.price ? ` (${property.price})` : ""}. Please contact me with more details.`;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: defaultMessage
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
          message: "Thank you! One of our advisors will contact you shortly."
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: defaultMessage
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

  // Short screens (laptops, small phones) tighten spacing so the whole card fits in one frame.
  const labelClass =
    "block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 mb-1 sm:mb-1.5 [@media(max-height:700px)]:sr-only";
  const inputClass =
    "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 [@media(max-height:860px)]:py-2.5 bg-white border border-[#e5e2da] rounded-xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/15 outline-none transition-all text-[13px] sm:text-sm text-[#101014] placeholder-gray-400";

  // WhatsApp and Call buttons, styled for a light card or the dark photo panel.
  const contactLinks = (onDark: boolean) => (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      <a
        href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white py-2.5 sm:py-3 text-sm font-semibold transition-colors"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        WhatsApp
      </a>
      <a
        href={`tel:${phone}`}
        className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 sm:py-3 text-sm font-semibold transition-colors ${
          onDark ? "border-white/25 bg-white/10 text-white hover:bg-white/20" : "border-[#e8e4da] hover:border-[#d4af37]"
        }`}
      >
        <Phone className="w-4 h-4 text-[#d4af37]" />
        Call
      </a>
    </div>
  );

  return (
    <section
      id="consultation-desk"
      className="relative w-full min-h-[calc(100svh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-12 py-3 sm:py-6 scroll-mt-20 overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full bg-white text-[#101014] rounded-3xl border border-[#d4af37]/30 shadow-[0_20px_70px_rgba(0,0,0,0.06)] overflow-hidden lg:grid lg:grid-cols-12 lg:min-h-[70svh]"
      >
        {/* Featured photo: banner on tablets, side panel on desktop (phones show the compact card below) */}
        <div className="hidden md:flex relative flex-col justify-end overflow-hidden text-white bg-[#101014] h-60 p-6 lg:h-auto lg:col-span-5 lg:p-8 xl:p-10 [@media(max-height:860px)]:lg:p-7">
          {property.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.image} alt={property.title} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"></div>
          <div className="relative rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 p-5 xl:p-6 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e6c65a]">You&apos;re enquiring about</span>
            <h4 className="mt-2 font-serif text-2xl lg:text-3xl xl:text-[2.1rem] leading-tight line-clamp-2">{property.title}</h4>
            {property.location && <p className="mt-2 text-sm text-white/90">{property.location}</p>}
            {property.price && <p className="mt-1 text-lg font-semibold text-[#e6c65a]">{property.price}</p>}
            <div className="hidden lg:block mt-5 [text-shadow:none]">{contactLinks(true)}</div>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 xl:p-12 [@media(max-height:860px)]:sm:p-6 [@media(max-height:860px)]:lg:p-8 lg:flex lg:flex-col lg:justify-center">
            <div className="text-center lg:text-left">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                Private Consultation
              </span>
              <h3 className="mt-1.5 sm:mt-2 font-serif text-[1.75rem] leading-tight sm:text-4xl lg:text-[2.75rem] [@media(max-height:860px)]:lg:text-4xl">
                Book a private viewing
              </h3>
              <p className="hidden lg:block mt-2 text-sm text-gray-500 font-light">Leave your details and a senior advisor will contact you personally.</p>
              <div className="mt-3 sm:mt-4 md:hidden inline-flex max-w-full items-center gap-3 rounded-2xl bg-[#fcfbf7] border border-[#e8e4da] p-1.5 pr-4 text-left">
                {property.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={property.image} alt={property.title} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                )}
                <div className={`min-w-0 ${property.image ? "" : "pl-2.5"}`}>
                  <div className="text-xs sm:text-sm font-medium line-clamp-1">{property.title}</div>
                  {property.price && <div className="text-xs sm:text-sm font-semibold text-[#d4af37]">{property.price}</div>}
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 [@media(max-height:860px)]:sm:mt-5">
            <AnimatePresence mode="wait">
              {status.type === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 px-4 text-center"
                >
                  <div className="w-14 h-14 bg-[#d4af37] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-serif font-semibold mb-1">Enquiry sent</h4>
                  <p className="text-gray-600 text-sm font-light max-w-sm mx-auto mb-5">{status.message}</p>
                  <button
                    onClick={() => setStatus({ type: null, message: "" })}
                    className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors underline decoration-[#d4af37]/50 underline-offset-4"
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4 [@media(max-height:860px)]:sm:space-y-3">
                  <input type="hidden" name="propertyId" value={property.id} />

                  {status.type === "error" && (
                    <div className="p-3 bg-red-50/80 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>First name *</label>
                      <input type="text" id="firstName" name="firstName" required autoComplete="given-name" value={formData.firstName} onChange={handleChange} placeholder="First name" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Last name *</label>
                      <input type="text" id="lastName" name="lastName" required autoComplete="family-name" value={formData.lastName} onChange={handleChange} placeholder="Last name" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                    <div>
                      <label htmlFor="email" className={labelClass}>Email *</label>
                      <input type="email" id="email" name="email" required autoComplete="email" value={formData.email} onChange={handleChange} placeholder="Email address" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone / WhatsApp</label>
                      <input type="tel" id="phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} placeholder="Phone / WhatsApp" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass} resize-none h-[4.75rem] sm:h-24 [@media(max-height:860px)]:h-[4.5rem]`}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-3.5 rounded-xl bg-[#101014] hover:bg-[#d4af37] text-white hover:text-[#101014] font-bold text-xs tracking-[0.2em] uppercase shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send enquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            </div>
            {/* Direct contact (phones and tablets; desktop shows it in the side panel) */}
            <div className="lg:hidden">
              <div className="mt-3 sm:mt-5 [@media(max-height:860px)]:sm:mt-4 [@media(max-height:700px)]:hidden flex items-center gap-3 text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest">
                <span className="flex-1 h-px bg-[#e8e4da]"></span>
                or reach us directly
                <span className="flex-1 h-px bg-[#e8e4da]"></span>
              </div>
              <div className="mt-3 sm:mt-4 [@media(max-height:860px)]:sm:mt-3">{contactLinks(false)}</div>
            </div>
        </div>
      </motion.div>
    </section>
  );
});

export default PropertyInquiry;
