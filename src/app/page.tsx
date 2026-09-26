"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Scene3D, { type SceneMode } from "@/components/Scene3D";
import ContactForm from "@/components/ContactForm";
import TiltCard from "@/components/TiltCard";
import { profile, projects, skills } from "@/data/portfolio";

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

const section = "relative mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28 md:px-16 lg:px-20";
const h2 = "text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tighter";
const glass = "border border-white/10 bg-white/[0.04]";

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

const facts = [
  ["Level 5", "BSc (Hons) Cyber Security"],
  ["2028", "Expected graduation"],
  ["SOC", "Target role"],
];

export default function Home() {
  const [mode, setMode] = useState<SceneMode>("waves");
  return (
    <>
      <Scene3D mode={mode} />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/5 bg-black/70 px-5 py-4 text-xs sm:px-10 sm:text-sm">
        <a href="#top" className="font-mono font-semibold text-accent transition-transform hover:scale-110">JN</a>
        <nav className="flex gap-4 text-zinc-300 sm:gap-5">
          {["about", "projects", "skills", "contact"].map((s) => (
            <a key={s} href={`#${s}`} className="capitalize transition-colors hover:text-accent hover:[text-shadow:0_0_14px_var(--accent)]">
              {s}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="relative z-10 font-sans">
        <section className="relative flex min-h-[100svh] flex-col justify-center px-5 pb-28 pt-28 sm:px-10 md:px-16 lg:px-20">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-[11px]">
            <div className="text-accent">EXP 00 // Cybersecurity · SOC · Sri Lanka</div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Field:</span>
              {(["waves", "knot"] as const).map((l, n) => (
                <button
                  key={l}
                  onClick={() => setMode(l)}
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
              <p className="text-lg text-zinc-400 sm:text-xl">
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

        <Divider />
        <section id="about" className={section}>
          <motion.div {...reveal}>
            <Eyebrow n="01" label="About" />
            <div className="grid items-center gap-12 md:grid-cols-[1fr_400px]">
              <div>
              <h2 className={h2}>Investigating what happened, and why.</h2>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">{profile.bio}</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {facts.map(([big, small]) => (
                  <div key={big} className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/10 hover:shadow-[0_15px_40px_-20px_var(--accent)] ${glass}`}>
                    <div className="text-3xl font-bold text-accent">{big}</div>
                    <div className="mt-1 text-sm text-zinc-400">{small}</div>
                  </div>
                ))}
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
                  priority
                  className="relative mx-auto aspect-[3/4] w-full max-w-xs rounded-3xl md:max-w-sm border border-accent/30 object-cover"
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
                  className={`group group/tilt relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8 transition-[border-color,box-shadow,background-color] duration-300 hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_var(--accent)] ${glass} ${
                    featured ? "sm:col-span-2 border-accent/40 bg-accent/[0.06]" : p.images ? "sm:col-span-2" : ""
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
                          <Image src={src} alt={`${p.title} dashboard page ${k + 1}`} width={1429} height={803} className="aspect-[16/9] w-full object-contain transition-transform duration-500 group-hover/img:scale-[1.02]" />
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
        <section id="skills" className={section}>
          <motion.div {...reveal}>
            <Eyebrow n="03" label="Skills" />
            <h2 className={h2}>What I work with.</h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([group, items], i) => (
              <TiltCard
                key={group}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }}
                className={`group/tilt relative rounded-3xl p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-[0_20px_50px_-25px_var(--accent)] ${glass}`}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent">{group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/15 hover:text-accent">
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
            className="relative overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-br from-accent/15 via-white/[0.03] to-blue-500/10 p-5 sm:p-10 lg:p-14"
          >
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
            />
            <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <Eyebrow n="04" label="Contact" />
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
                  {[
                    ["GitHub", profile.github, false],
                    ["LinkedIn", profile.linkedin, false],
                    ["Resume", profile.resume, true],
                  ].map(([label, href, dl]) => (
                    <a
                      key={label as string}
                      href={href as string}
                      target={dl ? undefined : "_blank"}
                      rel="noreferrer"
                      {...(dl ? { download: true } : {})}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                    >
                      {label as string} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_0_60px_-20px_var(--accent)] sm:p-8">
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{"// Send a message"}</div>
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="border-t border-white/5 px-6 py-8 text-center font-mono text-sm text-zinc-600 transition-colors hover:text-accent">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </>
  );
}
