"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "AED" | "USD" | "EUR";
type AreaUnit = "SQFT" | "SQM";

interface SettingsContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  areaUnit: AreaUnit;
  setAreaUnit: (a: AreaUnit) => void;
  formatPrice: (priceInAED: string | number | undefined | null) => string;
  formatArea: (areaInSqft: string | number | undefined | null) => string;
  siteInfo: Record<string, string>;
  setSiteInfo: (info: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  isPageHidden: (slug: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children, siteInfo = {} }: { children: ReactNode, siteInfo?: Record<string, string> }) => {
  const [currency, setCurrencyState] = useState<Currency>("AED");
  const [areaUnit, setAreaUnitState] = useState<AreaUnit>("SQFT");
  const [currentSiteInfo, setCurrentSiteInfo] = useState<Record<string, string>>(siteInfo);

  useEffect(() => {
    setCurrentSiteInfo(siteInfo);
  }, [siteInfo]);

  // Fetch fresh settings on client mount to sync dynamic changes
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach((item: { key: string; value: string }) => {
            if (item.key) map[item.key] = item.value;
          });
          setCurrentSiteInfo((prev) => ({ ...prev, ...map }));
        }
      })
      .catch((err) => console.error("Error refreshing site settings:", err));
  }, []);

  // Load from local storage if available on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("mfre_currency") as Currency;
    const savedArea = localStorage.getItem("mfre_area") as AreaUnit;
    
    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedArea) setAreaUnitState(savedArea);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("mfre_currency", c);
  };

  const setAreaUnit = (a: AreaUnit) => {
    setAreaUnitState(a);
    localStorage.setItem("mfre_area", a);
  };

  const isPageHidden = (slug: string) => {
    return currentSiteInfo[`hide_page_${slug}`] === "true";
  };

  const formatPrice = (priceInAED: string | number | undefined | null) => {
    if (!priceInAED) return "Price Upon Request";
    
    // Extract numerical value from string if needed (e.g. "1,500,000 AED")
    let numericPrice = typeof priceInAED === "string" 
      ? parseFloat(priceInAED.replace(/[^\d.]/g, "")) 
      : priceInAED;

    if (isNaN(numericPrice)) return String(priceInAED);

    let convertedPrice = numericPrice;
    let symbol = "AED";

    if (currency === "USD") {
      convertedPrice = numericPrice / 3.67;
      symbol = "$";
    } else if (currency === "EUR") {
      convertedPrice = numericPrice / 4.00;
      symbol = "€";
    }

    // Format with commas and appropriate symbol
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(convertedPrice);

    return currency === "AED" ? `${formatted} AED` : `${symbol}${formatted}`;
  };

  const formatArea = (areaInSqft: string | number | undefined | null) => {
    if (!areaInSqft) return "N/A";
    
    let numericArea = typeof areaInSqft === "string" 
      ? parseFloat(areaInSqft.replace(/[^\d.]/g, "")) 
      : areaInSqft;

    if (isNaN(numericArea)) return String(areaInSqft);

    let convertedArea = numericArea;
    let suffix = "sq.ft";

    if (areaUnit === "SQM") {
      convertedArea = numericArea / 10.764;
      suffix = "sq.m";
    }

    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(convertedArea);

    return `${formatted} ${suffix}`;
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        currency, setCurrency, 
        areaUnit, setAreaUnit,
        formatPrice, formatArea,
        siteInfo: currentSiteInfo,
        setSiteInfo: setCurrentSiteInfo,
        isPageHidden
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
