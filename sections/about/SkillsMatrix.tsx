"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  name: string;
  value: number;
}

interface SkillGroup {
  id: number;
  title: string;
  skills: Skill[];
}

interface PaletteItem {
  accent: string;
  dim: string;
  bar: string;
}

interface SkillsMatrixProps {
  skillGroups: SkillGroup[];
  activeCard: number | null;
  setActiveCard: React.Dispatch<React.SetStateAction<number | null>>;
  hoveredCard: number | null;
  setHoveredCard: React.Dispatch<React.SetStateAction<number | null>>;
  mounted: boolean;
  getAverage: (skills: Skill[]) => number;
  PALETTE: PaletteItem[];
  Counter: React.ComponentType<{
    value: number;
    color: string;
  }>;
}
export default function SkillsMatrix({
  skillGroups,
  activeCard,
  setActiveCard,
  hoveredCard,
  setHoveredCard,
  mounted,
  getAverage,
  PALETTE,
  Counter,
}: SkillsMatrixProps) {
  return (
    <>
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
            style={{
              position: "relative",
              cursor: "pointer",
            }}
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

            {/* Left accent bar */}
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
                      color: isActive ? color.accent : "rgba(232,228,220,0.75)",
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
                      color={isActive ? color.accent : "rgba(232,228,220,0.3)"}
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
                      {group.skills.map((skill: Skill, idx: number) => (
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

              {/* Toggle */}
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
                  color: isActive ? color.accent : "rgba(232,228,220,0.2)",
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
    </>
  );
}
