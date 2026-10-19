"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // If navigating to an in-page anchor hash, allow the browser to handle anchor jump
    if (typeof window !== "undefined" && window.location.hash) {
      return;
    }

    const resetScroll = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    resetScroll();

    // Secondary reset after next microtask/frame to ensure dynamically mounted elements don't retain scroll position
    const timeoutId = setTimeout(resetScroll, 20);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
