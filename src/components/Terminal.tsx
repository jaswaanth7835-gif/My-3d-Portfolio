"use client";

import { useEffect, useRef, useState } from "react";
import { labs, profile, projects, roadmap, skills } from "@/data/portfolio";

type Line = { kind: "in" | "out" | "ok" | "err"; text: string };

const SECTIONS = ["about", "projects", "labs", "skills", "contact"];

const HELP = [
  "whoami      who is this?",
  "about       short bio",
  "projects    things I've built",
  "labs        CTF boxes completed",
  "skills      tools and languages",
  "roadmap     what I'm working toward",
  "contact     how to reach me",
  "resume      download my CV",
  "goto <x>    jump to: " + SECTIONS.join(", "),
  "theme       switch light / dark",
  "clear       clear the screen",
  "exit        close the terminal",
];

function run(raw: string, close: () => void): Line[] | "clear" {
  const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/);
  const out = (...t: string[]): Line[] => t.map((text) => ({ kind: "out", text }));
  const ok = (text: string): Line[] => [{ kind: "ok", text }];
  const goto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    close();
  };

  switch (cmd) {
    case "":
      return [];
    case "help":
    case "?":
      return out(...HELP);
    case "whoami":
      return out(profile.name, profile.title, profile.location);
    case "about":
      return out(profile.bio, "", profile.education);
    case "projects":
    case "ls":
      return out(...projects.map((p, i) => `${String(i + 1).padStart(2, "0")}  ${p.title}  [${p.tech.slice(0, 3).join(", ")}]`));
    case "labs":
      return [...out(...labs.map((l) => `[x] ${l.name.padEnd(5)} ${l.tags.join(" · ")}`)), ...ok(`${labs.length}/${labs.length} complete`)];
    case "skills":
      return out(...Object.entries(skills).map(([g, items]) => `${g.padEnd(15)} ${items.join(", ")}`));
    case "roadmap":
      return out(...roadmap.map((r) => `${r.status.padEnd(12)} ${r.label} (${r.target})`));
    case "contact":
      return out(`email     ${profile.email}`, `github    ${profile.github}`, `linkedin  ${profile.linkedin}`);
    case "resume":
    case "cv": {
      const a = document.createElement("a");
      a.href = profile.resume;
      a.download = "";
      a.click();
      return ok("Downloading resume…");
    }
    case "goto":
    case "cd":
      if (SECTIONS.includes(args[0])) {
        goto(args[0]);
        return ok(`Jumping to ${args[0]}…`);
      }
      return [{ kind: "err", text: `usage: goto <${SECTIONS.join("|")}>` }];
    case "theme": {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", next);
      } catch {}
      document.documentElement.setAttribute("data-theme", next);
      return ok(`Theme set to ${next}.`);
    }
    case "sudo":
      return [{ kind: "err", text: `${profile.name.split(" ")[0].toLowerCase()} is not in the sudoers file. This incident will be reported.` }];
    case "clear":
      return "clear";
    case "exit":
    case "quit":
      close();
      return [];
    default:
      if (SECTIONS.includes(cmd)) {
        goto(cmd);
        return ok(`Jumping to ${cmd}…`);
      }
      return [{ kind: "err", text: `command not found: ${cmd}. Type "help".` }];
  }
}

const WELCOME: Line[] = [
  { kind: "ok", text: `${profile.name} — portfolio shell` },
  { kind: "out", text: 'Type "help" to see what you can ask.' },
];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    opener.current?.focus();
  };

  // open with the backtick key (when not typing in a field); Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    body.current?.scrollTo(0, body.current.scrollHeight);
  }, [lines]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const raw = value;
    setValue("");
    setCursor(-1);
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    const result = run(raw, close);
    if (result === "clear") setLines([]);
    else setLines((l) => [...l, { kind: "in" as const, text: raw }, ...result].slice(-200));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const next = Math.max(-1, Math.min(history.length - 1, cursor + (e.key === "ArrowUp" ? 1 : -1)));
    setCursor(next);
    setValue(next === -1 ? "" : history[next]);
  }

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open terminal"
        title="Open terminal (press `)"
        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 font-mono text-[11px] font-semibold text-zinc-300 transition-colors hover:border-accent hover:text-accent"
      >
        {">_"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio terminal"
            onClick={(e) => {
              e.stopPropagation();
              input.current?.focus();
            }}
            className="terminal flex h-[min(70svh,520px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-accent/30 font-mono text-[13px] shadow-[0_30px_100px_-20px_var(--accent)]"
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <button type="button" onClick={close} aria-label="Close terminal" className="h-3 w-3 rounded-full bg-rose-400/80 transition-transform hover:scale-125" />
              <span className="h-3 w-3 rounded-full bg-amber-300/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
              <span className="ml-3 text-xs text-zinc-500">visitor@jn-portfolio: ~</span>
              <span className="ml-auto text-[11px] text-zinc-600">esc to close</span>
            </div>
            <div ref={body} className="flex-1 overflow-y-auto px-4 py-3 leading-relaxed" aria-live="polite">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap break-words ${
                    l.kind === "in" ? "text-zinc-200" : l.kind === "ok" ? "text-accent" : l.kind === "err" ? "text-rose-400" : "text-zinc-400"
                  }`}
                >
                  {l.kind === "in" ? (
                    <>
                      <span className="text-accent">$</span> {l.text}
                    </>
                  ) : (
                    l.text || String.fromCharCode(160)
                  )}
                </div>
              ))}
              <form onSubmit={submit} className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Terminal command"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={80}
                  className="flex-1 bg-transparent text-zinc-100 caret-accent outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
