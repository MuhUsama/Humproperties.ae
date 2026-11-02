"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Degrees per frame while turning on its own, and how long it rests after the visitor touches it
const AUTO_SPEED = 0.08;
const IDLE_MS = 3500;

/**
 * A large ring of project photos that keeps turning in a circle. Photos face the viewer and sit on
 * an ellipse: the front one is big and bright, the ones behind it smaller and darker. Drag or swipe
 * to turn it, use the arrows, or click a photo; clicking the front photo opens it full screen.
 */
export default function ProjectRing({ images, name }: { images: string[]; name: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frontRef = useRef(0);
  const goRef = useRef<(i: number) => void>(() => {});
  const byRef = useRef<(k: number) => void>(() => {});
  const [front, setFront] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const n = images.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el || n === 0) return;
    const step = 360 / n;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rot = 0;
    let target = 0;
    let idleUntil = 0;
    let visible = true;
    let raf = 0;
    let drag: { x: number; r: number; moved: boolean } | null = null;

    const render = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const mobile = W < 640;
      const cw = mobile ? W * 0.62 : Math.min(W * 0.34, 560);
      const ch = cw * 0.62;
      // With few photos the ring is narrower so neighbours still tuck behind the front photo
      const rx = Math.min(mobile ? W * 0.36 : W * 0.38, n <= 2 ? cw * 0.45 : n <= 4 ? cw * 0.75 : Infinity);
      const ry = H * 0.44;
      let best = -1;
      let bi = 0;
      itemRefs.current.forEach((d, i) => {
        if (!d) return;
        const a = ((i * step - rot) * Math.PI) / 180;
        const depth = (Math.cos(a) + 1) / 2;
        const s = 0.45 + 0.55 * Math.pow(depth, 1.5);
        d.style.width = `${cw}px`;
        d.style.height = `${ch}px`;
        d.style.transform = `translate(-50%,-50%) translate(${Math.sin(a) * rx}px,${(depth - 0.5) * ry}px) scale(${s})`;
        d.style.zIndex = String(Math.round(depth * 100));
        d.style.filter = `brightness(${0.45 + 0.55 * depth})`;
        if (depth > best) {
          best = depth;
          bi = i;
        }
      });
      if (bi !== frontRef.current) {
        frontRef.current = bi;
        setFront(bi);
      }
    };

    const tick = () => {
      if (!drag) {
        if (!reduce && visible && !document.hidden && performance.now() > idleUntil) target += AUTO_SPEED;
        rot += (target - rot) * 0.08;
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    const snap = () => {
      target = Math.round(target / step) * step;
    };
    goRef.current = (i: number) => {
      const d = ((((i * step - target) % 360) + 540) % 360) - 180;
      target += d;
      idleUntil = performance.now() + IDLE_MS;
    };
    byRef.current = (k: number) => {
      snap();
      target += k * step;
      idleUntil = performance.now() + IDLE_MS;
    };

    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, r: target, moved: false };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      target = rot = drag.r - dx * 0.2;
    };
    const up = (e: PointerEvent) => {
      const was = drag;
      drag = null;
      idleUntil = performance.now() + IDLE_MS;
      snap();
      if (was && !was.moved) {
        const hit = document
          .elementsFromPoint(e.clientX, e.clientY)
          .find((node) => node instanceof HTMLElement && node.dataset.ringItem !== undefined) as HTMLElement | undefined;
        if (!hit) return;
        const i = Number(hit.dataset.ringItem);
        if (i === frontRef.current) setLightbox(i);
        else goRef.current(i);
      }
    };
    const cancel = () => {
      drag = null;
      snap();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, [n]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % n));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [lightbox, n]);

  if (!n) return null;

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative isolate h-[300px] sm:h-[420px] md:h-[520px] lg:h-[580px] overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y"
        aria-label={`${name} photos, drag to turn`}
      >
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            data-ring-item={i}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (i === frontRef.current) setLightbox(i);
                else goRef.current(i);
              }
            }}
            aria-label={`${name} photo ${i + 1}`}
            className="absolute left-1/2 top-1/2 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)] will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} className="w-full h-full object-cover pointer-events-none" />
          </button>
        ))}
      </div>

      {n > 1 && (
        <div className="flex justify-center items-center gap-6 mt-2">
          <button onClick={() => byRef.current(-1)} aria-label="Previous photo" className="w-10 h-10 flex items-center justify-center border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs tracking-[0.2em] text-gray-400 w-12 text-center">{front + 1} / {n}</span>
          <button onClick={() => byRef.current(1)} aria-label="Next photo" className="w-10 h-10 flex items-center justify-center border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute top-5 right-5 text-white/80 hover:text-white p-2">
            <X className="w-7 h-7" />
          </button>
          {n > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + n) % n); }}
              aria-label="Previous photo"
              className="absolute left-3 md:left-8 text-white/80 hover:text-white p-2"
            >
              <ChevronLeft className="w-9 h-9" />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[lightbox]} alt={`${name} photo ${lightbox + 1}`} className="max-w-[92vw] max-h-[88vh] object-contain" onClick={(e) => e.stopPropagation()} />
          {n > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % n); }}
              aria-label="Next photo"
              className="absolute right-3 md:right-8 text-white/80 hover:text-white p-2"
            >
              <ChevronRight className="w-9 h-9" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
