"use client";

import { useState } from "react";

const field =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base outline-none transition-colors placeholder:text-zinc-500 hover:border-accent/50 hover:bg-white/[0.08] focus:border-accent focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(45,212,191,0.15)]";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    if (res?.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setError((await res?.json().catch(() => null))?.error ?? "Network error. Try email instead.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="sr-only" htmlFor="name">Name</label>
      <input id="name" name="name" required maxLength={100} placeholder="Your name" className={field} />
      <label className="sr-only" htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required placeholder="Your email" className={field} />
      <label className="sr-only" htmlFor="message">Message</label>
      <textarea id="message" name="message" required minLength={5} maxLength={5000} rows={5} placeholder="Message" className={field} />
      <div className="flex items-center gap-4">
        <button
          disabled={status === "sending"}
          className="rounded-full bg-accent px-7 py-3 font-semibold text-black shadow-[0_0_30px_-5px_var(--accent)] transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p role="status" className="text-sm text-zinc-400">
          {status === "sent" && "Thanks! I'll get back to you soon."}
          {status === "error" && error}
        </p>
      </div>
    </form>
  );
}
