"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";

// Card that tilts in 3D toward the cursor and shows a soft glare where the pointer is.
export default function TiltCard({
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children: React.ReactNode }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    rx.set((0.5 - y) * 10);
    ry.set((x - 0.5) * 12);
    e.currentTarget.style.setProperty("--gx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--gy", `${y * 100}%`);
  }

  function leave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      {...props}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, ...props.style }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [background:radial-gradient(400px_circle_at_var(--gx)_var(--gy),rgba(45,212,191,0.14),transparent_60%)] group-hover/tilt:opacity-100" />
      {children}
    </motion.div>
  );
}
