"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/portfolio";

type Phase = "closed" | "peek" | "open" | "shrink" | "close" | "fade" | "done";

const KEY = "intro-seen";

// Where the face sits in jaswaanth.jpg (fractions of width/height). Retune if the photo changes.
const FACE = { x: 0.35, y: 0.6 };
const PHOTO = { w: 1430, h: 1907 };
const POS = { x: 0.5, y: 0.72 }; // matches object-position below

// Face centre on screen, as % of the viewport, for an object-cover image.
function faceOnScreen() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(vw / PHOTO.w, vh / PHOTO.h);
  const dw = PHOTO.w * scale;
  const dh = PHOTO.h * scale;
  const x = (vw - dw) * POS.x + FACE.x * dw;
  const y = (vh - dh) * POS.y + FACE.y * dh;
  return { x: (x / vw) * 100, y: (y / vh) * 100 };
}

// Aperture intro: the photo appears through a small circle with the name and widens to fill
// the screen, then reverses: the circle shrinks back onto the face with the site showing
// around it, and closes. Once per session.
export default function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [face, setFace] = useState({ x: 50, y: 46 });

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
      setTimeout(() => {
        setFace(faceOnScreen());
        setPhase("peek");
      }, 120),
      setTimeout(() => setPhase("open"), 1700),
      setTimeout(() => setPhase("shrink"), 3000),
      setTimeout(() => setPhase("close"), 4300),
      setTimeout(() => setPhase("done"), 5000),
    ];
    const skip = () => setPhase((p) => (p === "done" || p === "shrink" || p === "close" ? p : "fade"));
    const resize = () => setFace(faceOnScreen());
    window.addEventListener("keydown", skip);
    window.addEventListener("resize", resize);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("resize", resize);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "shrink" || phase === "fade") {
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

  const circle = { closed: "0%", peek: "17%", open: "80%", shrink: "17%", close: "0%", fade: "80%" }[phase];
  // while the circle is small, slide the photo so the face sits in the centre; it glides back as it opens
  const centred = phase !== "open" && phase !== "fade";
  // on the way out the backdrop goes clear so the site appears around the shrinking circle
  const exiting = phase === "shrink" || phase === "close";
  const shift = centred ? `translate(${50 - face.x}vw, ${46 - face.y}vh)` : "translate(0, 0)";

  return (
    <div
      className="intro fixed inset-0 z-[100] cursor-pointer transition-[opacity,background-color] duration-500"
      style={{
        opacity: phase === "fade" ? 0 : 1,
        backgroundColor: exiting ? "transparent" : "var(--background)",
        pointerEvents: exiting ? "none" : "auto",
      }}
      onClick={() => setPhase("fade")}
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-[clip-path] ease-[cubic-bezier(.7,0,.2,1)]"
        style={{ clipPath: `circle(${circle} at 50% 46%)`, transitionDuration: phase === "close" ? "650ms" : "1200ms" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(.7,0,.2,1)]"
          style={{ transform: shift }}
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
      </div>
      <div
        className="absolute inset-x-0 bottom-[12%] text-center font-mono text-xs uppercase tracking-[0.35em] text-accent transition-opacity duration-500 sm:text-sm"
        style={{ opacity: phase === "peek" ? 1 : 0, transitionDelay: phase === "peek" ? "700ms" : "0ms" }}
      >
        {profile.name}
      </div>
      <div
        className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 transition-opacity"
        style={{ opacity: exiting ? 0 : 1 }}
      >
        Click to skip
      </div>
    </div>
  );
}
