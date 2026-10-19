"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  /** true = displayed on dark backgrounds */
  light?: boolean;
  className?: string;
}

const PROPERTIES_LETTERS = ["P", "R", "O", "P", "E", "R", "T", "I", "E", "S"];

export default function AnimatedLogo({
  light = false,
  className = "",
}: AnimatedLogoProps) {
  // Total cycle duration for the wave
  const WAVE_DURATION = 2.8;

  // Wave keyframes for the big HUM letters
  const humWaveVariants: any = {
    animate: (delay: number) => ({
      scale: [1, 1.15, 1],
      y: [0, -3.5, 0],
      filter: [
        "drop-shadow(0 0 0px rgba(212,175,55,0)) drop-shadow(0 1px 2px rgba(0,0,0,0.2)) brightness(1)",
        "drop-shadow(0 0 2px #d4af37) drop-shadow(0 0 12px rgba(212,175,55,0.95)) brightness(1.28)",
        "drop-shadow(0 0 0px rgba(212,175,55,0)) drop-shadow(0 1px 2px rgba(0,0,0,0.2)) brightness(1)",
      ],
      transition: {
        duration: 1.1,
        repeat: Infinity,
        repeatDelay: WAVE_DURATION - 1.1,
        delay: delay,
        ease: "easeInOut",
      },
    }),
  };

  // Wave keyframes for each letter in PROPERTIES
  const propLetterVariants: any = {
    animate: (delay: number) => ({
      scale: [1, 1.35, 1],
      y: [0, -1.5, 0],
      fontWeight: [400, 900, 400],
      color: light
        ? ["#d4af37", "#ffffff", "#d4af37"]
        : ["#a37d24", "#000000", "#a37d24"],
      textShadow: [
        "0 0 0px rgba(212,175,55,0)",
        "0 0 8px rgba(212,175,55,0.95)",
        "0 0 0px rgba(212,175,55,0)",
      ],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: WAVE_DURATION - 0.6,
        delay: delay,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className={`relative flex flex-col items-center select-none group ${className}`}>
      {/* Top Row: H - U - M separated character by character waving left to right */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-10 sm:h-12 md:h-14">
        {/* Letter H */}
        <motion.div
          custom={0.0}
          variants={humWaveVariants}
          animate="animate"
          className="relative h-full aspect-[245/230] origin-bottom cursor-pointer"
        >
          <Image
            src="/hum-letter-h.png"
            alt="H"
            fill
            priority
            sizes="80px"
            className="object-contain"
          />
        </motion.div>

        {/* Letter U */}
        <motion.div
          custom={0.22}
          variants={humWaveVariants}
          animate="animate"
          className="relative h-full aspect-[240/230] origin-bottom cursor-pointer"
        >
          <Image
            src="/hum-letter-u.png"
            alt="U"
            fill
            priority
            sizes="80px"
            className="object-contain"
          />
        </motion.div>

        {/* Letter M */}
        <motion.div
          custom={0.44}
          variants={humWaveVariants}
          animate="animate"
          className="relative h-full aspect-[270/230] origin-bottom cursor-pointer"
        >
          <Image
            src="/hum-letter-m.png"
            alt="M"
            fill
            priority
            sizes="90px"
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Bottom Row: - P R O P E R T I E S - letter by letter left to right wave */}
      <div className="flex items-center justify-center w-full mt-0.5 sm:mt-1 space-x-1 sm:space-x-1.5">
        {/* Left gold decorative hairline */}
        <motion.span
          className="h-[1px] w-4 sm:w-7 bg-gradient-to-r from-transparent to-[#d4af37]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: WAVE_DURATION, repeat: Infinity, delay: 0.6 }}
        />

        {/* Letter by letter waving from left to right */}
        <div className="flex items-center space-x-[2px] sm:space-x-[3px] font-sans tracking-[0.25em] sm:tracking-[0.3em] text-[9px] sm:text-[11px] md:text-[12px] uppercase">
          {PROPERTIES_LETTERS.map((char, index) => {
            // Sequential delay starting after M
            const charDelay = 0.65 + index * 0.08;
            return (
              <motion.span
                key={index}
                custom={charDelay}
                variants={propLetterVariants}
                animate="animate"
                className="inline-block origin-center"
              >
                {char}
              </motion.span>
            );
          })}
        </div>

        {/* Right gold decorative hairline */}
        <motion.span
          className="h-[1px] w-4 sm:w-7 bg-gradient-to-l from-transparent to-[#d4af37]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: WAVE_DURATION,
            repeat: Infinity,
            delay: 0.65 + PROPERTIES_LETTERS.length * 0.08,
          }}
        />
      </div>

      <span className="sr-only">HUM Properties</span>
    </div>
  );
}
