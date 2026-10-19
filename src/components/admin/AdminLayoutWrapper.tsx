"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let isMounted = true;

    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated) {
          setIsAuthenticated(true);
          setChecking(false);
        } else {
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setIsAuthenticated(false);
        router.replace("/admin/login");
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // If on login page, render children without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // While checking auth on admin pages, show luxury loading screen
  if (checking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37]/80 font-medium">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // Authenticated admin view
  return (
    <div className="flex min-h-screen bg-[#faf9f7] font-sans">
      <AdminSidebar />
      <main className="flex-1 min-w-0 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>
        <div className="relative z-10 w-full p-4 md:p-8 lg:p-12 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
