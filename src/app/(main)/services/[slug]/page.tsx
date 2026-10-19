"use client";

import React, { use, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import MortgageCalculator from "@/components/services/MortgageCalculator";
import MortgagePopularServices from "@/components/services/MortgagePopularServices";
import MortgageWhyChooseUs from "@/components/services/MortgageWhyChooseUs";
import MortgageCTA from "@/components/services/MortgageCTA";
import MortgageContent from "@/components/services/MortgageContent";
import RelocationProcess from "@/components/services/RelocationProcess";
import RelocationFeatures from "@/components/services/RelocationFeatures";
import RelocationWhyUs from "@/components/services/RelocationWhyUs";
import RelocationCTA from "@/components/services/RelocationCTA";
import InteriorProcess from "@/components/services/InteriorProcess";
import InteriorFeatures from "@/components/services/InteriorFeatures";
import InteriorWhyUs from "@/components/services/InteriorWhyUs";
import InteriorCTA from "@/components/services/InteriorCTA";
import BrokerageProcess from "@/components/services/BrokerageProcess";
import BrokerageFeatures from "@/components/services/BrokerageFeatures";
import BrokerageWhyUs from "@/components/services/BrokerageWhyUs";
import BrokerageCTA from "@/components/services/BrokerageCTA";
import ManagementProcess from "@/components/services/ManagementProcess";
import ManagementFeatures from "@/components/services/ManagementFeatures";
import ManagementWhyUs from "@/components/services/ManagementWhyUs";
import ManagementCTA from "@/components/services/ManagementCTA";
import DevelopmentProcess from "@/components/services/DevelopmentProcess";
import DevelopmentFeatures from "@/components/services/DevelopmentFeatures";
import DevelopmentWhyUs from "@/components/services/DevelopmentWhyUs";
import DevelopmentCTA from "@/components/services/DevelopmentCTA";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";
import { useSettings } from "@/context/SettingsContext";

// Using a basic interface to avoid TypeScript errors
interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const serviceData: Record<string, { title: string; subtitle: string; desc: string }> = {
  "mortgage-services": {
    title: "Mortgage Services",
    subtitle: "Tailored Financial Solutions",
    desc: "Expert financial guidance and bespoke mortgage solutions tailored for high-net-worth individuals, ensuring seamless acquisition of prime assets."
  },
  "relocation-services": {
    title: "Relocation Services",
    subtitle: "Seamless Transition Management",
    desc: "Comprehensive end-to-end relocation assistance, providing a seamless transition to your new luxury residence in Dubai with absolute discretion."
  },
  "property-management": {
    title: "Property Management",
    subtitle: "Elite Asset Care",
    desc: "Elite management of your premium real estate portfolio, maximizing yields while maintaining your properties in pristine, turnkey condition."
  },
  "property-brokerage": {
    title: "Property Brokerage",
    subtitle: "Exclusive Access & Advisory",
    desc: "Exclusive access to off-market luxury listings and unparalleled advisory in elite property transactions and strategic acquisitions."
  },
  "commercial-services": {
    title: "Commercial Services",
    subtitle: "Strategic Corporate Real Estate",
    desc: "Strategic advisory and bespoke brokerage for prime commercial real estate investments, corporate headquarters, and high-yield leasing."
  },
  "industrial-services": {
    title: "Industrial Services",
    subtitle: "Specialized Infrastructure",
    desc: "Specialized real estate solutions for industrial acquisitions, logistics hubs, and large-scale operational facilities across the UAE."
  },
  "interior-design-and-fit-out": {
    title: "Interior Design & Fit Out",
    subtitle: "World-Class Aesthetics",
    desc: "World-class interior architecture and bespoke fit-out services designed to elevate your living spaces to the pinnacle of luxury."
  },
  "real-estate-development": {
    title: "Real Estate Development",
    subtitle: "Visionary Architectural Execution",
    desc: "Visionary development consulting, navigating from land acquisition and master planning to the architectural execution of landmark projects."
  }
};

const serviceKeyMap: Record<string, string> = {
  "mortgage-services": "services_mortgage",
  "relocation-services": "services_relocation",
  "property-management": "services_management",
  "property-brokerage": "services_brokerage",
  "commercial": "services_commercial",
  "industrial": "services_industrial",
  "interior-design-and-fit-out": "services_interiordesign",
  "real-estate-development": "services_development",
};

export default function ServiceDetailPage({ params }: ServicePageProps) {
  // Unwrapping params using React.use() as required in Next.js 15+
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { isPageHidden } = useSettings();

  const settingKey = serviceKeyMap[slug] || `services_${slug}`;
  const isHidden = isPageHidden("services") || isPageHidden(settingKey) || isPageHidden(slug);

  const service = serviceData[slug] || { title: "Service Details", subtitle: "Premium Service", desc: "Details coming soon." };

  const hasCustomComponents = ["mortgage-services", "relocation-services", "interior-design-and-fit-out", "property-brokerage", "property-management", "real-estate-development"].includes(slug);
  
  const serviceFaqs = getFaqsByCategory(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  if (isHidden) {
    return (
      <main className="min-h-screen bg-[#faf9f7] pt-32 pb-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3">Service Currently Unavailable</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            This service page is currently offline or hidden by management. Please explore our other luxury real estate services.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#111111] text-white hover:bg-[#d4af37] hover:text-black transition-colors rounded-full font-semibold text-xs uppercase tracking-widest"
          >
            Explore Other Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-[#faf9f7] pt-20 ${hasCustomComponents ? '' : 'pb-20'}`}>

      {/* Hero Section - Matching Commercial/Industrial Style */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-12 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent opacity-50 z-0"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative z-20 flex flex-col items-center"
          >
            <div className="inline-flex items-center space-x-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
                M. Alfalasi Private Advisory
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
              <span className="text-[#d4af37]">{service.title.split(' ')[0]}</span> {service.title.split(' ').slice(1).join(' ')}
            </h1>
            
            <p className="text-gray-300 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              {service.desc}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full mx-auto px-4 md:px-6 lg:px-12 max-w-[1400px]">

        {/* Dummy Content Section for Future Updates */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Service Details Placeholder (For services without custom pages yet) */}
          {!hasCustomComponents && (
            <motion.div variants={staggerContainer} className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp} className="bg-white p-10 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 h-full">
                <h2 className="text-2xl font-serif text-[#101014] mb-6">Our Approach</h2>
                <p className="text-gray-600 leading-relaxed font-light mb-8">
                  We take a highly personalized approach to {service.title.toLowerCase()}, ensuring that every detail is executed with precision. Our experienced advisory team operates with discretion, efficiency, and a commitment to exceeding expectations.
                </p>
                
                <h3 className="text-lg font-bold text-[#101014] mb-4 uppercase tracking-wider text-sm">Key Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Tailored advisory specific to your portfolio</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Access to exclusive, off-market opportunities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Seamless, end-to-end execution</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-[#101014] p-10 rounded-[2rem] text-white flex flex-col justify-center h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-serif mb-4">Require specialized assistance?</h2>
                  <p className="text-gray-400 font-light mb-8 leading-relaxed">
                    Contact our dedicated luxury advisory team today to discuss how we can assist you with {service.title.toLowerCase()}.
                  </p>
                  <Link href="/contact" className="inline-block bg-[#d4af37] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#b5952f] transition-colors shadow-lg shadow-[#d4af37]/20">
                    Schedule a Consultation
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Mortgage Specific Components - Rendered FULL WIDTH outside the constrained container */}
      {slug === "mortgage-services" && (
        <div className="w-full">
          <MortgageCalculator />
          <MortgagePopularServices />
          <MortgageWhyChooseUs />
          <MortgageContent />
          <MortgageCTA />
        </div>
      )}

      {/* Relocation Specific Components */}
      {slug === "relocation-services" && (
        <div className="w-full">
          <RelocationProcess />
          <RelocationFeatures />
          <RelocationWhyUs />
          <RelocationCTA />
        </div>
      )}

      {/* Interior Design Specific Components */}
      {slug === "interior-design-and-fit-out" && (
        <div className="w-full">
          <InteriorProcess />
          <InteriorFeatures />
          <InteriorWhyUs />
          <InteriorCTA />
        </div>
      )}

      {/* Property Brokerage Specific Components */}
      {slug === "property-brokerage" && (
        <div className="w-full">
          <BrokerageProcess />
          <BrokerageFeatures />
          <BrokerageWhyUs />
          <BrokerageCTA />
        </div>
      )}

      {/* Property Management Specific Components */}
      {slug === "property-management" && (
        <div className="w-full">
          <ManagementProcess />
          <ManagementFeatures />
          <ManagementWhyUs />
          <ManagementCTA />
        </div>
      )}

      {/* Real Estate Development Specific Components */}
      {slug === "real-estate-development" && (
        <div className="w-full">
          <DevelopmentProcess />
          <DevelopmentFeatures />
          <DevelopmentWhyUs />
          <DevelopmentCTA />
        </div>
      )}

      {/* Dynamic FAQs based on Service Slug */}
      <FaqSection faqs={serviceFaqs} title={`${service.title} FAQs`} subtitle={`Frequently asked questions about our ${service.title.toLowerCase()}.`} />
    </main>
  );
}
