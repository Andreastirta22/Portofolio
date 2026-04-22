"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── Stagger helper ─── */
const stagger = (i: number) => ({ delay: 0.1 + i * 0.12 });

/* ─── Animated letter-by-letter text ─── */
function SplitText({
  text,
  className,
  baseDelay = 0,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: baseDelay + i * 0.035,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: ch === " " ? "inline" : "inline-block",
            transformOrigin: "bottom",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Parallax image wrapper ─── */
function ParallaxImage() {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const sy = useSpring(y, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const onScroll = () => y.set(window.scrollY * 0.25);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [y]);

  return (
    <motion.div
      ref={ref}
      style={{ y: sy }}
      className="absolute inset-0 scale-110"
    >
      <div
        className="
  h-full w-full 
  bg-cover 
  bg-[position:75%_center] 
  sm:bg-[position:70%_center] 
  md:bg-center
"
        style={{ backgroundImage: "url('/visualism/andre.webp')" }}
      />
    </motion.div>
  );
}

/* ─── Floating tag badge ─── */
function FloatingTag({
  label,
  sub,
  className,
}: {
  label: string;
  sub: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      className={`absolute hidden md:flex flex-col gap-0.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md ${className}`}
    >
      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
        {sub}
      </span>
      <span className="text-sm font-semibold text-white">{label}</span>
    </motion.div>
  );
}

/* ─── Horizontal marquee strip ─── */
const MARQUEE_ITEMS = [
  "React",
  "·",
  "Three.js",
  "·",
  "Motion",
  "·",
  "Figma",
  "·",
  "GSAP",
  "·",
  "WebGL",
  "·",
  "Next.js",
  "·",
  "Tailwind",
];

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/10 bg-black/30 backdrop-blur-sm py-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        className="flex whitespace-nowrap gap-6 w-max"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.25em] text-white/30 uppercase"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main component ─── */
export default function Landing() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
        {/* ── Background parallax image ── */}
        <ParallaxImage />

        {/* ── Cinematic vignette gradient layers ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

        {/* ── Noise grain ── */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('/noise.webp')" }}
        />

        {/* ── Animated accent line (left edge) ── */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ originY: 0 }}
          className="absolute left-6 top-24 bottom-24 hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"
        />

        {/* ── Floating tags ── */}
        <FloatingTag
          label="Bekasi, Indonesia"
          sub="Based in"
          className="right-10 top-32"
        />
        <FloatingTag
          label="Open to Work"
          sub="Status"
          className="right-10 top-52"
        />

        {/* ── Main hero content ── */}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20">
          {/* Role label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-white/40" />
            <span className="text-[10px] tracking-[0.35em] text-white/50 uppercase">
              Creative Developer & Visual Designer
            </span>
          </motion.div>

          {/* Name — split letter animation */}
          <h1
            className="font-extrabold leading-[0.88] tracking-tight"
            style={{ perspective: "600px" }}
          >
            <div className="overflow-hidden text-[clamp(3.5rem,10vw,8.5rem)]">
              <SplitText text="ANDREAS" baseDelay={0.4} />
            </div>
            <div className="overflow-hidden text-[clamp(3.5rem,10vw,8.5rem)]">
              <SplitText text="TIRTA" baseDelay={0.65} />
            </div>
            <div className="overflow-hidden flex items-end gap-4">
              <SplitText
                text="SANJAYA"
                baseDelay={0.9}
                className="text-[clamp(3.5rem,10vw,8.5rem)]"
              />
              {/* Year badge inline with last word */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mb-2 md:mb-4 text-xs tracking-[0.2em] text-white/30 self-end hidden sm:block"
              >
                © 2022
              </motion.span>
            </div>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
            className="mt-8 max-w-sm text-sm md:text-base text-white/50 leading-relaxed"
          >
            I craft digital experiences that blend
            <br className="hidden md:block" />
            creativity, code, and emotion.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="mt-10 flex items-center gap-6"
          >
            <button className="group relative overflow-hidden rounded-full border border-white/20 px-7 py-3 text-xs tracking-[0.2em] uppercase text-white transition-all hover:border-white/60">
              <span className="relative z-10">View Work</span>
              <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="absolute inset-0 translate-y-full text-black flex items-center justify-center text-xs tracking-[0.2em] uppercase transition-transform duration-300 ease-out group-hover:translate-y-0">
                View Work
              </span>
            </button>

            <motion.a
              whileHover={{ x: 4 }}
              href="#"
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
            >
              <span>Contact</span>
              <span>→</span>
            </motion.a>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.35em] text-white/30 uppercase">
            Scroll
          </span>
          <div className="h-10 w-px overflow-hidden bg-white/10 rounded-full">
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1/2 w-full bg-gradient-to-b from-transparent via-white/60 to-transparent"
            />
          </div>
        </motion.div>

        {/* ── Marquee strip ── */}
        <Marquee />
      </section>
    </>
  );
}
