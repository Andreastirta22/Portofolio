"use client";

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
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(232,228,220,0.2)",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Skill Matrix
                </span>
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

              {skillGroups.map((group, i) => {
                const avg = getAverage(group.skills);
                const isActive = activeCard === i;
                const isHovered = hoveredCard === i;
                const color = PALETTE[i % PALETTE.length];

                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.09,
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => setActiveCard(isActive ? null : i)}
                    onHoverStart={() => setHoveredCard(i)}
                    onHoverEnd={() => setHoveredCard(null)}
                    style={{ position: "relative", cursor: "pointer" }}
                  >
                    {/* Hover / active bg fill */}
                    <AnimatePresence>
                      {(isHovered || isActive) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: isActive
                              ? `linear-gradient(90deg, rgba(232,228,220,0.04) 0%, transparent 100%)`
                              : "rgba(232,228,220,0.02)",
                            pointerEvents: "none",
                            zIndex: 0,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Left accent bar (active only) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "1px",
                            background: color.accent,
                            transformOrigin: "top",
                            zIndex: 1,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        padding: "1.4rem 1.4rem 1.4rem 1.6rem",
                        borderTop: "1px solid rgba(232,228,220,0.07)",
                        borderBottom: isActive
                          ? "1px solid rgba(232,228,220,0.1)"
                          : "1px solid transparent",
                        transition: "border-color 0.3s",
                      }}
                    >
                      {/* Card Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1.1rem",
                          paddingRight: "1.5rem",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: "0 0 0.3rem",
                              fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                              fontWeight: 500,
                              fontFamily: "'DM Serif Display', Georgia, serif",
                              color: isActive
                                ? color.accent
                                : "rgba(232,228,220,0.75)",
                              transition: "color 0.35s",
                              letterSpacing: "0.01em",
                            }}
                          >
                            {group.title}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "10px",
                              color: "rgba(232,228,220,0.2)",
                              fontFamily: "'DM Mono', monospace",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {group.skills?.length} technologies
                          </p>
                        </div>

                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {mounted && (
                            <Counter
                              value={avg}
                              color={
                                isActive
                                  ? color.accent
                                  : "rgba(232,228,220,0.3)"
                              }
                            />
                          )}
                          <span
                            style={{
                              fontSize: "9px",
                              color: "rgba(232,228,220,0.18)",
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            avg %
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div
                        style={{
                          height: "1px",
                          background: "rgba(232,228,220,0.07)",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.25 + i * 0.08,
                            duration: 1.1,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            height: "100%",
                            width: `${avg}%`,
                            background: `linear-gradient(90deg, transparent 0%, ${color.accent} 100%)`,
                            transformOrigin: "left",
                          }}
                        />
                      </div>

                      {/* Expanded skill list */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                paddingTop: "1.6rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                              }}
                            >
                              {group.skills.map((skill: any, idx: number) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: idx * 0.055,
                                    duration: 0.4,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: "0.45rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "rgba(232,228,220,0.4)",
                                        fontFamily: "'DM Mono', monospace",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {skill.name}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: color.accent,
                                        fontFamily: "'DM Mono', monospace",
                                      }}
                                    >
                                      {skill.value}%
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      height: "1px",
                                      background: "rgba(232,228,220,0.05)",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <motion.div
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 1 }}
                                      transition={{
                                        delay: 0.08 + idx * 0.045,
                                        duration: 0.8,
                                        ease: [0.22, 1, 0.36, 1],
                                      }}
                                      style={{
                                        height: "100%",
                                        width: `${skill.value}%`,
                                        background: `linear-gradient(90deg, rgba(232,228,220,0.2) 0%, ${color.accent} 100%)`,
                                        transformOrigin: "left",
                                      }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Toggle + indicator */}
                      <motion.div
                        animate={{ rotate: isActive ? 45 : 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          position: "absolute",
                          top: "1.4rem",
                          right: "1.1rem",
                          width: 16,
                          height: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isActive
                            ? color.accent
                            : "rgba(232,228,220,0.2)",
                          fontSize: "18px",
                          lineHeight: 1,
                          transition: "color 0.3s",
                          fontWeight: 300,
                        }}
                      >
                        +
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Bottom rule */}
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
