"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
export const projects = [
  {
    title: "Koinonia App",
    slug: "koinonia-app",
    desc: "Modern personal portfolio built with Next.js and Tailwind.",
    image: "https://ik.imagekit.io/0bdqq0ixx/login_logo.png",
    stack: ["Flutter", "Firebase"],
    year: "2025",
    role: "Mobile Developer",
    status: "Live",
    liveUrl: "#",
    num: "01",
    accent: "#d4a853",
  },
  {
    title: "Batarmy Production",
    slug: "bat-army",
    desc: "High-converting landing page with clean UI and responsive design.",
    image: "https://ik.imagekit.io/0bdqq0ixx/Logo%20Batarmy.png",
    stack: ["React"],
    year: "2023",
    role: "UI Designer",
    status: "Draft",
    liveUrl: "#",
    num: "02",
    accent: "#8b7355",
  },
  {
    title: "Portofolio Website",
    slug: "portofolio-website",
    desc: "Modern personal portfolio built with Next.js and Tailwind.",
    image: "https://ik.imagekit.io/0bdqq0ixx/Mockup.png",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    year: "2024",
    role: "Frontend Developer",
    status: "Live",
    liveUrl: "#",
    num: "03",
    accent: "#6b8f71",
  },
];

// ─── MAGNETIC CARD ────────────────────────────────────────────────────────────
function MagneticCard({ children, className, style, onClick }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={!isMobile ? onMouseMove : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
      className={className}
      style={{
        ...style,
        transformStyle: isMobile ? "flat" : "preserve-3d",
        perspective: isMobile ? 0 : 800,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [index * 20, -(index * 20)]);

  const offsets = [0, 50, 110];

  return (
    <motion.div
      ref={cardRef}
      style={{ marginTop: offsets[index] }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <MagneticCard
        className="group relative cursor-pointer"
        style={{ display: "block" }}
        onClick={() => router.push(`/projects/${project.slug}`)}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "#fff",
            border: "1px solid #e8e8e6",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: hovered
              ? `0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px ${project.accent}33`
              : "0 4px 24px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.5s ease",
          }}
        >
          {/* ── IMAGE AREA ── */}
          <div
            style={{
              position: "relative",
              height: 220,
              overflow: "hidden",
              background: "#f9f9f7",
            }}
          >
            {/* Shimmer on hover */}
            <motion.div
              animate={{ x: hovered ? "200%" : "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                zIndex: 5,
                pointerEvents: "none",
              }}
            />

            <motion.img
              src={project.image}
              alt={project.title}
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "16px",
              }}
            />

            {/* Dark overlay + CTA */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(10,10,10,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 4,
              }}
            >
              <motion.span
                animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                style={{
                  color: "#fff",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  fontFamily: "monospace",
                  border: "1px solid rgba(255,255,255,0.4)",
                  padding: "8px 18px",
                  borderRadius: 40,
                  backdropFilter: "blur(8px)",
                }}
              >
                View Project →
              </motion.span>
            </motion.div>

            {/* Number badge */}
            <span
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                fontSize: 10,
                fontFamily: "monospace",
                color: "#c2c2c0",
                zIndex: 10,
                letterSpacing: "0.1em",
              }}
            >
              {project.num}
            </span>

            {/* Status pill */}
            <motion.span
              animate={{ opacity: hovered ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                fontSize: 9,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                background: project.status === "Live" ? "#ecfdf5" : "#fafafa",
                color: project.status === "Live" ? "#059669" : "#9a9a98",
                border: `1px solid ${project.status === "Live" ? "#a7f3d0" : "#e8e8e6"}`,
                borderRadius: 40,
                padding: "4px 10px",
                zIndex: 10,
                textTransform: "uppercase",
              }}
            >
              {project.status}
            </motion.span>
          </div>

          {/* ── CONTENT ── */}
          <div
            style={{
              padding: "20px 22px 22px",
              borderTop: "1px solid #f0f0ee",
            }}
          >
            {/* Accent line */}
            <motion.div
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 2,
                background: `linear-gradient(90deg, ${project.accent}, transparent)`,
                marginBottom: 14,
                borderRadius: 2,
              }}
            />

            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.15,
                marginBottom: 8,
                color: "#111110",
              }}
            >
              {project.title}
            </h3>

            <p
              style={{
                fontSize: 12,
                color: "#6b6b69",
                lineHeight: 1.65,
                marginBottom: 14,
              }}
            >
              {project.desc}
            </p>

            {/* Role + Year */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                fontFamily: "monospace",
                color: "#9a9a98",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              <span>{project.role}</span>
              <span>{project.year}</span>
            </div>

            {/* Stack tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {project.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + i * 0.07 + 0.3 }}
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    padding: "4px 10px",
                    border: "1px solid #e0e0de",
                    borderRadius: 40,
                    color: "#6b6b69",
                    letterSpacing: "0.06em",
                    background: hovered ? "#fafaf8" : "transparent",
                    transition: "background 0.3s",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </MagneticCard>
    </motion.div>
  );
}

// ─── FLOATING ORBS ────────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <>
      {[
        {
          size: 320,
          top: "8%",
          left: "-5%",
          delay: 0,
          color: "rgba(180,160,120,0.06)",
        },
        {
          size: 200,
          top: "60%",
          right: "-3%",
          delay: 2,
          color: "rgba(100,140,110,0.05)",
        },
        {
          size: 260,
          bottom: "5%",
          left: "30%",
          delay: 1,
          color: "rgba(140,120,180,0.04)",
        },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{
            duration: 8 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
            ...orb,
          }}
        />
      ))}
    </>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Geist+Mono:wght@300;400&display=swap');

        * { box-sizing: border-box; }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-track {
          display: flex;
          gap: 0;
          animation: ticker 18s linear infinite;
          width: max-content;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      <section
        ref={sectionRef}
        id="projects"
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: "100px 40px 140px",
          background: "#f5f5f3",
          color: "#111110",
          overflow: "hidden",
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <FloatingOrbs />

        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* ── HEADER ── */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            transition={{ duration: 0 }}
          >
            <div style={{ marginBottom: 80 }}>
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 10,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "#9a9a98",
                  fontFamily: "monospace",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 1,
                    background: "#c2c2c0",
                    display: "block",
                  }}
                />
                Selected Work
                <span
                  style={{
                    width: 32,
                    height: 1,
                    background: "#c2c2c0",
                    display: "block",
                  }}
                />
              </motion.p>

              <div style={{ overflow: "hidden" }}>
                <motion.h2
                  initial={{ y: 80 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(36px, 10vw, 104px)",
                    fontWeight: 300,
                    lineHeight: 1.05,
                    margin: 0,
                  }}
                >
                  Pro{" "}
                  <em
                    style={{
                      color: "#9a9a98",
                      fontStyle: "italic",
                      fontWeight: 300,
                    }}
                  >
                    jects
                  </em>
                </motion.h2>
              </div>

              {/* Counter */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#c2c2c0",
                  marginTop: 16,
                  letterSpacing: "0.2em",
                }}
              >
                {projects.length.toString().padStart(2, "0")} projects
              </motion.p>
            </div>
          </motion.div>

          {/* ── MARQUEE ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{
              overflow: "hidden",
              borderTop: "1px solid #e8e8e6",
              borderBottom: "1px solid #e8e8e6",
              padding: "10px 0",
              marginBottom: 64,
            }}
          >
            <div
              className="ticker-track"
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                color: "#c2c2c0",
                textTransform: "uppercase",
              }}
            >
              {[...Array(2)].flatMap((_, loopIndex) =>
                [
                  "Flutter",
                  "Firebase",
                  "React",
                  "Next.js",
                  "Tailwind",
                  "Framer Motion",
                  "UI Design",
                  "Mobile Dev",
                ].map((t, i) => (
                  <span
                    key={`${t}-${i}-${loopIndex}`} // 🔥 FIX DISINI
                    style={{ padding: "0 28px", whiteSpace: "nowrap" }}
                  >
                    {t}
                    <span style={{ color: "#e0e0de", marginLeft: 28 }}>✦</span>
                  </span>
                )),
              )}
            </div>
          </motion.div>

          {/* ── GRID ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                window.innerWidth < 768 ? "1fr" : "repeat(3, 1fr)",
              gap: 24,
              alignItems: "start",
            }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>

          {/* ── FOOTER CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ marginTop: 80, textAlign: "center" }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "#c2c2c0",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              More coming soon
            </p>
            <div
              style={{
                width: 1,
                height: 40,
                background: "linear-gradient(to bottom, #c2c2c0, transparent)",
                margin: "0 auto",
              }}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
