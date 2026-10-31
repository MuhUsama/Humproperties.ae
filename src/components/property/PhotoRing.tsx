"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  images: string[];
  activeIndex: number;
  onFrontChange: (i: number) => void;
  /** Exposes prev/next so the main photo's arrows can turn the ring */
  controlsRef?: React.MutableRefObject<{ by: (k: number) => void } | null>;
};

const unopt = (src?: string) => !!src?.startsWith("/uploads/");

// Slow rotation in degrees per frame, and how long the ring rests after the visitor touches it
const AUTO_SPEED = 0.05;
const IDLE_MS = 4000;

/**
 * A small ring of photos under the main listing photo. Photos always face the
 * viewer and sit on an ellipse: the front one is large and gold-outlined, the
 * back ones float smaller near the top. It turns slowly on its own, can be
 * dragged or swiped, and whichever photo reaches the front becomes the main photo.
 */
export default function PhotoRing({ images, activeIndex, onFrontChange, controlsRef }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frontRef = useRef(activeIndex);
  const goRef = useRef<(i: number) => void>(() => {});
  const onFrontRef = useRef(onFrontChange);
  useEffect(() => {
    onFrontRef.current = onFrontChange;
  }, [onFrontChange]);

  const n = images.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el || n === 0) return;
    const step = 360 / n;
    // Today's ring size is the maximum, used from 10 photos up. With fewer photos the ring
    // shrinks so the photos beside the front one tuck slightly behind it, with no empty gap.
    const FULL_RING = 10;
    const sideDepth = (Math.cos((2 * Math.PI) / n) + 1) / 2;
    const sideScale = 0.5 + 0.5 * Math.pow(sideDepth, 1.6);
    const snugRadius = (cardW: number) => (cardW * (0.5 + sideScale / 2) - cardW * 0.08) / Math.sin((2 * Math.PI) / n);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rot = frontRef.current * step;
    let target = rot;
    let idleUntil = 0;
    let visible = true;
    let raf = 0;
    let drag: { x: number; r: number; moved: boolean } | null = null;

    const render = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const mobile = W < 640;
      const cw = mobile ? W * 0.4 : Math.min(W * 0.22, 240);
      const ch = cw * 0.62;
      const maxRx = mobile ? W * 0.3 : W * 0.4;
      const rx = n >= FULL_RING ? maxRx : Math.min(maxRx, snugRadius(cw));
      const ry = H * 0.22;
      let best = -1;
      let bi = 0;
      itemRefs.current.forEach((d, i) => {
        if (!d) return;
        const a = ((i * step - rot) * Math.PI) / 180;
        const depth = (Math.cos(a) + 1) / 2;
        const s = 0.5 + 0.5 * Math.pow(depth, 1.6);
        d.style.width = `${cw}px`;
        d.style.height = `${ch}px`;
        d.style.transform = `translate(-50%,-50%) translate(${Math.sin(a) * rx}px,${-(1 - depth) * ry}px) scale(${s})`;
        // Stacking stays inside the ring (the stage is "isolate"), so the full-screen viewer covers it
        d.style.zIndex = String(Math.round(depth * 100));
        d.style.filter = `brightness(${0.7 + 0.3 * depth})`;
        if (depth > best) {
          best = depth;
          bi = i;
        }
      });
      if (bi !== frontRef.current) {
        frontRef.current = bi;
        onFrontRef.current(bi);
      }
      itemRefs.current.forEach((d, i) => d?.setAttribute("data-front", String(i === bi)));
    };

    const tick = () => {
      if (!drag) {
        if (!reduce && visible && !document.hidden && performance.now() > idleUntil) target += AUTO_SPEED;
        rot += (target - rot) * 0.09;
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    const snap = () => {
      target = Math.round(target / step) * step;
    };
    const go = (i: number) => {
      const d = ((((i * step - target) % 360) + 540) % 360) - 180;
      target += d;
      idleUntil = performance.now() + IDLE_MS;
    };
    goRef.current = go;
    if (controlsRef) {
      controlsRef.current = {
        by: (k: number) => {
          snap();
          target += k * step;
          idleUntil = performance.now() + IDLE_MS;
        },
      };
    }

    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, r: target, moved: false };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      target = rot = drag.r - dx * 0.25;
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
        if (hit) go(Number(hit.dataset.ringItem));
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

    // Only animate while the ring is on screen
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
      if (controlsRef) controlsRef.current = null;
    };
  }, [n, controlsRef]);

  // Turn the ring when the photo changes from elsewhere (e.g. the full-screen viewer)
  useEffect(() => {
    if (activeIndex !== frontRef.current) goRef.current(activeIndex);
  }, [activeIndex]);

  return (
    <div
      ref={stageRef}
      className="relative isolate h-[130px] sm:h-[180px] lg:h-[190px] mt-2 overflow-hidden px-1 cursor-grab active:cursor-grabbing select-none touch-pan-y"
      aria-label="Photo gallery, drag to turn"
    >
      {images.map((src, i) => (
        <button
          key={i}
          type="button"
          data-ring-item={i}
          ref={(node) => {
            itemRefs.current[i] = node;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goRef.current(i);
            }
          }}
          aria-label={`Show photo ${i + 1}`}
          className="absolute left-1/2 top-1/2 rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.22)] will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-brand-gold data-[front=true]:ring-2 data-[front=true]:ring-brand-gold"
        >
          <Image src={src} alt="" fill sizes="240px" draggable={false} className="object-cover pointer-events-none" unoptimized={unopt(src)} />
        </button>
      ))}
    </div>
  );
}
