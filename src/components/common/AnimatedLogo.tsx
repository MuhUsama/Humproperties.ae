"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, type Variants, useAnimationControls, useReducedMotion } from "framer-motion";
import { INTRO_DONE_EVENT } from "@/components/common/IntroSplash";

interface AnimatedLogoProps {
  /** true = displayed on dark backgrounds */
  light?: boolean;
  className?: string;
  /** Hold the entrance wave until the brand intro hands over (header logo) */
  waitForIntro?: boolean;
}

const PROPERTIES_LETTERS = ["P", "R", "O", "P", "E", "R", "T", "I", "E", "S"];

export default function AnimatedLogo({
  light = false,
  className = "",
  waitForIntro = false,
}: AnimatedLogoProps) {
  // The wave plays once on arrival (and again on hover), then the logo rests static
  const WAVE_DURATION = 2.8;
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const playing = useRef(false);

  const playWave = useCallback(async () => {
    if (reduceMotion || playing.current) return;
    playing.current = true;
    await controls.start("animate");
    playing.current = false;
  }, [controls, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(playWave, waitForIntro ? 450 : 300);
    };
    if (!waitForIntro || (window as Window & { __humIntroDone?: boolean }).__humIntroDone) {
      start();
    } else {
      window.addEventListener(INTRO_DONE_EVENT, start, { once: true });
    }
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, start);
      window.clearTimeout(timer);
    };
  }, [playWave, reduceMotion, waitForIntro]);

  // Keep the resting PROPERTIES colour in sync when the navbar switches theme
  useEffect(() => {
    if (!playing.current) controls.set("rest");
  }, [light, controls]);

  // Wave keyframes for the big HUM letters
  const humWaveVariants: Variants = {
    rest: {},
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
        delay: delay,
        ease: "easeInOut",
      },
    }),
  };

  // Wave keyframes for each letter in PROPERTIES
  const propLetterVariants: Variants = {
    rest: { color: light ? "#d4af37" : "#a37d24" },
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
        delay: delay,
        ease: "easeInOut",
      },
    }),
  };

  // Gold hairlines pulse once alongside the wave, then rest at full strength
  const hairlineVariants: Variants = {
    rest: { opacity: 1 },
    animate: (delay: number) => ({
      opacity: [1, 0.4, 1],
      transition: { duration: WAVE_DURATION / 2, delay },
    }),
  };

  return (
    <motion.div
      className={`relative flex flex-col items-center select-none group ${className}`}
      onHoverStart={playWave}
    >
      {/* Top Row: H - U - M separated character by character waving left to right */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-10 sm:h-12 md:h-14">
        {/* Letter H */}
        <motion.div
          custom={0.0}
          variants={humWaveVariants}
          initial="rest"
          animate={controls}
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
          initial="rest"
          animate={controls}
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
          initial="rest"
          animate={controls}
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
          custom={0.6}
          variants={hairlineVariants}
          initial="rest"
          animate={controls}
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
                initial="rest"
                animate={controls}
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
          custom={0.65 + PROPERTIES_LETTERS.length * 0.08}
          variants={hairlineVariants}
          initial="rest"
          animate={controls}
        />
      </div>

      <span className="sr-only">HUM Properties</span>
    </motion.div>
  );
}
