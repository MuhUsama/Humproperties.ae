"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Each line is a plain part and a gold italic part; they take turns in the middle of the hero
const LINES = [
  { lead: "Extraordinary Living,", accent: "Defined." },
  { lead: "The Art of Living in", accent: "Dubai" },
  { lead: "Where Dubai Lives", accent: "Above the Ordinary" },
  { lead: "Exceptional Homes.", accent: "Exceptional Lives." },
];
const LINE_MS = 4800;
// The brand intro (IntroSplash) lands its logo in the header about 3.6s after first paint
const AFTER_INTRO_MS = 3600;

const HeroSection = memo(function HeroSection() {
  const [ready, setReady] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const introPlaying = document.documentElement.classList.contains("hum-intro-active");
    const t = setTimeout(() => setReady(true), introPlaying ? AFTER_INTRO_MS : 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setLine((n) => (n + 1) % LINES.length), LINE_MS);
    return () => clearInterval(t);
  }, [ready]);

  const current = LINES[line];

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] bg-black overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero_poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero_section_video.webm"
        // @ts-ignore - fetchpriority is valid but Next.js types might complain depending on version
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      {/* Darker base so the bottom-left text reads over the skyline */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="absolute z-10 inset-x-0 bottom-0 px-6 md:px-12 pb-14 md:pb-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.2 }}
          className="font-luxe flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.45em] text-white/75 mb-5 md:mb-7"
        >
          <span className="h-px w-10 md:w-16 bg-brand-gold" />
          Dubai · Luxury Real Estate
        </motion.p>

        <h1 className="font-display font-normal leading-[1.05] tracking-[-0.01em] text-[2.4rem] sm:text-6xl md:text-7xl lg:text-[5.4rem] max-w-5xl min-h-[3.15em] sm:min-h-[2.1em]">
          <AnimatePresence mode="wait">
            {ready && (
              <motion.span key={line} className="block" exit={{ opacity: 0, y: -24, filter: "blur(6px)" }} transition={{ duration: 0.6, ease }}>
                {/* Masks leave room below the line so Bodoni's long descenders (g, y) are not clipped */}
                <span className="block overflow-hidden pb-[0.24em] -mb-[0.18em]">
                  <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease }}>
                    {current.lead}
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.26em] -mb-[0.14em]">
                  <motion.span className="block italic text-brand-gold-light" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.12 }}>
                    {current.accent}
                  </motion.span>
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </h1>
      </div>
    </section>
  );
});

export default HeroSection;
