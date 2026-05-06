"use client";

import SkillsMatrix from "./about/SkillsMatrix";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FlipCard from "@/components/FlipCard";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────────
   PALETTE — refined monochromatic with fine
   single-hue accent shifts per card
───────────────────────────────────────────── */
const PALETTE = [
  { accent: "#E8E4DC", dim: "rgba(232,228,220,0.12)", bar: "#E8E4DC" },
  { accent: "#C4C0B8", dim: "rgba(196,192,184,0.10)", bar: "#C4C0B8" },
  { accent: "#A09C94", dim: "rgba(160,156,148,0.10)", bar: "#A09C94" },
  { accent: "#787470", dim: "rgba(120,116,112,0.10)", bar: "#787470" },
];

/* ─────────────────────────────────────────────
   STAGGER CHARS — 3-D letterfall
───────────────────────────────────────────── */
const STAGGER_CHARS = (text: string, delay = 0) =>
  text.split("").map((char, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 48, rotateX: -90, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{
        delay: delay + i * 0.028,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ display: "inline-block", transformOrigin: "bottom" }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ));

/* ─────────────────────────────────────────────
   SCANLINE — subtle CRT atmosphere
───────────────────────────────────────────── */
const Scanlines = () => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      pointerEvents: "none",
      zIndex: 0,
    }}
  />
);

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
const Counter = ({ value, color }: { value: number; color: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const step = () => {
      start += 2;
      if (start >= value) {
        setDisplay(value);
        return;
      }
      setDisplay(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return (
    <motion.span
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontStyle: "italic",
        fontSize: "clamp(1.6rem, 4vw, 2rem)",
        lineHeight: 1,
        display: "block",
        color,
      }}
    >
      {display}
    </motion.span>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const [activeTab, setActiveTab] = useState("skills");
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const noiseOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.3, 0.5, 0.3],
  );
  const lineScale = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);
  const smoothLine = useSpring(lineScale, { stiffness: 90, damping: 24 });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const { data } = await supabase
        .from("skill_groups")
        .select("*")
        .order("order", { ascending: true });
      setSkillGroups(data || []);
    };
    fetchData();
  }, []);

  const getAverage = (skills: any[]) =>
    Math.round(skills.reduce((acc, s) => acc + s.value, 0) / skills.length);

  /* ── RESPONSIVE breakpoint via CSS var injection ── */
  const css = `
    :root { --about-cols: 1fr; --about-pad: 1.25rem; --about-gap: 2.5rem; }
    @media (min-width: 768px) {
      :root { --about-cols: 1fr 1.1fr; --about-pad: 2rem; --about-gap: 3rem; }
    }
    @media (min-width: 1100px) {
      :root { --about-pad: 2.5rem; }
    }
    .about-grid { display: grid; grid-template-columns: var(--about-cols); gap: var(--about-gap); align-items: start; }
    .about-wrap { max-width: 1280px; margin: 0 auto; padding: 0 var(--about-pad); }
    .about-header { margin-bottom: clamp(3rem, 6vw, 6rem); }
    @media (max-width: 767px) {
      .about-flipwrap { max-width: 320px; margin: 0 auto 2.5rem; }
      .about-biotext { font-size: 1rem !important; }
      .about-cta { flex-direction: column !important; }
      .about-cta button { width: 100%; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <section
        id="about"
        ref={sectionRef}
        style={{
          background: "#080808",
          color: "#E8E4DC",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(6rem, 12vw, 11rem) 0",
          scrollMarginTop: "5rem",
        }}
      >
        {/* ── DEEP VIGNETTE ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 100% at 50% 0%, transparent 50%, #000 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── SUBTLE RADIAL GLOW (static) ── */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            y: bgY,
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 15% 25%, rgba(232,228,220,0.025) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 85% 75%, rgba(232,228,220,0.018) 0%, transparent 70%)
            `,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── GRAIN OVERLAY ── */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: noiseOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "256px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <Scanlines />

        {/* ── BIG GHOST NUMBER ── */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "-0.08em",
            right: "-0.04em",
            fontSize: "clamp(160px, 28vw, 400px)",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            color: "transparent",
            WebkitTextStroke: "1px rgba(232,228,220,0.035)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.04em",
            zIndex: 1,
          }}
        >
          02
        </motion.div>

        {/* ── HORIZONTAL RULE TOP ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(232,228,220,0.15) 30%, rgba(232,228,220,0.15) 70%, transparent 100%)",
            transformOrigin: "center",
            zIndex: 2,
          }}
        />

        {/* ════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════ */}
        <div className="about-wrap" style={{ position: "relative", zIndex: 3 }}>
          {/* ── HEADER ── */}
          <div className="about-header">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <motion.div
                style={{
                  height: "1px",
                  background: "rgba(232,228,220,0.5)",
                  scaleX: smoothLine,
                  transformOrigin: "left",
                  width: "48px",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(232,228,220,0.45)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                About Me
              </span>
            </motion.div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                margin: 0,
                perspective: "900px",
              }}
            >
              <div style={{ display: "block", overflow: "visible" }}>
                {STAGGER_CHARS("Building", 0)}
              </div>

              <div
                style={{
                  display: "block",
                  overflow: "visible",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "rgba(232,228,220,0.22)",
                }}
              >
                {STAGGER_CHARS("effortless", 0.2)}
              </div>

              <div style={{ display: "block", overflow: "visible" }}>
                {STAGGER_CHARS("interfaces.", 0.38)}
              </div>
            </h2>
            {/* ── TICKER STRIP ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                marginTop: "clamp(2rem, 4vw, 3rem)",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(232,228,220,0.07)",
                display: "flex",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Years active", val: 4 },
                { label: "Projects shipped", val: 32 },
                { label: "Clients worldwide", val: 18 },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  {mounted && (
                    <Counter value={stat.val} color="rgba(232,228,220,0.75)" />
                  )}
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(232,228,220,0.25)",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="about-grid">
            {/* ═══════════ LEFT COLUMN ═══════════ */}
            <div>
              {/* FlipCard with refined frame */}
              <motion.div
                initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="about-flipwrap"
                style={{ position: "relative", marginBottom: "2.5rem" }}
              >
                {/* Animated corner brackets */}
                {[
                  { top: -10, left: -10 },
                  { top: -10, right: -10 },
                  { bottom: -10, left: -10 },
                  { bottom: -10, right: -10 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.7 + i * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      position: "absolute",
                      width: 18,
                      height: 18,
                      borderTop:
                        i < 2 ? "1px solid rgba(232,228,220,0.4)" : undefined,
                      borderBottom:
                        i >= 2 ? "1px solid rgba(232,228,220,0.4)" : undefined,
                      borderLeft:
                        i % 2 === 0
                          ? "1px solid rgba(232,228,220,0.4)"
                          : undefined,
                      borderRight:
                        i % 2 === 1
                          ? "1px solid rgba(232,228,220,0.4)"
                          : undefined,
                      ...pos,
                    }}
                  />
                ))}

                {/* Subtle spotlight beneath card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: "10%",
                    right: "10%",
                    height: 60,
                    background:
                      "radial-gradient(ellipse at center, rgba(232,228,220,0.06) 0%, transparent 70%)",
                    filter: "blur(10px)",
                    pointerEvents: "none",
                  }}
                />

                <FlipCard />
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.75 }}
                className="about-biotext"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1.1rem",
                  lineHeight: 2,
                  color: "rgba(232,228,220,0.4)",
                  maxWidth: "420px",
                  margin: 0,
                }}
              >
                Frontend developer focused on clean UI and modern web
                technologies. Building with React, Next.js, and a passion for
                great design.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.65 }}
                className="about-cta"
                style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}
              >
                <motion.button
                  onClick={() => {
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 24px rgba(232,228,220,0.12)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "0.9rem 2.2rem",
                    background: "rgba(232,228,220,0.92)",
                    color: "#080808",
                    border: "none",
                    borderRadius: 1,
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  View Work
                </motion.button>

                <motion.button
                  onClick={() => {
                    window.open("https://wa.me/6285817446805", "_blank");
                  }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(232,228,220,0.5)",
                    color: "rgba(232,228,220,0.85)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "0.9rem 2.2rem",
                    background: "transparent",
                    color: "rgba(232,228,220,0.35)",
                    border: "1px solid rgba(232,228,220,0.15)",
                    borderRadius: 1,
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: "'DM Mono', monospace",
                    cursor: "pointer",
                    transition: "color 0.3s, border-color 0.3s",
                  }}
                >
                  Contact
                </motion.button>
              </motion.div>
            </div>

            {/* ═══════════ RIGHT: SKILL MATRIX ═══════════ */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {/* Header row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 0 1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { id: "core", label: "Core Stack" },
                    { id: "skills", label: "Skills" },
                    { id: "certificates", label: "Certificates" },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                      <motion.button
                        key={tab.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                          position: "relative",
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          color: isActive
                            ? "rgba(232,228,220,0.92)"
                            : "rgba(232,228,220,0.3)",
                          fontSize: "9px",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          fontFamily: "'DM Mono', monospace",
                          transition: "color 0.3s",
                        }}
                      >
                        {tab.label}

                        {isActive && (
                          <motion.div
                            layoutId="about-active-tab"
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              bottom: "-0.5rem",
                              height: "1px",
                              background: "#E8E4DC",
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    color: "rgba(232,228,220,0.15)",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {skillGroups.length} groups
                </span>
              </motion.div>

              {/* ───────────── TAB CONTENT ───────────── */}

              {activeTab === "skills" && (
                <SkillsMatrix
                  skillGroups={skillGroups}
                  activeCard={activeCard}
                  setActiveCard={setActiveCard}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  mounted={mounted}
                  getAverage={getAverage}
                  PALETTE={PALETTE}
                  Counter={Counter}
                />
              )}

              {activeTab === "core" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 py-10"
                >
                  {[
                    {
                      title: "Next.js",
                      desc: "Scalable frontend architecture with premium modern performance.",
                      icon: "▲",
                    },
                    {
                      title: "React",
                      desc: "Reusable interactive UI systems and immersive interfaces.",
                      icon: "⚛",
                    },
                    {
                      title: "TypeScript",
                      desc: "Strongly typed development for maintainable applications.",
                      icon: "</>",
                    },
                    {
                      title: "Tailwind CSS",
                      desc: "Utility-first styling for responsive premium experiences.",
                      icon: "✦",
                    },
                    {
                      title: "Framer Motion",
                      desc: "Smooth animations and motion-driven user interactions.",
                      icon: "◉",
                    },
                    {
                      title: "GSAP",
                      desc: "Cinematic transitions and advanced creative animations.",
                      icon: "◆",
                    },
                  ].map((stack, index) => (
                    <motion.div
                      key={stack.title}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                      }}
                      whileHover={{
                        y: -8,
                      }}
                      className="group relative overflow-hidden rounded-[28px]
        border border-[#2a2a2a]
        bg-[#111111]
        p-7
        transition-all duration-500
        hover:border-[#3d3d3d]
        hover:bg-[#151515]"
                    >
                      {/* glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-500"
                      >
                        <div
                          className="absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2
            rounded-full bg-white/5 blur-3xl"
                        />
                      </div>

                      {/* icon */}
                      <div
                        className="mb-8 flex h-14 w-14 items-center justify-center
          rounded-2xl border border-white/10 bg-white/[0.03]
          text-xl text-[#e8e4dc]"
                      >
                        {stack.icon}
                      </div>

                      {/* content */}
                      <div className="space-y-4">
                        <h3
                          className="text-2xl font-medium tracking-tight text-[#e8e4dc]"
                          style={{
                            fontFamily: "'Instrument Serif', serif",
                          }}
                        >
                          {stack.title}
                        </h3>

                        <p
                          className="text-sm leading-relaxed text-[#86868b]"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {stack.desc}
                        </p>
                      </div>

                      {/* bottom line */}
                      <div
                        className="mt-10 h-px w-full
          bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "certificates" && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1rem",
                    paddingTop: "0.5rem",
                  }}
                >
                  {[
                    {
                      title: "PCAP Programming Essentials",
                      issuer: "Python Institute",
                      year: "2026",
                      file: "/certificates/pcap-programming-essentials.pdf",
                    },
                    {
                      title: "Sertifikat Kompetensi",
                      issuer: "BNSP",
                      year: "2026",
                      file: "/certificates/sertifikat-kompetensi.pdf",
                    },
                  ].map((cert, i) => (
                    <motion.div
                      key={cert.title}
                      whileHover={{ y: -4 }}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        border: "1px solid rgba(232,228,220,0.08)",
                        background: "rgba(255,255,255,0.015)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* PDF Preview */}
                      <div
                        style={{
                          height: "180px",
                          borderBottom: "1px solid rgba(232,228,220,0.08)",
                          overflow: "hidden",
                          background: "#111",
                        }}
                      >
                        <iframe
                          src={cert.file}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            opacity: 0.8,
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ padding: "1.3rem" }}>
                        <p
                          style={{
                            margin: 0,
                            color: "rgba(232,228,220,0.9)",
                            fontFamily: "'DM Serif Display', Georgia, serif",
                            fontSize: "1rem",
                          }}
                        >
                          {cert.title}
                        </p>

                        <p
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: "1.3rem",
                            color: "rgba(232,228,220,0.28)",
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {cert.issuer} • {cert.year}
                        </p>

                        <a
                          href={cert.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            width: "100%",
                            padding: "0.85rem",
                            background: "transparent",
                            border: "1px solid rgba(232,228,220,0.1)",
                            color: "rgba(232,228,220,0.65)",
                            fontSize: "10px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            fontFamily: "'DM Mono', monospace",
                            cursor: "pointer",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                          }}
                        >
                          View Certificate
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: "1px",
                  background: "rgba(232,228,220,0.06)",
                  transformOrigin: "left",
                  marginTop: "1px",
                }}
              />
            </div>
          </div>

          {/* ── FOOTER STRIP ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9 }}
            style={{
              marginTop: "clamp(3.5rem, 7vw, 6rem)",
              paddingTop: "1.75rem",
              borderTop: "1px solid rgba(232,228,220,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                color: "rgba(232,228,220,0.15)",
                letterSpacing: "0.15em",
              }}
            >
              EST. 2021
            </span>

            {/* Animated marquee hint */}
            <motion.div
              animate={{ x: [0, 7, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "easeInOut",
              }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                color: "rgba(232,228,220,0.3)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Scroll to explore →
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
