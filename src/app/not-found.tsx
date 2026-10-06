import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">Error 404 {"//"} Not found</p>
      <h1 className="mt-6 text-[clamp(3rem,12vw,8rem)] font-bold leading-none tracking-tighter">
        Nothing in the <span className="text-accent">logs.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-zinc-400">
        This page doesn&apos;t exist, or it moved. The trail goes cold here.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-accent px-6 py-3 font-semibold text-black shadow-[0_0_30px_-5px_var(--accent)] transition-transform hover:-translate-y-0.5"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
