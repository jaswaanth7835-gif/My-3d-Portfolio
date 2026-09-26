"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/portfolio";

type Phase = "closed" | "peek" | "open" | "fade" | "done";

const KEY = "intro-seen";

// Aperture intro: the photo appears through a small circle with the name, the circle
// widens to fill the screen, then the overlay fades to reveal the site. Once per session.
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
      setTimeout(() => setPhase("open"), 1800),
      setTimeout(() => setPhase("fade"), 3000),
      setTimeout(() => setPhase("done"), 3600),
    ];
    const skip = () => setPhase((p) => (p === "done" ? p : "fade"));
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "fade") {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.style.overflow = "";
      const t = setTimeout(() => setPhase("done"), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "done") return null;

  const circle = phase === "closed" ? "0%" : phase === "peek" ? "17%" : "80%";

  return (
    <div
      className="intro fixed inset-0 z-[100] cursor-pointer bg-background transition-opacity duration-500"
      style={{ opacity: phase === "fade" ? 0 : 1 }}
      onClick={() => setPhase("fade")}
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(.7,0,.2,1)]"
        style={{ clipPath: `circle(${circle} at 50% 46%)` }}
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
      <div
        className="absolute inset-x-0 bottom-[12%] text-center font-mono text-xs uppercase tracking-[0.35em] text-accent transition-opacity duration-500 sm:text-sm"
        style={{ opacity: phase === "peek" ? 1 : 0, transitionDelay: phase === "peek" ? "700ms" : "0ms" }}
      >
        {profile.name}
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        Click to skip
      </div>
    </div>
  );
}
