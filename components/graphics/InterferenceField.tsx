"use client";

import { useEffect, useRef } from "react";

/*
 * Generative hero graphic: a two-dimensional interference pattern.
 *
 * Three coherent point sources emit circular wavefronts; each dot of a fine
 * grid shows the local field intensity, producing the hyperbolic fringe
 * pattern familiar from laser interferometry. Phases advance slowly so the
 * fringes drift, and the pointer applies a very subtle parallax.
 *
 * Implementation notes for maintainers:
 *  - Pure Canvas 2D — no WebGL or heavy dependencies.
 *  - Distances from each dot to each source are precomputed; per frame we
 *    only evaluate cosines, so it stays cheap even on large screens.
 *  - Rendering pauses when the canvas is offscreen, and users with
 *    "reduce motion" enabled get a single static frame.
 */

// Graphic palette (matches tokens in app/globals.css).
const DOT_POSITIVE = [129, 211, 235]; // --color-sky
const DOT_NEGATIVE = [55, 141, 189]; // --color-oasis
const DOT_ACCENT = [239, 64, 86]; // --color-accent

const GRID_SPACING = 16; // CSS px between dots
const WAVELENGTH = 46; // fringe spacing in px
const SPEED = 0.35; // phase advance, rad/s

interface Source {
  x: number; // relative position, 0..1
  y: number;
  phase: number;
  amp: number;
}

const SOURCES: Source[] = [
  { x: 0.22, y: 0.3, phase: 0, amp: 1 },
  { x: 0.78, y: 0.24, phase: 2.1, amp: 1 },
  { x: 0.55, y: 0.85, phase: 4.2, amp: 0.85 },
];

export function InterferenceField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dots: Float32Array = new Float32Array(0); // x, y, d0, d1, d2 per dot
    let dotCount = 0;
    let raf = 0;
    let visible = true;
    let start = performance.now();

    // Pointer parallax target/current, in [-1, 1].
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };

    function rebuild() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / GRID_SPACING) + 1;
      const rows = Math.ceil(height / GRID_SPACING) + 1;
      dotCount = cols * rows;
      dots = new Float32Array(dotCount * 5);

      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GRID_SPACING;
          const y = r * GRID_SPACING;
          dots[i++] = x;
          dots[i++] = y;
          for (const s of SOURCES) {
            const dx = x - s.x * width;
            const dy = y - s.y * height;
            dots[i++] = Math.hypot(dx, dy);
          }
        }
      }
    }

    function draw(now: number) {
      if (!ctx) return;
      const t = reduceMotion ? 0 : (now - start) / 1000;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const k = (2 * Math.PI) / WAVELENGTH;
      const phases = SOURCES.map((s, idx) => {
        // Slight per-source frequency offsets keep the pattern evolving
        // without ever repeating exactly.
        const drift = t * SPEED * (1 + idx * 0.18);
        const parallax = (idx - 1) * (pointer.x * 1.4 + pointer.y * 0.8);
        return s.phase + drift + parallax;
      });

      const maxAmp = SOURCES.reduce((sum, s) => sum + s.amp, 0);

      for (let d = 0; d < dotCount; d++) {
        const base = d * 5;
        const x = dots[base];
        const y = dots[base + 1];

        let field = 0;
        for (let s = 0; s < SOURCES.length; s++) {
          field += SOURCES[s].amp * Math.cos(k * dots[base + 2 + s] - phases[s]);
        }
        const norm = field / maxAmp; // -1 .. 1

        // Vertical fade so the pattern dissolves toward the content below.
        const fade = 1 - Math.min(1, Math.max(0, (y / height - 0.55) / 0.45));
        const intensity = norm * norm * fade;
        if (intensity < 0.02) continue;

        const positive = norm > 0;
        const [cr, cg, cb] = positive ? DOT_POSITIVE : DOT_NEGATIVE;
        const alpha = Math.min(0.85, intensity * 0.9);
        const radius = 0.6 + intensity * 1.5;

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mark the emitter locations with faint accent points.
      for (const s of SOURCES) {
        const sx = s.x * width;
        const sy = s.y * height;
        const pulse = reduceMotion ? 0.5 : 0.5 + 0.25 * Math.sin(t * 1.2 + s.phase);
        ctx.fillStyle = `rgba(${DOT_ACCENT.join(",")},${0.5 + pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${DOT_ACCENT.join(",")},${0.22 * pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 10 + pulse * 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function loop(now: number) {
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    function startLoop() {
      cancelAnimationFrame(raf);
      if (reduceMotion) {
        draw(performance.now());
      } else {
        start = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      if (reduceMotion || !visible) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else cancelAnimationFrame(raf);
    });
    intersectionObserver.observe(canvas);

    rebuild();
    startLoop();
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
