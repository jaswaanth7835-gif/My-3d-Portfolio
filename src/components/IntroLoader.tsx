"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/portfolio";

type Phase = "closed" | "peek" | "open" | "dissolve" | "fade" | "done";

const KEY = "intro-seen";
const POS_Y = 0.72; // matches object-position below
const DISSOLVE_MS = 1900;

// Aperture intro: the photo appears through a small circle with the name and widens to fill
// the screen, then dissolves into the site's teal dot field, which drifts away to reveal the
// page. Once per session.
export default function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }

    const root = document.documentElement;
    root.style.overflow = "hidden";
    const timers = [
      setTimeout(() => setPhase("peek"), 120),
      setTimeout(() => setPhase("open"), 1700),
      setTimeout(() => setPhase("dissolve"), 3000),
    ];
    const skip = () => setPhase((p) => (p === "done" || p === "dissolve" ? p : "fade"));
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "dissolve" || phase === "fade") {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.style.overflow = "";
    }
    if (phase === "fade") {
      const t = setTimeout(() => setPhase("done"), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "done") return null;

  const circle = phase === "closed" ? "0%" : phase === "peek" ? "17%" : "80%";
  const dissolving = phase === "dissolve";

  return (
    <div
      className="intro fixed inset-0 z-[100] cursor-pointer transition-[opacity,background-color] duration-500"
      style={{
        opacity: phase === "fade" ? 0 : 1,
        backgroundColor: dissolving ? "transparent" : "var(--background)",
        pointerEvents: dissolving ? "none" : "auto",
      }}
      onClick={() => setPhase("fade")}
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-[clip-path,opacity] duration-[1200ms] ease-[cubic-bezier(.7,0,.2,1)]"
        style={{
          clipPath: `circle(${circle} at 50% 46%)`,
          opacity: dissolving ? 0 : 1,
          transitionDuration: dissolving ? "400ms" : "1200ms",
        }}
      >
        <Image
          src={profile.photo}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_72%]"
        />
      </div>
      {dissolving && <DotDissolve onDone={() => setPhase("done")} />}
      <div
        className="absolute inset-x-0 bottom-[12%] text-center font-mono text-xs uppercase tracking-[0.35em] text-accent transition-opacity duration-500 sm:text-sm"
        style={{ opacity: phase === "peek" ? 1 : 0, transitionDelay: phase === "peek" ? "700ms" : "0ms" }}
      >
        {profile.name}
      </div>
      <div
        className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 transition-opacity"
        style={{ opacity: dissolving ? 0 : 1 }}
      >
        Click to skip
      </div>
    </div>
  );
}

// Re-draws the photo as a teal/blue dot silhouette (the waves' look), then lets the dots
// sink and scatter in a left-to-right sweep while they fade.
function DotDissolve({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    // ponytail: fixed cell size; bigger cells on huge screens if this ever drops frames
    const cell = W < 640 ? 6 : 8;
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const A = light ? [13, 92, 86] : [45, 212, 191];
    const B = light ? [30, 58, 120] : [91, 141, 239];

    let raf = 0;
    const img = new window.Image();
    img.src = profile.photo;
    img.onload = () => {
      const cols = Math.ceil(W / cell);
      const rows = Math.ceil(H / cell);
      if (!cols || !rows) return done.current();
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      const small = document.createElement("canvas");
      small.width = cols;
      small.height = rows;
      const sctx = small.getContext("2d")!;
      sctx.drawImage(img, ((W - dw) / 2) / cell, ((H - dh) * POS_Y) / cell, dw / cell, dh / cell);
      const px = sctx.getImageData(0, 0, cols, rows).data;

      const dots: { x: number; y: number; r: number; b: number; d: number; vx: number; vy: number }[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          // dark areas (the figure) become dots and the bright sky drops out, leaving a dot silhouette
          const dark = 1 - (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
          if (dark < 0.62) continue;
          const b = Math.min(1, (dark - 0.62) / 0.3);
          dots.push({
            x: x * cell + cell / 2,
            y: y * cell + cell / 2,
            r: (cell / 2) * Math.pow(b, 0.8),
            b,
            d: (x / cols) * 0.55 + Math.random() * 0.2,
            vx: (Math.random() - 0.3) * 120,
            vy: 60 + Math.random() * 160,
          });
        }
      }

      const t0 = performance.now();
      const frame = (now: number) => {
        const t = (now - t0) / DISSOLVE_MS;
        ctx.clearRect(0, 0, W, H);
        const appear = Math.min(1, t / 0.18);
        for (const p of dots) {
          const k = Math.max(0, Math.min(1, (t - 0.15 - p.d) / 0.45));
          const e = k * k;
          const alpha = appear * p.b * (1 - k);
          if (alpha <= 0.01) continue;
          const c = p.y / H;
          ctx.fillStyle = `rgba(${A[0] + (B[0] - A[0]) * c},${A[1] + (B[1] - A[1]) * c},${A[2] + (B[2] - A[2]) * c},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x + p.vx * e, p.y + p.vy * e, p.r * (1 - k * 0.6), 0, 6.283);
          ctx.fill();
        }
        if (t < 1) raf = requestAnimationFrame(frame);
        else done.current();
      };
      raf = requestAnimationFrame(frame);
    };
    img.onerror = () => done.current();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
