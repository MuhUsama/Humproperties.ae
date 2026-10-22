"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen brand intro shown once per browser session (Emaar-style):
 * H, U, M rise through a mask, gold hairlines draw out, PROPERTIES settles in,
 * a gold sheen sweeps across HUM, then the curtain lifts to reveal the page.
 *
 * The overlay is server-rendered and driven purely by CSS (see globals.css),
 * so it starts on first paint without waiting for hydration and ends itself
 * even if JS fails. A tiny inline script in the root layout adds
 * `hum-intro-skip` to <html> on repeat visits so the overlay never paints.
 */

export const INTRO_STORAGE_KEY = "hum-intro-seen";
export const INTRO_DONE_EVENT = "hum:intro-done";

// Keep in sync with the timings in globals.css (.hum-intro*)
const CURTAIN_START_MS = 2300;
const TOTAL_MS = 3200;

const PROPERTIES = "PROPERTIES".split("");

const LETTERS = [
  { src: "/hum-letter-h.png", aspect: "245/230" },
  { src: "/hum-letter-u.png", aspect: "240/230" },
  { src: "/hum-letter-m.png", aspect: "270/230" },
];

function signalDone() {
  (window as Window & { __humIntroDone?: boolean }).__humIntroDone = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export default function IntroSplash() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Already hidden by CSS in both cases; just hand over to the header logo
    if (root.classList.contains("hum-intro-skip") || reduced) {
      signalDone();
      return;
    }

    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}

    root.classList.add("hum-intro-active");
    const curtain = window.setTimeout(signalDone, CURTAIN_START_MS);
    const remove = window.setTimeout(() => {
      root.classList.remove("hum-intro-active");
      setMounted(false);
    }, TOTAL_MS);

    return () => {
      window.clearTimeout(curtain);
      window.clearTimeout(remove);
      root.classList.remove("hum-intro-active");
    };
  }, []);

  // Click / tap / key skips straight to the curtain lift
  const skip = () => {
    if (leaving) return;
    setLeaving(true);
    signalDone();
    window.setTimeout(() => {
      document.documentElement.classList.remove("hum-intro-active");
      setMounted(false);
    }, 800);
  };

  useEffect(() => {
    if (!mounted) return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!mounted) return null;

  return (
    <div
      className={`hum-intro ${leaving ? "hum-intro--leaving" : ""}`}
      onClick={skip}
      aria-hidden="true"
    >
      <div className="hum-intro__inner">
        <div className="hum-intro__hum">
          {LETTERS.map((l, i) => (
            <span key={l.src} className="hum-intro__mask" style={{ aspectRatio: l.aspect }}>
              <span
                className="hum-intro__letter"
                style={{ animationDelay: `${0.25 + i * 0.16}s` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt="" draggable={false} />
                <span
                  className="hum-intro__sheen"
                  style={{
                    WebkitMaskImage: `url(${l.src})`,
                    maskImage: `url(${l.src})`,
                    animationDelay: `${1.45 + i * 0.12}s`,
                  }}
                />
              </span>
            </span>
          ))}
        </div>

        <div className="hum-intro__sub">
          <span className="hum-intro__line hum-intro__line--left" />
          <span className="hum-intro__word">
            {PROPERTIES.map((c, i) => (
              <span key={i} style={{ animationDelay: `${1.0 + i * 0.045}s` }}>
                {c}
              </span>
            ))}
          </span>
          <span className="hum-intro__line hum-intro__line--right" />
        </div>
      </div>
    </div>
  );
}
