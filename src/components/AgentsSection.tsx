"use client";

import { memo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const AgentsSection = memo(function AgentsSection() {
  const { scrollY } = useScroll();
  const teamParallaxY = useTransform(scrollY, [2000, 4500], [0, 500]);
  const [dbAgents, setDbAgents] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/agents")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDbAgents(data.data);
        }
      })
      .catch(err => console.error("Error fetching agents:", err))
      .finally(() => setLoaded(true));
  }, []);

  // Automatically hide section completely when no team members have been added
  if (!loaded || dbAgents.length === 0) {
    return null;
  }

  const displayAgents = dbAgents;
  
  // Only duplicate and animate if we have 4 or more agents to ensure it looks good
  const isMarquee = displayAgents.length >= 4;
  const agents = isMarquee ? [...displayAgents, ...displayAgents, ...displayAgents] : displayAgents;

  return (
    <section id="agents" className="py-6 md:py-10 bg-brand-black relative overflow-hidden h-[calc(100svh-5rem)] flex flex-col justify-center">
      {/* Giant outline text */}
      <motion.div 
        style={{ y: teamParallaxY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-[100px] md:text-[250px] font-bold text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter"
      >
        EXPERTS
      </motion.div>

      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-brand-gold/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full mx-auto px-6 lg:px-12 mb-4 md:mb-6 flex justify-between items-end relative z-10 flex-shrink-0">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-2xl"
        >
          <motion.span variants={fadeInUp} className="flex items-center text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4">
            <span className="w-8 h-[2px] bg-brand-gold mr-4"></span>
            Our Team
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Meet Our Luxury Experts
          </motion.h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="hidden md:flex space-x-3"
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </div>
          <div className="w-12 h-12 rounded-full border border-brand-gold bg-brand-gold flex items-center justify-center text-white shadow-[0_0_15px_rgba(196,162,89,0.4)] cursor-pointer hover:bg-brand-gold-light transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative z-10 w-full overflow-hidden py-2 md:py-4 flex-1 min-h-0 flex flex-col justify-center pb-4 md:pb-8">
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1rem)); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className={`flex w-max gap-8 pl-6 lg:pl-12 items-stretch h-full ${isMarquee ? 'animate-marquee' : ''}`}>
          {agents.map((agent, idx) => (
            <div 
              key={idx}
              className="relative w-[75vw] sm:w-[300px] md:w-[320px] lg:w-[350px] xl:w-[380px] h-full rounded-[2rem] overflow-hidden group cursor-pointer shrink-0 border border-white/10 shadow-2xl"
            >
              <img 
                src={agent.image} 
                alt={agent.name} 
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                {/* Name and Role - shifts up on hover */}
                <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-16">
                  <h3 className="text-2xl xl:text-3xl font-serif text-white mb-2">{agent.name}</h3>
                  <p className="text-brand-gold font-medium text-xs tracking-widest uppercase">{agent.role}</p>
                </div>
                
                {/* Contact Action Bar - slides up from bottom on hover */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-white/5 backdrop-blur-xl border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-semibold tracking-wide uppercase">Get In Touch</p>
                    <div className="flex space-x-3">
                      <a 
                        href={`https://wa.me/${agent.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                        title="WhatsApp"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                      </a>
                      <a 
                        href={`mailto:${agent.email}`}
                        className="w-10 h-10 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(196,162,89,0.4)]"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default AgentsSection;
