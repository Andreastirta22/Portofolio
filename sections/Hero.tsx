"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

const slides = [
  {
    year: "2023",
    title: "PIM 2023",
    role: "Head Crew",
    impact: "Led operational team for large-scale event execution",
    desc: "My first leadership role — managing team coordination and ensuring event runs smoothly.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/PIM-2023.jpg",
    team: "20+",
    scale: "Large Event",
    accent: "#C8A96E",
    index: "01",
  },
  {
    year: "2024",
    title: "Bandung 2024",
    role: "Head Crew",
    impact: "Improved coordination and execution efficiency",
    desc: "Handling larger responsibilities while strengthening team management and problem solving.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/BANDUNG-2024.jpg",
    team: "25+",
    scale: "Regional Event",
    accent: "#7EB8C9",
    index: "02",
  },
  {
    year: "2024",
    title: "PIM 2024",
    role: "Head Crew",
    impact: "Managed bigger team with higher event complexity",
    desc: "Scaling leadership skills — balancing pressure, logistics, and team performance.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/PIM-2024.jpg",
    team: "30+",
    scale: "Large Event",
    accent: "#B5A0D8",
    index: "03",
  },
  {
    year: "2025",
    title: "Bandung 2025",
    role: "Senior Head Crew",
    impact: "Mentoring team & optimizing workflow",
    desc: "Not just leading — but guiding others and improving overall system efficiency.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/BANDUNG-2025.jpg",
    team: "35+",
    scale: "Regional Event",
    accent: "#9FC98A",
    index: "04",
  },
  {
    year: "2025",
    title: "PIM 2025",
    role: "Event Manager",
    impact: "Led full event execution & strategic planning",
    desc: "From execution to strategy — overseeing the entire event and ensuring success at every level.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/PIM-2025.jpg",
    team: "100+",
    scale: "Major Event",
    accent: "#E8836A",
    index: "05",
  },
];

// Particle component for ambient effect
function Particles({ accent }: { accent: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
      offset: Math.random() * 40,
    }));
  }, []); // ← penting

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: accent,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -30 - p.offset, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [current, setCurrent] = useState(0);
  const [showCVModal, setShowCVModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const bgX = useTransform(smoothX, [-1, 1], ["-2%", "2%"]);
  const bgY = useTransform(smoothY, [-1, 1], ["-2%", "2%"]);

  useEffect(() => setMounted(true), []);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 900);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 900);
  }, [isTransitioning]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [current, paused, next]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (locked) return;
    setLocked(true);
    setPaused(true);
    if (e.deltaY > 0) next();
    else prev();
    setTimeout(() => setLocked(false), 900);
    setTimeout(() => setPaused(false), 3500);
  };

  if (!mounted) return null;

  const active = slides[current];

  return (
    <div className="h-screen w-full p-4 md:p-6 bg-gradient-to-b from-[#e8e1d1] via-[#d6cebb] to-[#0a0a0a]">
      {/* ── CV MODAL ── */}
      <AnimatePresence>
        {showCVModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setShowCVModal(false)}
            />
            <motion.div
              className="relative z-10 bg-[#111] text-white rounded-3xl p-8 w-[320px] border border-white/10"
              style={{
                boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 80px ${active.accent}22`,
              }}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* accent bar */}
              <div
                className="w-12 h-1 rounded-full mb-6"
                style={{ backgroundColor: active.accent }}
              />
              <h3 className="text-xl font-light tracking-wide mb-2">
                Download CV
              </h3>
              <p className="text-white/40 text-sm mb-6">
                Choose your preferred language
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "🇮🇩  Bahasa Indonesia", href: "/cv-id.pdf" },
                  { label: "🇺🇸  English", href: "/cv-en.pdf" },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    download
                    className="group flex items-center justify-between px-5 py-4 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-sm"
                  >
                    <span>{label}</span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-white/50">
                      ↓
                    </span>
                  </a>
                ))}
              </div>
              <button
                onClick={() => setShowCVModal(false)}
                className="mt-5 w-full text-center text-xs text-white/20 hover:text-white/50 transition"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN SECTION ── */}
      <motion.section
        ref={containerRef}
        onWheel={!isMobile ? handleWheel : undefined}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        drag={!isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragStart={!isMobile ? () => setPaused(true) : undefined}
        onDragEnd={
          !isMobile
            ? (_, info) => {
                if (info.offset.y < -60) next();
                if (info.offset.y > 60) prev();
                setTimeout(() => setPaused(false), 3000);
              }
            : undefined
        }
        className="relative w-full h-full overflow-hidden rounded-[36px] border border-white/10 backdrop-blur-xl"
        style={{
          background: "linear-gradient(180deg, #0a0a0a, #050505)",
          boxShadow: `
    0 40px 120px rgba(0,0,0,0.8),
    inset 0 1px 0 rgba(255,255,255,0.06),
    inset 0 -1px 0 rgba(255,255,255,0.04)
  `,
        }}
      >
        {/* ── PARALLAX BACKGROUND ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.image + "-bg"}
            className="absolute inset-[-4%] z-0"
            style={!isMobile ? { x: bgX, y: bgY } : undefined}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={active.image}
              className="w-full h-full object-cover"
              alt={active.title}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── OVERLAYS ── */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* ── ACCENT GLOW ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.accent}
            className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] z-[1] pointer-events-none"
            style={{ backgroundColor: active.accent }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>

        {/* ── PARTICLES ── */}
        <Particles accent={active.accent} />

        {/* ── NOISE TEXTURE OVERLAY ── */}
        <div
          className="absolute inset-0 z-[3] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />

        {/* ── TOP BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8"
        >
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-2 h-2 rounded-full bg-white/60" />
            </motion.div>
            <div>
              <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
                Leadership Journey
              </p>
              <p className="text-xs text-white/60">2023 — 2025</p>
            </div>
          </div>

          {/* Slide counter */}
          <div className="hidden md:flex items-center gap-2 text-white/30 text-xs tracking-widest">
            <span className="text-white/70 font-medium">{active.index}</span>
            <span>/</span>
            <span>05</span>
          </div>
        </motion.div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-2xl text-white w-full">
            {/* Role pill */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.role + "-pill"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-5"
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: active.accent }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-xs tracking-[0.2em] uppercase font-medium"
                  style={{ color: active.accent }}
                >
                  {active.role}
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/40 text-xs tracking-widest">
                  {active.year}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <div className="overflow-hidden mb-5">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={active.title}
                  className="font-extralight leading-none tracking-tight"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 7.5rem)",
                    fontFamily: "'Georgia', 'Playfair Display', serif",
                  }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-60%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {active.title}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Divider */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.accent + "-line"}
                className="h-px mb-5 origin-left"
                style={{ backgroundColor: active.accent, opacity: 0.5 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              />
            </AnimatePresence>

            {/* Impact */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.impact}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <p className="text-base md:text-lg font-medium text-white/90 mb-2 leading-snug">
                  {active.impact}
                </p>
                <p className="text-sm md:text-base text-white/50 max-w-md leading-relaxed">
                  {active.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Stats badges */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title + "-badges"}
                className="flex flex-wrap gap-2 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {[
                  { label: "Team", value: active.team },
                  { label: "Role", value: active.role },
                  { label: "Scale", value: active.scale },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs"
                  >
                    <span className="text-white/30">{label}</span>
                    <span className="text-white/80 font-medium">{value}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-3 mt-8 md:mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              {/* Primary CTA */}
              <motion.button
                onClick={onExplore}
                className="group relative flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-black overflow-hidden"
                style={{ backgroundColor: "white" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* shine sweep */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10">🚀 Explore Experience</span>
                <motion.span
                  className="relative z-10"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  →
                </motion.span>
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                onClick={() => setShowCVModal(true)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium border border-white/20 text-white/80 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                ⬇ Download CV
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── PREVIEW CARD (desktop) ── */}
        <div className="hidden lg:block absolute right-10 xl:right-16 top-1/2 -translate-y-1/2 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[(current + 1) % slides.length].image}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              style={{ width: 200, height: 130 }}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              onClick={() => {
                setPaused(true);
                next();
                setTimeout(() => setPaused(false), 3000);
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={slides[(current + 1) % slides.length].image}
                className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white/50 text-[10px] tracking-widest uppercase">
                  Next
                </p>
                <p className="text-white text-xs font-medium">
                  {slides[(current + 1) % slides.length].title}
                </p>
              </div>
              {/* hover arrow */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs">↓</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── SIDE NAV DOTS ── */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 items-center">
          {slides.map((slide, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setPaused(true);
                setIsTransitioning(true);
                setCurrent(i);
                setTimeout(() => {
                  setIsTransitioning(false);
                  setPaused(false);
                }, 900);
              }}
              className="relative flex items-center justify-center"
              style={{ width: 20, height: 24 }}
              title={slide.title}
            >
              <motion.div
                className="rounded-full"
                animate={
                  i === current
                    ? {
                        width: 2,
                        height: 28,
                        backgroundColor: active.accent,
                      }
                    : {
                        width: 2,
                        height: 8,
                        backgroundColor: "rgba(255,255,255,0.2)",
                      }
                }
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.button>
          ))}
        </div>

        {/* ── BOTTOM TIMELINE (desktop) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden md:flex absolute bottom-6 left-16 right-16 z-20 items-end gap-0"
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
              onClick={() => {
                setPaused(true);
                setIsTransitioning(true);
                setCurrent(i);
                setTimeout(() => {
                  setIsTransitioning(false);
                  setPaused(false);
                }, 900);
              }}
            >
              <motion.p
                className="text-[10px] tracking-widest transition-all duration-300"
                animate={{
                  color: i === current ? "#fff" : "rgba(255,255,255,0.2)",
                }}
              >
                {slide.title}
              </motion.p>
              <motion.div
                className="w-full h-[2px] rounded-full origin-left"
                animate={{
                  backgroundColor:
                    i === current ? active.accent : "rgba(255,255,255,0.1)",
                  scaleX: i === current ? 1 : 0.4,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </motion.div>

        {/* ── PROGRESS BAR ── */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] z-30 bg-white/5">
          <motion.div
            key={current + "-progress"}
            className="h-full rounded-full"
            style={{ backgroundColor: active.accent }}
            initial={{ width: "0%" }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[4] rounded-[36px]">
          <div className="absolute inset-0 rounded-[36px] border border-white/10" />
          <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-white/[0.06] to-transparent" />
        </div>

        {/* ── KEYBOARD HINT ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 right-6 z-20 hidden md:flex items-center gap-1.5 text-white/20 text-[10px] tracking-widest"
        >
          <span className="border border-white/20 rounded px-1.5 py-0.5 text-[9px]">
            ↑
          </span>
          <span className="border border-white/20 rounded px-1.5 py-0.5 text-[9px]">
            ↓
          </span>
          <span>scroll to navigate</span>
        </motion.div>

        <div className="absolute inset-0 -z-10">
          {/* base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#050505]" />

          {/* subtle warm glow (biar nyatu sama image lu) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(200,169,110,0.15),transparent_40%)]" />

          {/* cool tone balance */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(126,184,201,0.12),transparent_45%)]" />

          {/* vignette biar cinematic */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6))]" />
        </div>
      </motion.section>
    </div>
  );
}
