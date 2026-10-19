"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LINE_1 = "MOHD. ALFALASI";
const LINE_2 = "REAL ESTATE";
const TOTAL = LINE_1.length + LINE_2.length;

const CHAR_DELAY = 90; // ms between each character
const HOLD_FULL = 2600; // ms to keep full text visible
const HOLD_EMPTY = 500; // ms pause before typing again

interface AnimatedLogoProps {
  /** true = white icon + white text (dark backgrounds) */
  light?: boolean;
  /** Tailwind size classes for the icon box */
  iconClassName?: string;
  /** Tailwind classes for line 1 */
  titleClassName?: string;
  /** Tailwind classes for line 2 */
  subtitleClassName?: string;
  className?: string;
}

export default function AnimatedLogo({
  light = false,
  iconClassName = "h-14 w-11 sm:h-16 sm:w-[3.15rem]",
  titleClassName = "text-[15px] sm:text-[17px]",
  subtitleClassName = "text-[8px] sm:text-[9px]",
  className = "",
}: AnimatedLogoProps) {
  // number of characters currently revealed (0..TOTAL)
  const [count, setCount] = useState(0);

  useEffect(() => {
    let delay = CHAR_DELAY;
    if (count === 0) delay = HOLD_EMPTY; // short pause before typing restarts
    if (count >= TOTAL) delay = HOLD_FULL; // hold full text, then loop

    const timer = setTimeout(() => {
      setCount((c) => (c >= TOTAL ? 0 : c + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [count]);

  const visible = count;
  const textColor = light ? "text-white" : "text-[#1a1a1a]";
  const lineColor = light ? "bg-white/70" : "bg-[#1a1a1a]/80";

  const renderChars = (text: string, offset: number) =>
    text.split("").map((ch, i) => {
      const shown = offset + i < visible;
      return (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block transition-all duration-300 ease-out"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateX(0)" : "translateX(-4px)",
            whiteSpace: "pre",
          }}
        >
          {ch}
        </span>
      );
    });

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Icon */}
      <div className={`relative shrink-0 ${iconClassName}`}>
        <Image
          src="/logo-icon.png"
          alt="Mohd. Alfalasi Real Estate Logo"
          fill
          priority
          sizes="64px"
          className="object-contain pointer-events-none transition-all duration-500"
          style={{ filter: light ? "brightness(0) invert(1)" : "none" }}
        />
      </div>

      {/* Text – right of icon, vertically centred */}
      <div className={`flex flex-col justify-center leading-none font-serif ${textColor}`}>
        <span className="sr-only">Mohd. Alfalasi Real Estate</span>
        <span className={`font-medium tracking-[0.18em] whitespace-nowrap ${titleClassName}`}>
          {renderChars(LINE_1, 0)}
        </span>
        <span className="flex items-center gap-1.5 mt-1.5">
          <span
            className={`h-px flex-1 transition-opacity duration-300 ${lineColor}`}
            style={{ opacity: visible > LINE_1.length ? 1 : 0 }}
          />
          <span className={`tracking-[0.3em] whitespace-nowrap ${subtitleClassName}`}>
            {renderChars(LINE_2, LINE_1.length)}
          </span>
          <span
            className={`h-px flex-1 transition-opacity duration-300 ${lineColor}`}
            style={{ opacity: visible >= TOTAL ? 1 : 0 }}
          />
        </span>
      </div>
    </div>
  );
}
