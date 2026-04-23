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

const PALETTE = [
  { accent: "#C9A96E", glow: "rgba(201,169,110,0.15)" },
  { accent: "#7EB8D4", glow: "rgba(126,184,212,0.15)" },
  { accent: "#B87EC9", glow: "rgba(184,126,201,0.15)" },
  { accent: "#7EC9A9", glow: "rgba(126,201,169,0.15)" },
];

const STAGGER_CHARS = (text: string, delay = 0) =>
  text.split("").map((char, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 40, rotateX: -90 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: delay + i * 0.025,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ display: "inline-block", transformOrigin: "bottom" }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ));

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const smoothLine = useSpring(lineScale, { stiffness: 80, damping: 20 });

  useEffect(() => {
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

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: "#0C0C0E",
        color: "#E8E4DC",
        position: "relative",
        overflow: "hidden",
        padding: "10rem 0",
        scrollMarginTop: "6rem",
      }}
    >
      {/* ── BACKGROUND TEXTURE ── */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: bgY,
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(201,169,110,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 70%, rgba(126,184,212,0.04) 0%, transparent 70%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* ── NOISE GRAIN ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* ── LARGE BG NUMBER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        style={{
          position: "absolute",
          top: "-0.1em",
          right: "-0.05em",
          fontSize: "clamp(200px, 30vw, 420px)",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: "1px rgba(232,228,220,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}
      >
        02
      </motion.div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        {/* ── HEADER ── */}
        <div style={{ marginBottom: "6rem" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
                background: "#C9A96E",
                scaleX: smoothLine,
                transformOrigin: "left",
                width: "60px",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#C9A96E",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              About Me
            </span>
          </motion.div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(3rem, 6vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
              perspective: "800px",
            }}
          >
            <div style={{ display: "block", overflow: "visible" }}>
              {STAGGER_CHARS("Crafting", 0)}
            </div>
            <div
              style={{
                display: "block",
                overflow: "visible",
                fontStyle: "italic",
                fontWeight: 400,
                color: "rgba(232,228,220,0.35)",
              }}
            >
              {STAGGER_CHARS("digital", 0.2)}
            </div>
            <div style={{ display: "block", overflow: "visible" }}>
              {STAGGER_CHARS("experiences.", 0.4)}
            </div>
          </h2>
        </div>

        {/* ── MAIN GRID ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* ── LEFT ── */}
          <div>
            {/* FlipCard with frame */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "relative", marginBottom: "3rem" }}
            >
              {/* Corner decorations */}
              {[
                { top: -12, left: -12 },
                { top: -12, right: -12 },
                { bottom: -12, left: -12 },
                { bottom: -12, right: -12 },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                  style={{
                    position: "absolute",
                    width: 20,
                    height: 20,
                    borderTop: i < 2 ? "1px solid #C9A96E" : undefined,
                    borderBottom: i >= 2 ? "1px solid #C9A96E" : undefined,
                    borderLeft: i % 2 === 0 ? "1px solid #C9A96E" : undefined,
                    borderRight: i % 2 === 1 ? "1px solid #C9A96E" : undefined,
                    ...pos,
                  }}
                />
              ))}
              <FlipCard />
            </motion.div>

            {/* Bio text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "1.125rem",
                lineHeight: 1.9,
                color: "rgba(232,228,220,0.55)",
                maxWidth: "400px",
              }}
            >
              Frontend developer focused on clean UI and modern web
              technologies. Building with React, Next.js, and a passion for
              great design.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "0.85rem 2rem",
                  background: "#C9A96E",
                  color: "#0C0C0E",
                  border: "none",
                  borderRadius: 2,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontFamily: "'DM Mono', monospace",
                  cursor: "pointer",
                }}
              >
                View Work
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.04,
                  borderColor: "#C9A96E",
                  color: "#C9A96E",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "0.85rem 2rem",
                  background: "transparent",
                  color: "rgba(232,228,220,0.6)",
                  border: "1px solid rgba(232,228,220,0.2)",
                  borderRadius: 2,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
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

          {/* ── RIGHT: SKILL CARDS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 0 1.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(232,228,220,0.3)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Skill Matrix
              </span>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "rgba(232,228,220,0.2)",
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
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setActiveCard(isActive ? null : i)}
                  onHoverStart={() => setHoveredCard(i)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{ position: "relative" }}
                >
                  {/* Glow on hover */}
                  <AnimatePresence>
                    {(isHovered || isActive) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: color.glow,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "1.5rem",
                      borderTop: `1px solid ${isActive ? color.accent : "rgba(232,228,220,0.07)"}`,
                      borderBottom: isActive
                        ? `1px solid ${color.accent}`
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "border-color 0.3s",
                    }}
                  >
                    {/* Card Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: "0 0 0.25rem",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            fontFamily: "'DM Serif Display', Georgia, serif",
                            color: isActive ? color.accent : "#E8E4DC",
                            transition: "color 0.3s",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {group.title}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "rgba(232,228,220,0.3)",
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {group.skills?.length} technologies
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <motion.span
                          animate={{
                            color: isActive
                              ? color.accent
                              : "rgba(232,228,220,0.4)",
                          }}
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: "italic",
                            fontSize: "2rem",
                            lineHeight: 1,
                            display: "block",
                          }}
                        >
                          {avg}
                        </motion.span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "rgba(232,228,220,0.25)",
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
                        background: "rgba(232,228,220,0.08)",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + i * 0.1,
                          duration: 1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          height: "100%",
                          width: `${avg}%`,
                          background: color.accent,
                          transformOrigin: "left",
                          borderRadius: 1,
                        }}
                      />
                    </div>

                    {/* Expand: skill details */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              paddingTop: "1.5rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "1rem",
                            }}
                          >
                            {group.skills.map((skill: any, idx: number) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.06 }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "0.4rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "rgba(232,228,220,0.5)",
                                      fontFamily: "'DM Mono', monospace",
                                      letterSpacing: "0.06em",
                                    }}
                                  >
                                    {skill.name}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: color.accent,
                                      fontFamily: "'DM Mono', monospace",
                                    }}
                                  >
                                    {skill.value}%
                                  </span>
                                </div>
                                <div
                                  style={{
                                    height: "2px",
                                    background: "rgba(232,228,220,0.06)",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                  }}
                                >
                                  <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                      delay: 0.1 + idx * 0.05,
                                      duration: 0.7,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                    style={{
                                      height: "100%",
                                      width: `${skill.value}%`,
                                      background: `linear-gradient(90deg, ${color.accent}99, ${color.accent})`,
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

                    {/* Toggle indicator */}
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "1.5rem",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive
                          ? color.accent
                          : "rgba(232,228,220,0.3)",
                        fontSize: "18px",
                        lineHeight: 1,
                        transition: "color 0.3s",
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
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: "1px",
                background: "rgba(232,228,220,0.07)",
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
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            marginTop: "6rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(232,228,220,0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              color: "rgba(232,228,220,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            EST. 2021
          </span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              color: "#C9A96E",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Scroll to explore →
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
