"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import type { SceneMode } from "@/components/Scene3D";
import ContactForm from "@/components/ContactForm";
import TiltCard from "@/components/TiltCard";
import ThemeToggle from "@/components/ThemeToggle";
import IntroLoader from "@/components/IntroLoader";
import Terminal from "@/components/Terminal";
import { labs, profile, projects, roadmap, skills } from "@/data/portfolio";

// three.js is heavy and can't render on the server anyway: load it after the page is interactive
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const reveal = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-10%" },
  variants: fadeUp,
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const section = "relative mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28 md:px-16 lg:px-20";
const h2 = "text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tighter";
const glass = "surface";
const card =
  "group/tilt relative rounded-3xl transition-[border-color,box-shadow,background-color] duration-300 hover:border-accent/50 hover:shadow-[0_20px_50px_-22px_var(--accent)]";

const NAV = ["about", "projects", "labs", "skills", "contact"] as const;

function Divider() {
  return <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-accent/50 to-transparent" />;
}

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 font-mono text-sm text-accent">
      <span>{n}</span>
      <span className="h-px w-10 bg-accent/60" />
      <span className="uppercase tracking-[0.25em]">{label}</span>
    </div>
  );
}

const ROLES = [
  "Aspiring SOC Analyst",
  "Cybersecurity undergraduate",
  `${labs.length}/${labs.length} DC-series boxes completed`,
  "Open to internships",
];

// Types each role out, holds, deletes, moves on. Static first role for reduced motion and SSR.
function TypedRoles() {
  const [text, setText] = useState(ROLES[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let role = 0;
    let len = ROLES[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = ROLES[role];
      if (deleting) {
        len--;
        if (len === 0) {
          deleting = false;
          role = (role + 1) % ROLES.length;
        }
      } else {
        len++;
        if (len === ROLES[role].length) deleting = true;
      }
      setText(ROLES[role].slice(0, len));
      const atEnd = !deleting ? false : len === full.length;
      timer = setTimeout(tick, atEnd ? 1800 : deleting ? 28 : 55);
    };
    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="font-mono text-sm text-accent sm:text-base" aria-label={ROLES.join(", ")}>
      <span className="text-zinc-500">&gt;</span> <span aria-hidden>{text}</span>
      <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-accent" />
    </p>
  );
}

const TOOLS = Object.values(skills).flat();

function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-background py-4" aria-hidden>
      <div className="ticker flex w-max gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.25em] text-zinc-500">
        {[...TOOLS, ...TOOLS].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="text-accent">/</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

const facts = [
  ["Level 5", "BSc (Hons) Cyber Security"],
  ["2028", "Expected graduation"],
  [`${labs.length} / ${labs.length}`, "DC-series boxes completed"],
  ["SOC", "Target role"],
];

const socials: [string, string, boolean][] = [
  ["GitHub", profile.github, false],
  ["LinkedIn", profile.linkedin, false],
  ["Resume", profile.resume, true],
];

export default function Home() {
  const [mode, setMode] = useState<SceneMode>("waves");
  const [active, setActive] = useState("");
  const progress = useRef<HTMLDivElement>(null);

  // scroll progress bar + which section the nav should highlight
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      let current = "";
      for (const id of NAV) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <IntroLoader />
      <Scene3D mode={mode} />

      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-background/95">
        <div className="flex items-center justify-between px-4 py-4 text-[11px] sm:px-10 sm:text-sm">
          <a href="#top" aria-label="Back to top" className="font-mono font-semibold text-accent transition-transform hover:scale-110">
            JN
          </a>
          <div className="flex items-center gap-3 sm:gap-6">
            <nav aria-label="Sections" className="flex gap-3 text-zinc-300 sm:gap-5">
              {NAV.map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  aria-current={active === s ? "true" : undefined}
                  className={`relative capitalize transition-colors hover:text-accent hover:[text-shadow:0_0_14px_var(--accent)] ${
                    active === s ? "text-accent" : ""
                  }`}
                >
                  {s}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ${
                      active === s ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Terminal />
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div ref={progress} aria-hidden className="h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-blue-400" />
      </header>

      <main id="top" className="relative z-10 font-sans">
        <section className="relative flex min-h-[100svh] flex-col justify-center px-5 pb-28 pt-28 sm:px-10 md:px-16 lg:px-20">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-[11px]">
            <div className="text-accent">EXP 00 {"//"} Cybersecurity · SOC · Sri Lanka</div>
            <div className="flex items-center gap-2" role="group" aria-label="3D background">
              <span className="hidden sm:inline">Field:</span>
              {(["waves", "knot"] as const).map((l, n) => (
                <button
                  key={l}
                  onClick={() => setMode(l)}
                  aria-pressed={mode === l}
                  className={`rounded-full border px-3 py-1.5 capitalize transition-colors ${
                    mode === l ? "border-accent bg-accent/15 text-accent" : "border-white/15 hover:border-accent/60"
                  }`}
                >
                  0{n + 1} {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                Open to SOC internships
              </span>
              <span className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-300">
                <span className="text-accent">/</span> {profile.name}
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="mt-7 max-w-5xl text-6xl font-bold leading-[0.9] tracking-tighter sm:text-7xl md:text-[7rem]"
            >
              Building at the
              <br />
              edge of <span className="text-accent">code.</span>
            </motion.h1>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-8 max-w-xl"
            >
              <TypedRoles />
              <p className="mt-4 text-lg text-zinc-400 sm:text-xl">
                A cybersecurity undergraduate working toward a SOC Analyst role.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#projects" className="rounded-full bg-accent px-6 py-3 text-center font-semibold text-black shadow-[0_0_30px_-5px_var(--accent)] transition-transform hover:-translate-y-0.5 hover:opacity-90">
                  View projects
                </a>
                <a href={profile.resume} download className="rounded-full border border-white/20 px-6 py-3 text-center font-semibold transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_0_25px_-8px_var(--accent)]">
                  Download resume
                </a>
              </div>
            </motion.div>
          </div>

          <a
            href="#about"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-transform hover:translate-y-1"
          >
            Enter the field ↓
          </a>
        </section>

        <Ticker />
        <section id="about" className={section}>
          <motion.div {...reveal}>
            <Eyebrow n="01" label="About" />
            <div className="grid items-center gap-12 md:grid-cols-[1fr_400px]">
              <div>
                <h2 className={h2}>Investigating what happened, and why.</h2>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">{profile.bio}</p>
                <div className="mt-10 grid grid-cols-2 gap-3">
                  {facts.map(([big, small]) => (
                    <div key={small} className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/10 hover:shadow-[0_15px_40px_-20px_var(--accent)] ${glass}`}>
                      <div className="text-3xl font-bold text-accent">{big}</div>
                      <div className="mt-1 text-sm text-zinc-400">{small}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Currently working toward</div>
                  <ul className="mt-3 grid gap-2">
                    {roadmap.map((r) => (
                      <li key={r.label} className="chip flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-4 py-3 text-sm transition-colors hover:border-accent/50">
                        <span className={`h-2 w-2 rounded-full ${r.status === "In progress" ? "animate-pulse bg-accent" : "bg-zinc-500"}`} />
                        <span className="font-medium text-zinc-200">{r.label}</span>
                        <span className="ml-auto font-mono text-xs text-zinc-500">
                          {r.status} · {r.target}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 text-sm text-zinc-500">
                  APIIT Sri Lanka × University of Staffordshire · {profile.location}
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/40 to-transparent blur-2xl" />
                <Image
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  width={640}
                  height={853}
                  sizes="(min-width: 768px) 400px, 320px"
                  className="relative mx-auto aspect-[3/4] w-full max-w-xs rounded-3xl border border-accent/30 object-cover md:max-w-sm"
                />
              </div>
            </div>
          </motion.div>
        </section>

        <Divider />
        <section id="projects" className={section}>
          <motion.div {...reveal}>
            <Eyebrow n="02" label="Projects" />
            <h2 className={h2}>Things I&apos;ve built.</h2>
          </motion.div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((p, i) => {
              const featured = i === 0;
              return (
                <TiltCard
                  key={p.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: (i % 2) * 0.08 }}
                  className={`group flex flex-col overflow-hidden p-6 sm:p-8 ${card} ${glass} ${
                    featured ? "featured sm:col-span-2" : p.images ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">{p.meta}</span>
                    {featured && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">Featured</span>
                    )}
                  </div>
                  <h3 className={`mt-3 font-semibold tracking-tight ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{p.title}</h3>
                  <p className="mt-4 max-w-2xl leading-relaxed text-zinc-400">{p.description}</p>
                  {p.images && (
                    <div className="mt-8 grid gap-5 lg:grid-cols-2">
                      {p.images.map((src, k) => (
                        <a key={src} href={src} target="_blank" rel="noreferrer" className="group/img block overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl transition-colors hover:border-accent/50">
                          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <span className="ml-3 font-mono text-[11px] text-zinc-500">Power BI · page {k + 1} · click to enlarge</span>
                          </div>
                          <Image
                            src={src}
                            alt={`${p.title} dashboard page ${k + 1}`}
                            width={1429}
                            height={803}
                            sizes="(min-width: 1024px) 480px, 100vw"
                            className="aspect-[16/9] w-full object-contain transition-transform duration-500 group-hover/img:scale-[1.02]"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-xs text-accent transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-black">
                        {t}
                      </li>
                    ))}
                  </ul>
                  {(p.live || p.github) && (
                    <div className="mt-6 flex gap-3 pt-1 text-sm">
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-4 py-1.5 font-semibold text-black hover:opacity-90">
                          Live site ↗
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-4 py-1.5 hover:border-accent hover:text-accent">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  )}
                </TiltCard>
              );
            })}
          </div>
        </section>

        <Divider />
        <section id="labs" className={section}>
          <motion.div {...reveal}>
            <Eyebrow n="03" label="Labs" />
            <h2 className={h2}>
              Breaking in, <span className="text-accent">on purpose.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              The full VulnHub DC series, completed in my home lab. Each box is a deliberately vulnerable machine:
              find a way in, then work up to root.
            </p>
          </motion.div>

          <motion.div {...reveal} className={`mt-10 overflow-hidden rounded-2xl font-mono text-sm ${glass}`}>
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 text-xs text-zinc-500">kali@lab: ~/vulnhub/dc-series</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
              <span className="text-zinc-400">
                <span className="text-accent">$</span> ./progress --series dc
              </span>
              <div className="flex min-w-48 flex-1 items-center gap-3">
                <div
                  className="flex flex-1 gap-1"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={labs.length}
                  aria-valuenow={labs.length}
                  aria-label="DC series progress"
                >
                  {labs.map((lab, i) => (
                    <motion.span
                      key={lab.name}
                      title={lab.name}
                      initial={{ opacity: 0.15 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: 0.3 + i * 0.12 }}
                      className="h-3 flex-1 rounded-sm bg-gradient-to-r from-accent to-blue-400 shadow-[0_0_12px_-2px_var(--accent)]"
                    />
                  ))}
                </div>
                <span className="whitespace-nowrap font-semibold text-accent">
                  {labs.length}/{labs.length} complete
                </span>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab, i) => (
              <TiltCard
                key={lab.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.07 }}
                className={`flex flex-col overflow-hidden p-6 ${card} ${glass}`}
              >
                <span aria-hidden className="pointer-events-none absolute -right-2 -top-5 select-none font-mono text-8xl font-bold text-white/[0.04]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-mono text-2xl font-semibold tracking-tight">{lab.name}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Completed
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">{lab.focus}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {lab.tags.map((t) => (
                    <li key={t} className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[11px] text-accent">
                      {t}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </section>

        <Divider />
        <section id="skills" className={section}>
          <motion.div {...reveal}>
            <Eyebrow n="04" label="Skills" />
            <h2 className={h2}>What I work with.</h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([group, items], i) => (
              <TiltCard
                key={group}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }}
                className={`p-6 ${card} ${glass}`}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent">{group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li key={s} className="chip rounded-full px-3 py-1.5 text-sm text-zinc-200 transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/15 hover:text-accent">
                      {s}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </section>

        <Divider />
        <section id="contact" className={`${section} pb-32`}>
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-[2rem] border border-accent/30 bg-background bg-gradient-to-br from-accent/15 via-white/[0.03] to-blue-500/10 p-5 sm:p-10 lg:p-14"
          >
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "linear-gradient(var(--foreground) 1px,transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
            />
            <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <Eyebrow n="05" label="Contact" />
                <h2 className="text-[clamp(2.75rem,8vw,4.5rem)] font-bold tracking-tighter">
                  Let&apos;s <span className="text-accent">talk.</span>
                </h2>
                <p className="mt-6 max-w-md text-lg text-zinc-400">
                  Open to SOC analyst internships and security-focused roles. I reply fast.
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-8 block break-all rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4 font-mono text-sm text-accent transition-colors hover:bg-accent/20 sm:text-base"
                >
                  {profile.email} →
                </a>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  {socials.map(([label, href, dl]) => (
                    <a
                      key={label}
                      href={href}
                      target={dl ? undefined : "_blank"}
                      rel="noreferrer"
                      {...(dl ? { download: true } : {})}
                      className="chip rounded-xl px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                    >
                      {label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="surface-strong rounded-3xl p-5 shadow-[0_0_60px_-20px_var(--accent)] sm:p-8">
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{"// Send a message"}</div>
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-10 md:px-16 lg:px-20">
          <div>
            <div className="font-mono text-lg font-semibold text-accent">JN</div>
            <p className="mt-3 font-semibold">{profile.name}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {profile.title}
              <br />
              {profile.location}
            </p>
          </div>
          <nav aria-label="Footer">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Explore</div>
            <ul className="mt-4 grid gap-2 text-sm">
              {NAV.map((s) => (
                <li key={s}>
                  <a href={`#${s}`} className="capitalize text-zinc-300 transition-colors hover:text-accent">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Connect</div>
            <ul className="mt-4 grid gap-2 text-sm">
              <li>
                <a href={`mailto:${profile.email}`} className="text-zinc-300 transition-colors hover:text-accent">
                  Email
                </a>
              </li>
              {socials.map(([label, href, dl]) => (
                <li key={label}>
                  <a
                    href={href}
                    target={dl ? undefined : "_blank"}
                    rel="noreferrer"
                    {...(dl ? { download: true } : {})}
                    className="text-zinc-300 transition-colors hover:text-accent"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 font-mono text-xs text-zinc-500 sm:px-10 md:px-16 lg:px-20">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>Built with Next.js, Tailwind CSS and three.js</span>
            <a href="#top" className="text-accent transition-transform hover:-translate-y-0.5">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
