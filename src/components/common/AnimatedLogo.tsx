"use client";

import Image from "next/image";

interface AnimatedLogoProps {
  /** true = displayed on dark backgrounds */
  light?: boolean;
  /** Optional custom class name */
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function AnimatedLogo({
  light = false,
  className = "",
}: AnimatedLogoProps) {
  return (
    <div className={`relative flex items-center group ${className}`}>
      <div className="relative h-12 sm:h-14 md:h-16 w-36 sm:w-44 md:w-52 transition-transform duration-300 ease-out group-hover:scale-105">
        <Image
          src="/logo-hum-transparent.png"
          alt="HUM Properties"
          fill
          priority
          sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 220px"
          className="object-contain object-left pointer-events-none drop-shadow-sm transition-all duration-300"
        />
      </div>
      <span className="sr-only">HUM Properties</span>
    </div>
  );
}
