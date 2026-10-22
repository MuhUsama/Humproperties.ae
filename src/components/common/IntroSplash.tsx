"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Brand intro shown once per browser session, modelled on emaar.com's:
 * the HUM lock-up fades in centred over a dark veil, a gold rule grows and a
 * tagline rises; then the HUM word flies up into the header logo's spot while
 * the tagline falls away, the header items fade in and the real logo takes over.
 *
 * The inline script in INTRO_BOOT_SCRIPT (rendered by the (main) layout, before
 * this overlay) decides before first paint whether the intro runs, so repeat
 * visits and reduced-motion users never see it flash. The fade-in is CSS
 * (globals.css, .hum-intro*); the flight is a measured transform set here.
 */

const STORAGE_KEY = "hum-intro-seen";

// Timings (ms from first paint), taken from emaar.com's intro config
const FLIGHT_AT = 2350;
const FLIGHT_MS = 1200;
const HEADER_IN_AFTER = 620;
const CLEANUP_AFTER = 2400;
const FLY_EASE = "cubic-bezier(0.72, 0, 0.16, 1)";

// Explicit widths (image width / height) rather than aspect-ratio on flex items,
// which iOS WebKit sizes wrongly and throws the lock-up off-centre
const LETTERS = [
  { src: "/hum-letter-h.png", ratio: 245 / 230 },
  { src: "/hum-letter-u.png", ratio: 240 / 230 },
  { src: "/hum-letter-m.png", ratio: 270 / 230 },
];

export const INTRO_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;
if(sessionStorage.getItem('${STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('hum-intro-skip');return;}
sessionStorage.setItem('${STORAGE_KEY}','1');d.classList.add('hum-intro-active');window.__humIntroT0=performance.now();
setTimeout(function(){if(d.classList.contains('hum-intro-active')){d.classList.add('hum-intro-skip','hum-intro-header-in','hum-intro-seated');d.classList.remove('hum-intro-active');}},8000);
}catch(e){document.documentElement.classList.add('hum-intro-skip');}})();`;

type IntroWindow = Window & { __humIntroT0?: number };

export default function IntroSplash() {
  const [mounted, setMounted] = useState(true);
  const wordRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("hum-intro-active")) {
      setTimeout(() => setMounted(false), 0);
      return;
    }

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, Math.max(0, ms)));
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      html.classList.add("hum-intro-header-in", "hum-intro-seated");
      setMounted(false);
      later(() => html.classList.remove("hum-intro-active", "hum-intro-header-in", "hum-intro-seated"), 1600);
      removeSkipListeners();
    };

    const fly = () => {
      const word = wordRef.current;
      const target = document.getElementById("hum-header-mark");
      rootRef.current?.classList.add("hum-intro--exit");

      if (word && target) {
        const from = word.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const scale = to.height / from.height;
        const dx = to.left + (to.width - from.width * scale) / 2 - from.left;
        const dy = to.top - from.top;
        word.style.transition = `transform ${FLIGHT_MS}ms ${FLY_EASE}`;
        word.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      }

      later(() => html.classList.add("hum-intro-header-in"), HEADER_IN_AFTER);
      later(() => {
        html.classList.add("hum-intro-seated");
        setMounted(false);
        removeSkipListeners();
      }, FLIGHT_MS);
      later(() => html.classList.remove("hum-intro-active", "hum-intro-header-in", "hum-intro-seated"), CLEANUP_AFTER);
    };

    // Scroll, tap or a key press skips straight to the end, like Emaar's
    const skipEvents = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    const onSkip = () => finish();
    const removeSkipListeners = () => skipEvents.forEach((e) => window.removeEventListener(e, onSkip));
    skipEvents.forEach((e) => window.addEventListener(e, onSkip, { passive: true }));

    const t0 = (window as IntroWindow).__humIntroT0 ?? performance.now();
    later(fly, t0 + FLIGHT_AT - performance.now());

    return () => {
      timers.forEach(clearTimeout);
      removeSkipListeners();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="hum-intro" aria-hidden="true">
      <div className="hum-intro__veil" />
      <div className="hum-intro__lockup">
        <div ref={wordRef} className="hum-intro__word">
          {LETTERS.map((l) => (
            <span key={l.src} className="hum-intro__letter" style={{ width: `calc(var(--h) * ${l.ratio.toFixed(4)})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt="" draggable={false} />
            </span>
          ))}
        </div>
        <span className="hum-intro__rule" />
        <span className="hum-intro__sub">Luxury Properties in Dubai</span>
      </div>
    </div>
  );
}
