"use client";

import { useState } from "react";
import { Send, Building2, BedDouble, MapPin, Calculator } from "lucide-react";

export default function ValuationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      inquiryType: "Valuation Request",
      message: `
Property Type: ${formData.get("propertyType")}
Location: ${formData.get("location")}
Bedrooms: ${formData.get("bedrooms")}
Expected Price (AED): ${formData.get("price")}

Additional Notes:
${formData.get("notes")}
      `.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to submit request.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-10 lg:p-14 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-serif text-[#101014] mb-4">Request Received</h3>
        <p className="text-gray-600 text-lg">
          Thank you. One of our senior property consultants will be in touch shortly to discuss your property's valuation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl lg:text-3xl font-serif text-[#101014] mb-1">Get a Free Valuation</h3>
        <p className="text-gray-500 mb-5 text-sm">Enter your property details below for an accurate market assessment.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Full Name</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium" 
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium" 
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Phone Number</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium" 
                placeholder="+971 50 123 4567"
              />
            </div>
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Property Type</label>
      <div 
        className="relative outline-none" 
        tabIndex={0} 
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDropdownOpen(false);
          }
        }}
      >
        <div 
          className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-[#d4af37] focus-within:bg-white focus-within:border-[#d4af37] transition-all font-medium cursor-pointer flex items-center justify-between"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {propertyType}
          </div>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Hidden input for form submission */}
        <input type="hidden" name="propertyType" value={propertyType} />
        
        {/* Custom Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden py-1">
            {["Apartment", "Villa", "Townhouse", "Penthouse", "Plot"].map((type) => (
              <div 
                key={type}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${propertyType === type ? 'bg-[#d4af37]/10 text-[#d4af37] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => {
                  setPropertyType(type);
                  setIsDropdownOpen(false);
                }}
              >
                {type}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Location / Community</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  name="location" 
                  type="text" 
                  required 
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium" 
                  placeholder="e.g. Palm Jumeirah"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Beds</label>
                <div className="relative">
                  <BedDouble className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="bedrooms" 
                    type="number" 
                    min="1"
                    required 
                    className="w-full pl-9 pr-2 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium" 
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Price</label>
                <div className="relative">
                  <Calculator className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="price" 
                    type="text" 
                    className="w-full pl-9 pr-2 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium" 
                    placeholder="e.g. 5M"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#101014] uppercase tracking-wider">Additional Notes (Optional)</label>
            <textarea 
              name="notes" 
              rows={2} 
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-medium resize-none" 
              placeholder="Tell us about any upgrades or special features..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 bg-[#101014] text-white font-medium rounded-xl shadow-lg shadow-[#101014]/20 hover:shadow-[#101014]/30 hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Submitting..." : "Request Free Valuation"}
            {!isSubmitting && <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
