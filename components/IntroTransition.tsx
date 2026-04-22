"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { useRef } from "react";
import Word from "./Word";

const text =
  "Hi, I'm Andre, a developer with experience in system development and various projects, focused on building efficient solutions while crafting meaningful digital experiences.";

export default function IntroTransition() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.6,
  });

  const words = text.split(" ");

  // ── FADE IN
  const opacity = useTransform(smoothProgress, [0, 0.08], [0, 1]);

  // ── EXIT TEXT
  const exitOpacity = useTransform(smoothProgress, [0.65, 0.9], [1, 0]);
  const exitScale = useTransform(smoothProgress, [0.65, 0.9], [1, 0.95]);
  const exitBlur = useTransform(smoothProgress, [0.65, 0.9], [0, 6]);
  const blurFilter = useMotionTemplate`blur(${exitBlur}px)`;

  // ── WRAP EXIT (MAIN EFFECT 🔥)
  const wrapY = useTransform(smoothProgress, [0.75, 1], ["0%", "-40%"]);
  const wrapScale = useTransform(smoothProgress, [0.75, 1], [1, 0.92]);
  const wrapOpacity = useTransform(smoothProgress, [0.8, 1], [1, 0]);

  // ── BACKGROUND
  const bgLightness = useTransform(
    smoothProgress,
    [0, 0.5, 0.85, 1],
    [4, 8, 12, 100],
  );
  const bgColor = useMotionTemplate`
  hsl(40 20% ${useTransform(smoothProgress, [0, 0.5, 1], [92, 88, 85])}%)
`;

  // ── PROGRESS BAR
  const lineScaleX = useTransform(smoothProgress, [0, 0.65], [0, 1]);

  // ── GLOW
  const glowOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.55, 0.7],
    [0, 0.35, 0.35, 0],
  );
  const glowScale = useTransform(smoothProgress, [0, 0.4], [0.6, 1.2]);

  // ── DISABLE INTERACTION
  const pointerEvents = useTransform(
    smoothProgress,
    [0.75, 1],
    ["auto", "none"],
  );

  return (
    <section ref={ref} className="relative h-[200vh]">
      {/* STICKY LAYER */}
      <motion.div
        style={{
          backgroundColor: bgColor,
          pointerEvents,
          y: wrapY,
          scale: wrapScale,
          opacity: wrapOpacity,
        }}
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden z-0"
      >
        {/* GLOW */}
        <motion.div
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 40%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          style={{
            opacity: exitOpacity,
            scale: exitScale,
            filter: blurFilter,
          }}
          className="relative z-10 px-6 max-w-3xl text-center"
        >
          <motion.div style={{ opacity }} className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.22em] text-black/40">
              Portfolio
            </span>
          </motion.div>

          <motion.p
            style={{ opacity }}
            className="text-[1.35rem] md:text-[1.75rem] leading-[1.7] font-light text-white/30"
          >
            {words.map((word, i) => (
              <Word
                key={i}
                word={word}
                index={i}
                total={words.length}
                progress={smoothProgress}
              />
            ))}
          </motion.p>
        </motion.div>

        {/* PROGRESS BAR */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-px bg-white/5">
          <motion.div
            style={{ scaleX: lineScaleX, originX: 0 }}
            className="absolute bottom-0 left-0 right-0 h-px bg-black/10"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
