"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowDownUp } from "lucide-react";

export interface FilterState {
  search: string;
  purpose: string;
  city: string;
  priceRange: string;
  areaRange: string;
}

interface PropertyFilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  availableCities?: string[];
  lockPurpose?: boolean;
}

export default function PropertyFilterBar({ onFilterChange, initialFilters, availableCities, lockPurpose = false }: PropertyFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || "",
    purpose: initialFilters?.purpose || "Buy",
    city: initialFilters?.city || "All Cities",
    priceRange: initialFilters?.priceRange || "Any Price",
    areaRange: initialFilters?.areaRange || "Any Area (sqft)"
  });

  // Sync internal state when external initialFilters changes (like URL param changes)
  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));
    }
  }, [initialFilters]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setOpenDropdown(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter("search", e.target.value);
  };

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) setOpenDropdown(null);
    else setOpenDropdown(name);
  };

  const DropdownItem = ({ label, type }: { label: string, type: keyof FilterState }) => (
    <div 
      className={`px-4 py-2 hover:bg-brand-gold/10 cursor-pointer text-sm ${filters[type] === label ? 'font-bold text-brand-gold' : 'text-gray-700'}`}
      onClick={() => updateFilter(type, label)}
    >
      {label}
    </div>
  );

  return (
    <div className="w-full mt-8 md:mt-12 sticky top-24 md:top-28 z-40" ref={filterRef}>
      
      {/* Mobile Filter Toggle & Sort Row */}
      <div className="md:hidden flex justify-between items-center bg-white/95 backdrop-blur-xl shadow-md rounded-xl p-2 border border-[#d4af37]/30 mb-2">
        <button 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex-1 flex items-center justify-center gap-2 text-brand-black font-semibold py-2 transition-colors hover:text-[#d4af37]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          {isMobileFilterOpen ? "Close Filters" : "Filters"}
        </button>
        <button className="flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-semibold ml-2 hover:bg-[#d4af37] transition-colors">
          <ArrowDownUp className="w-4 h-4" />
          Newest
        </button>
      </div>

      {/* Main Filter Bar Container */}
      <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-[#d4af37]/30 flex-col md:flex-row items-center w-full min-h-[80px] divide-y md:divide-y-0 md:divide-x divide-gray-100/80 overflow-visible text-sm relative transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.2)] ${isMobileFilterOpen ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Purpose Dropdown */}
        <div 
          className={`relative flex-none px-6 py-4 md:py-0 w-full md:w-[150px] flex flex-col justify-center h-full md:min-h-[72px] ${lockPurpose ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50 transition-colors'}`} 
          onClick={() => !lockPurpose && toggleDropdown('purpose')}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-brand-black">Purpose</span>
            {!lockPurpose && (
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${openDropdown === "purpose" ? "rotate-180" : ""}`} />
            )}
          </div>
          <span className="text-gray-500 font-medium text-xs mt-0.5 line-clamp-1">{filters.purpose}</span>
          
          {!lockPurpose && openDropdown === 'purpose' && (
            <div className="absolute top-[80px] left-0 w-full bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <DropdownItem label="Buy" type="purpose" />
              <DropdownItem label="Rent" type="purpose" />
            </div>
          )}
        </div>

        {/* City Dropdown */}
        <div className="relative flex-none px-6 py-4 md:py-0 w-full md:w-[180px] flex flex-col justify-center cursor-pointer hover:bg-gray-50 transition-colors h-full md:min-h-[72px]" onClick={() => toggleDropdown('city')}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-brand-black">City</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${openDropdown === "city" ? "rotate-180" : ""}`} />
          </div>
          <span className="text-gray-400 text-xs mt-0.5 line-clamp-1">{filters.city}</span>
          
          {openDropdown === 'city' && (
            <div className="absolute top-[80px] left-0 w-full bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 max-h-64 overflow-y-auto">
              <DropdownItem label="All Cities" type="city" />
              {(availableCities && availableCities.length > 0 
                ? availableCities 
                : ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]
              ).map((cityName) => (
                <DropdownItem key={cityName} label={cityName} type="city" />
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-grow w-full md:w-auto px-6 py-4 md:py-0 flex items-center h-full md:min-h-[72px]">
          <input 
            type="text"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search by Area or Building..."
            className="w-full h-full bg-transparent outline-none text-brand-black placeholder:text-gray-400 py-2"
          />
        </div>

        {/* Price Range Dropdown */}
        <div className="relative flex-none px-6 py-4 md:py-0 w-full md:w-[180px] flex flex-col justify-center cursor-pointer hover:bg-gray-50 transition-colors h-full md:min-h-[72px]" onClick={() => toggleDropdown('price')}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-brand-black">Price Range</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="text-gray-400 text-xs mt-0.5 line-clamp-1">{filters.priceRange}</span>
          
          {openDropdown === 'price' && (
            <div className="absolute top-[80px] left-0 w-[200px] bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <DropdownItem label="Any Price" type="priceRange" />
              <DropdownItem label="Under 10M AED" type="priceRange" />
              <DropdownItem label="10M - 25M AED" type="priceRange" />
              <DropdownItem label="Above 25M AED" type="priceRange" />
            </div>
          )}
        </div>

        {/* Area Range Dropdown */}
        <div className="relative flex-none px-6 py-4 md:py-0 w-full md:w-[180px] flex flex-col justify-center cursor-pointer hover:bg-gray-50 transition-colors h-full md:min-h-[72px]" onClick={() => toggleDropdown('area')}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-brand-black">Area Range</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="text-gray-400 text-xs mt-0.5 line-clamp-1">{filters.areaRange}</span>
          
          {openDropdown === 'area' && (
            <div className="absolute top-[80px] left-0 w-[200px] bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <DropdownItem label="Any Area (sqft)" type="areaRange" />
              <DropdownItem label="Under 5,000 sqft" type="areaRange" />
              <DropdownItem label="5,000 - 15,000 sqft" type="areaRange" />
              <DropdownItem label="Above 15,000 sqft" type="areaRange" />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Title & Actions Row */}
      <div className="hidden md:flex mt-6 justify-end w-full">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-brand-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-gold hover:text-brand-black transition-colors">
            <ArrowDownUp className="w-4 h-4" />
            Newest
          </button>
        </div>
      </div>
    </div>
  );
}
