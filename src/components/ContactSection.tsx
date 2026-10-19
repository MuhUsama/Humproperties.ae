"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

const ContactSection = memo(function ContactSection() {
  const { siteInfo } = useSettings();
  const phone = siteInfo?.contact_phone || "+971 (04) 334 1131";
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  const address = siteInfo?.contact_address || "Office 321, Al Nasr Plaza\nOud Metha, Dubai, UAE";
  return (
    <section id="contact" className="py-4 lg:[@media(max-height:800px)]:py-4 lg:py-10 xl:py-20 bg-gray-50 border-t border-gray-200 min-h-[calc(100svh-5rem)] lg:h-[calc(100svh-5rem)] flex flex-col justify-center overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center mb-6 sm:mb-8 lg:[@media(max-height:800px)]:mb-4 lg:mb-8 xl:mb-16"
        >
          <motion.span variants={fadeInUp} className="block text-brand-gold font-semibold tracking-widest uppercase text-[10px] sm:text-xs mb-3 lg:[@media(max-height:800px)]:mb-1 lg:mb-4">
            Get in Touch
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-black mb-3 lg:[@media(max-height:800px)]:mb-1 lg:mb-6">
            Contact an Agent
          </motion.h2>
          <motion.p variants={fadeInUp} className="block text-sm lg:text-sm xl:text-base text-gray-600 max-w-2xl mx-auto px-4 lg:px-0 lg:[@media(max-height:800px)]:hidden">
            Ready to find your dream property? Fill out the form below and one of our luxury real estate specialists will get back to you shortly.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-8 xl:gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-2/3 bg-white p-6 sm:p-8 lg:[@media(max-height:800px)]:p-6 lg:p-8 xl:p-12 rounded-[1.5rem] lg:rounded-3xl shadow-xl border border-gray-100"
          >
            <form 
              className="space-y-3 lg:space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                
                if (submitBtn) {
                  submitBtn.innerText = 'Sending...';
                  submitBtn.disabled = true;
                }

                try {
                  const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
                    method: "POST",
                    headers: { 
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                      Name: `${formData.get('firstName')} ${formData.get('lastName')}`,
                      Email: formData.get('email'),
                      Phone: formData.get('phone'),
                      Message: formData.get('message'),
                      _subject: "New Website Lead: Mohd. Alfalasi Real Estate"
                    })
                  });
                  
                  if (response.ok) {
                    toast.success("Message sent successfully! We will contact you soon.");
                    form.reset();
                  } else {
                    toast.error("Failed to send message. Please try again.");
                  }
                } catch (error) {
                  toast.error("An error occurred. Please try again later.");
                } finally {
                  if (submitBtn) {
                    submitBtn.innerText = 'Send Message';
                    submitBtn.disabled = false;
                  }
                }
              }}
            >
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-[10px] sm:text-xs font-bold text-brand-black uppercase tracking-widest mb-1 lg:mb-2 ml-1">First Name</label>
                  <input type="text" id="firstName" name="firstName" required className="w-full px-4 py-3 sm:py-4 lg:px-5 lg:py-3 xl:py-4 text-sm lg:text-sm xl:text-base bg-gray-50/50 border border-gray-200 rounded-xl lg:rounded-2xl focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-brand-black placeholder-gray-400" placeholder="e.g. John" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[10px] sm:text-xs font-bold text-brand-black uppercase tracking-widest mb-1 lg:mb-2 ml-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" required className="w-full px-4 py-3 sm:py-4 lg:px-5 lg:py-3 xl:py-4 text-sm lg:text-sm xl:text-base bg-gray-50/50 border border-gray-200 rounded-xl lg:rounded-2xl focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-brand-black placeholder-gray-400" placeholder="e.g. Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="email" className="block text-[10px] sm:text-xs font-bold text-brand-black uppercase tracking-widest mb-1 lg:mb-2 ml-1">Email</label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-3 sm:py-4 lg:px-5 lg:py-3 xl:py-4 text-sm lg:text-sm xl:text-base bg-gray-50/50 border border-gray-200 rounded-xl lg:rounded-2xl focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-brand-black placeholder-gray-400" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[10px] sm:text-xs font-bold text-brand-black uppercase tracking-widest mb-1 lg:mb-2 ml-1">Phone</label>
                  <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 sm:py-4 lg:px-5 lg:py-3 xl:py-4 text-sm lg:text-sm xl:text-base bg-gray-50/50 border border-gray-200 rounded-xl lg:rounded-2xl focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-brand-black placeholder-gray-400" placeholder="+971 50..." />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-[10px] sm:text-xs font-bold text-brand-black uppercase tracking-widest mb-1 lg:mb-2 ml-1">Message</label>
                <textarea id="message" name="message" required className="w-full h-32 lg:[@media(max-height:800px)]:h-16 lg:h-24 xl:h-32 px-4 py-3 sm:py-4 lg:[@media(max-height:800px)]:py-2 lg:px-5 lg:py-3 xl:py-4 text-sm lg:text-sm xl:text-base bg-gray-50/50 border border-gray-200 rounded-xl lg:rounded-2xl focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-brand-black placeholder-gray-400 resize-none" placeholder="I am interested in..."></textarea>
              </div>
              <button type="submit" className="w-full bg-brand-gold hover:bg-brand-black text-white font-semibold tracking-wide py-4 sm:py-5 lg:[@media(max-height:800px)]:py-3 lg:py-4 text-sm sm:text-base rounded-xl lg:rounded-2xl transition-all shadow-[0_10px_20px_rgba(196,162,89,0.3)] hover:shadow-none hover:-translate-y-1">
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info Sidebar - Highly Compact on Mobile */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3"
          >
            <motion.div 
              animate={{ 
                boxShadow: ['0px 0px 0px rgba(196,162,89,0)', '0px 20px 40px rgba(196,162,89,0.25)', '0px 0px 0px rgba(196,162,89,0)'],
                y: [0, -6, 0],
                borderColor: ['rgba(255,255,255,0.05)', 'rgba(196,162,89,0.4)', 'rgba(255,255,255,0.05)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-brand-black text-white p-6 sm:p-8 lg:[@media(max-height:800px)]:p-6 lg:p-6 xl:p-8 rounded-[1.5rem] lg:rounded-3xl border relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-[50px] rounded-full animate-pulse"></div>
              <h3 className="hidden lg:block text-xl xl:text-2xl font-serif mb-6 xl:mb-8 text-brand-gold relative z-10 lg:[@media(max-height:800px)]:mb-2">Contact Details</h3>
              
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-6">
                <a href="https://maps.google.com/?q=Al+Nasr+Plaza,+Oud+Metha,+Dubai" target="_blank" rel="noopener noreferrer" className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left lg:space-x-4 group transition-all relative z-10">
                  <div className="relative mb-1 lg:mb-0 lg:mt-1">
                    <div className="absolute inset-0 rounded-full border border-brand-gold/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="bg-white/5 group-hover:bg-brand-gold p-2 lg:p-4 rounded-full text-brand-gold group-hover:text-brand-black transition-colors relative z-10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[10px] sm:text-xs lg:text-lg lg:mb-1 group-hover:text-brand-gold transition-colors">Location</p>
                    <p className="hidden lg:block text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors whitespace-pre-line">
                      {address}
                    </p>
                  </div>
                </a>
                
                <a href={`tel:${phone}`} className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left lg:space-x-4 group transition-all relative z-10">
                  <div className="relative mb-1 lg:mb-0 lg:mt-1">
                    <div className="absolute inset-0 rounded-full border border-brand-gold/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1s' }}></div>
                    <div className="bg-white/5 group-hover:bg-brand-gold p-2 lg:p-4 rounded-full text-brand-gold group-hover:text-brand-black transition-colors relative z-10 flex items-center justify-center">
                      <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[10px] sm:text-xs lg:text-lg lg:mb-1 group-hover:text-brand-gold transition-colors">Call</p>
                    <p className="hidden lg:block text-gray-400 text-sm group-hover:text-white transition-colors">
                      {phone}
                    </p>
                  </div>
                </a>
                
                <a href={`mailto:${email}`} className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left lg:space-x-4 group transition-all relative z-10">
                  <div className="relative mb-1 lg:mb-0 lg:mt-1">
                    <div className="absolute inset-0 rounded-full border border-brand-gold/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '2s' }}></div>
                    <div className="bg-white/5 group-hover:bg-brand-gold p-2 lg:p-4 rounded-full text-brand-gold group-hover:text-brand-black transition-colors relative z-10 flex items-center justify-center">
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[10px] sm:text-xs lg:text-lg lg:mb-1 group-hover:text-brand-gold transition-colors">Email</p>
                    <p className="hidden lg:block text-gray-400 text-sm group-hover:text-white transition-colors">
                      {email}
                    </p>
                  </div>
                </a>
              </div>

              <div className="hidden lg:block lg:[@media(max-height:800px)]:hidden mt-10 pt-8 border-t border-white/10 relative z-10">
                <p className="font-semibold text-lg mb-2 text-brand-gold">Business Hours</p>
                <div className="flex justify-between text-gray-400 text-sm mb-2">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Saturday - Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
