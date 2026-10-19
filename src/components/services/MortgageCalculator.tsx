"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

const CURRENCY_RATES: Record<string, number> = {
  AED: 1,
  USD: 3.67,
  EUR: 4.00,
};

export default function MortgageCalculator() {
  const { currency } = useSettings();
  const rate = CURRENCY_RATES[currency] || 1;

  // Stored base values in AED
  const [propertyPriceAED, setPropertyPriceAED] = useState<number>(1500000);
  const [downPaymentAED, setDownPaymentAED] = useState<number>(375000); // 25% default
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(4.25);
  const [loadingRate, setLoadingRate] = useState<boolean>(true);

  // Active numerical values converted to the selected currency
  const currentPrice = useMemo(() => Math.round(propertyPriceAED / rate), [propertyPriceAED, rate]);
  const currentDownPayment = useMemo(() => Math.round(downPaymentAED / rate), [downPaymentAED, rate]);

  // Dynamic slider bounds based on currency
  const minPrice = useMemo(() => Math.round(300000 / rate), [rate]);
  const maxPrice = useMemo(() => Math.round(50000000 / rate), [rate]);
  const priceStep = useMemo(() => (currency === "AED" ? 50000 : 10000), [currency]);
  const downPaymentStep = useMemo(() => (currency === "AED" ? 10000 : 2500), [currency]);

  // Raw text inputs to allow comfortable typing without cursor jumps
  const [priceInput, setPriceInput] = useState<string>("1,500,000");
  const [downPaymentInput, setDownPaymentInput] = useState<string>("375,000");
  const [termInput, setTermInput] = useState<string>("25");
  const [rateInput, setRateInput] = useState<string>("4.25");

  // Sync inputs whenever the user changes the site currency
  useEffect(() => {
    setPriceInput(Math.round(propertyPriceAED / rate).toLocaleString());
    setDownPaymentInput(Math.round(downPaymentAED / rate).toLocaleString());
  }, [currency]);

  // Fetch initial interest rate from admin settings if configured
  useEffect(() => {
    fetch("/api/settings?key=mortgage_interest_rate")
      .then((res) => res.json())
      .then((data) => {
        if (data.value && !isNaN(parseFloat(data.value))) {
          const rateVal = parseFloat(data.value);
          setInterestRate(rateVal);
          setRateInput(rateVal.toString());
        }
        setLoadingRate(false);
      })
      .catch(() => setLoadingRate(false));
  }, []);

  // Sync formatted strings when state changes from slider
  const updatePrice = (valInCurrentCurrency: number) => {
    const clamped = Math.max(minPrice, Math.min(maxPrice, valInCurrentCurrency));
    const newAED = clamped * rate;
    setPropertyPriceAED(newAED);
    setPriceInput(clamped.toLocaleString());
    // Auto adjust downpayment if it exceeds price
    if (downPaymentAED > newAED) {
      setDownPaymentAED(newAED);
      setDownPaymentInput(clamped.toLocaleString());
    }
  };

  const updateDownPayment = (valInCurrentCurrency: number) => {
    const clamped = Math.max(0, Math.min(currentPrice, valInCurrentCurrency));
    setDownPaymentAED(clamped * rate);
    setDownPaymentInput(clamped.toLocaleString());
  };

  const updateDownPaymentPercent = (pct: number) => {
    const calculatedAED = Math.round((propertyPriceAED * pct) / 100);
    setDownPaymentAED(calculatedAED);
    const inCurr = Math.round(calculatedAED / rate);
    setDownPaymentInput(inCurr.toLocaleString());
  };

  const updateTerm = (val: number) => {
    const clamped = Math.max(1, Math.min(30, val));
    setLoanTerm(clamped);
    setTermInput(clamped.toString());
  };

  const updateRate = (val: number) => {
    const clamped = Math.max(0.1, Math.min(15, parseFloat(val.toFixed(2))));
    setInterestRate(clamped);
    setRateInput(clamped.toString());
  };

  // Calculations
  const loanAmount = Math.max(0, currentPrice - currentDownPayment);
  const downPaymentPercent = propertyPriceAED > 0 
    ? Math.min(100, Math.max(0, Math.round((downPaymentAED / propertyPriceAED) * 100))) 
    : 0;

  const monthlyPayment = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    if (P <= 0 || n <= 0) return 0;
    if (r === 0) return P / n;
    return (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, interestRate, loanTerm]);

  const totalPayment = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPayment > loanAmount ? totalPayment - loanAmount : 0;

  // Donut chart geometry (Generous sizing to avoid text collision)
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const principalShare = totalPayment > 0 ? loanAmount / totalPayment : 0.7;
  const principalStroke = principalShare * circumference;
  const interestStroke = (1 - principalShare) * circumference;

  const fmt = (n: number) => Math.round(n).toLocaleString();

  const formatCompact = (val: number) => {
    if (val >= 1000000) {
      const m = (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1);
      return `${m}M`;
    }
    if (val >= 1000) {
      return `${Math.round(val / 1000)}K`;
    }
    return val.toLocaleString();
  };

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#b5952f]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#94761b]">
              Interactive Financial Planning
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111116] tracking-tight">
            UAE Mortgage Calculator
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Customize your property price, down payment, loan tenure, and editable interest rate to view real-time monthly repayment and financing breakdown.
          </p>
        </motion.div>

        {/* Calculator Main Box */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col lg:flex-row w-full bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden"
        >
          {/* ================= LEFT SIDE: EDITABLE INPUTS & SLIDERS ================= */}
          <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between space-y-6 sm:space-y-8">
            
            {/* 1. Property Value */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wide uppercase">
                  Property Value
                </label>
                <div className="flex items-center bg-[#faf9f7] border-2 border-gray-200 focus-within:border-[#d4af37] focus-within:bg-white rounded-xl px-3 py-1.5 transition-all">
                  <span className="text-xs sm:text-sm font-bold text-[#94761b] mr-1.5">{currency}</span>
                  <input
                    type="text"
                    value={priceInput}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, "");
                      setPriceInput(clean ? Number(clean).toLocaleString() : "");
                      if (clean) {
                        const num = Number(clean);
                        const newAED = num * rate;
                        setPropertyPriceAED(newAED);
                        if (downPaymentAED > newAED) {
                          setDownPaymentAED(newAED);
                          setDownPaymentInput(num.toLocaleString());
                        }
                      }
                    }}
                    onBlur={() => {
                      const num = Number(priceInput.replace(/[^0-9]/g, ""));
                      updatePrice(num || minPrice);
                    }}
                    className="w-32 sm:w-36 text-right font-serif font-bold text-base sm:text-lg text-gray-900 bg-transparent outline-none tabular-nums"
                  />
                </div>
              </div>

              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={priceStep}
                value={currentPrice}
                onChange={(e) => updatePrice(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#d4af37] bg-gray-200"
              />

              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>{currency} {formatCompact(minPrice)}</span>
                <span>{currency} {formatCompact(maxPrice)}</span>
              </div>
            </div>

            {/* 2. Down Payment */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wide uppercase">
                    Down Payment
                  </label>
                  <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#94761b] text-xs font-bold tabular-nums">
                    {downPaymentPercent}%
                  </span>
                </div>
                <div className="flex items-center bg-[#faf9f7] border-2 border-gray-200 focus-within:border-[#d4af37] focus-within:bg-white rounded-xl px-3 py-1.5 transition-all">
                  <span className="text-xs sm:text-sm font-bold text-[#94761b] mr-1.5">{currency}</span>
                  <input
                    type="text"
                    value={downPaymentInput}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, "");
                      setDownPaymentInput(clean ? Number(clean).toLocaleString() : "");
                      if (clean) {
                        const num = Number(clean);
                        const newAED = Math.min(propertyPriceAED, num * rate);
                        setDownPaymentAED(newAED);
                      }
                    }}
                    onBlur={() => {
                      const num = Number(downPaymentInput.replace(/[^0-9]/g, ""));
                      updateDownPayment(num || 0);
                    }}
                    className="w-32 sm:w-36 text-right font-serif font-bold text-base sm:text-lg text-gray-900 bg-transparent outline-none tabular-nums"
                  />
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={currentPrice}
                step={downPaymentStep}
                value={currentDownPayment}
                onChange={(e) => updateDownPayment(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#111116] bg-gray-200"
              />

              {/* Quick % Selection Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-gray-500">0%</span>
                <div className="flex items-center gap-1.5">
                  {[20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => updateDownPaymentPercent(pct)}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                        downPaymentPercent === pct
                          ? "bg-[#111116] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-[#d4af37]/20 hover:text-[#94761b]"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-500">100%</span>
              </div>
            </div>

            {/* 3. Loan Term */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wide uppercase">
                  Loan Tenure (Years)
                </label>
                <div className="flex items-center bg-[#faf9f7] border-2 border-gray-200 focus-within:border-[#d4af37] focus-within:bg-white rounded-xl px-3 py-1.5 transition-all">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={termInput}
                    onChange={(e) => {
                      setTermInput(e.target.value);
                      const num = parseInt(e.target.value);
                      if (!isNaN(num)) setLoanTerm(Math.max(1, Math.min(30, num)));
                    }}
                    onBlur={() => {
                      const num = parseInt(termInput);
                      updateTerm(num || 25);
                    }}
                    className="w-16 text-right font-serif font-bold text-base sm:text-lg text-gray-900 bg-transparent outline-none tabular-nums"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-gray-500 ml-1.5">Years</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={loanTerm}
                onChange={(e) => updateTerm(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-gray-700 bg-gray-200"
              />

              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>1 Year</span>
                <div className="flex gap-2">
                  {[10, 15, 20, 25].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateTerm(t)}
                      className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                        loanTerm === t ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {t}y
                    </button>
                  ))}
                </div>
                <span>30 Years</span>
              </div>
            </div>

            {/* 4. INTEREST RATE — FULLY EDITABLE + SLIDER */}
            <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide uppercase flex items-center gap-1.5">
                    Interest Rate (Annual)
                    <Sparkles className="w-3.5 h-3.5 text-[#b5952f]" />
                  </label>
                  <p className="text-[11px] text-gray-600 font-medium">Click or type directly to edit</p>
                </div>

                <div className="flex items-center bg-white border-2 border-amber-300 focus-within:border-[#d4af37] focus-within:ring-2 focus-within:ring-[#d4af37]/20 rounded-xl px-3 py-1.5 shadow-sm transition-all">
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="15"
                    value={rateInput}
                    onChange={(e) => {
                      setRateInput(e.target.value);
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num)) setInterestRate(Math.max(0.1, Math.min(15, num)));
                    }}
                    onBlur={() => {
                      const num = parseFloat(rateInput);
                      updateRate(num || 4.25);
                    }}
                    className="w-16 sm:w-20 text-right font-serif font-bold text-base sm:text-lg text-gray-900 bg-transparent outline-none tabular-nums"
                  />
                  <span className="text-sm font-bold text-[#94761b] ml-1">%</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={12}
                step={0.05}
                value={interestRate}
                onChange={(e) => updateRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#d4af37] bg-amber-200/70"
              />

              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>1.0%</span>
                <div className="flex gap-1.5">
                  {[3.75, 4.25, 4.75, 5.25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateRate(preset)}
                      className={`text-xs px-2 py-0.5 rounded font-semibold transition ${
                        Math.abs(interestRate - preset) < 0.01
                          ? "bg-[#94761b] text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-amber-100"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
                <span>12.0%</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: LUXURY BREAKDOWN & SUMMARY ================= */}
          <div className="w-full lg:w-[45%] bg-[#0e0f14] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between items-center text-white relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Donut Chart with Spacious, Non-Overlapping Layout */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 my-3 z-10 flex items-center justify-center">
              <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="130" cy="130" r={radius} fill="none" stroke="#22232d" strokeWidth="18" />
                {/* Principal Arc (Gold) */}
                <circle
                  cx="130"
                  cy="130"
                  r={radius}
                  fill="none"
                  stroke="url(#mortgageGold)"
                  strokeWidth="18"
                  strokeDasharray={`${principalStroke} ${circumference - principalStroke}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
                {/* Interest Arc (Coral/Red) */}
                <circle
                  cx="130"
                  cy="130"
                  r={radius}
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="18"
                  strokeDasharray={`${interestStroke} ${circumference - interestStroke}`}
                  strokeDashoffset={`${-principalStroke}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="mortgageGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#fae082" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center text in Donut with abundant clearance */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Monthly Payment
                </span>
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight my-1 tabular-nums">
                  {fmt(monthlyPayment)}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#d4af37] tracking-wider">
                  {currency} / Month
                </span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-6 my-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                <span className="text-xs font-medium text-gray-300">Principal ({currency} {fmt(loanAmount)})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                <span className="text-xs font-medium text-gray-300">Total Interest ({currency} {fmt(totalInterest)})</span>
              </div>
            </div>

            {/* Summary Breakdown Rows */}
            <div className="w-full space-y-3.5 my-4 z-10 border-t border-b border-white/10 py-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Loan Amount
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-white tabular-nums">
                  {currency} {fmt(loanAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Down Payment ({downPaymentPercent}%)
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-[#d4af37] tabular-nums">
                  {currency} {fmt(currentDownPayment)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Total Interest ({interestRate}%)
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-[#f87171] tabular-nums">
                  {currency} {fmt(totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                  Total Repayment
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-white tabular-nums">
                  {currency} {fmt(totalPayment)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="w-full pt-2 z-10">
              <Link
                href="/contact"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b5952f] hover:from-[#e3bf45] hover:to-[#c5a435] text-black font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/20 active:scale-[0.99]"
              >
                <span>Get Pre-Approved with an Advisor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Zero obligation &amp; confidential luxury consultation</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
