"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function CustomSelect({ 
  name, 
  value, 
  options, 
  onChange,
  placeholder = "Select an option",
  required = false
}: { 
  name?: string;
  value: string; 
  options: string[]; 
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} required={required} />}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 rounded-xl border flex items-center justify-between text-left transition-all ${
          isOpen 
            ? "bg-white border-brand-gold ring-1 ring-brand-gold" 
            : "bg-gray-50 border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={`font-medium ${value ? "text-brand-black" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-gold" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 transition-colors hover:bg-brand-gold/5 ${
                value === opt ? "bg-brand-gold/10 text-brand-gold font-bold" : "text-brand-black font-medium"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
