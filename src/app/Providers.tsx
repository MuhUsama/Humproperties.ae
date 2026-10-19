"use client";

import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children, siteInfo }: { children: React.ReactNode, siteInfo?: Record<string, string> }) {
  return (
    <SettingsProvider siteInfo={siteInfo}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: 'rgba(10, 10, 10, 0.85)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '16px 24px',
            fontSize: '14px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#1A1A1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4b4b',
              secondary: '#fff',
            },
          },
        }}
      />
    </SettingsProvider>
  );
}
