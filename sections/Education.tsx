"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ── Site palette extracted from screenshot ────────────────────────────────────
// bg-deep:    #120608  — deepest background (wine-black)
// bg-dark:    #1C0C10  — section bg
// bg-mid:     #2A1218  — card/border bg
// text-bright:#EDE4D8  — primary text (warm cream)
// text-mid:   #C4A898  — secondary text
// text-muted: #7A5560  — muted / labels
// text-dim:   #4A2F38  — very dim / decorative
// accent:     #C4907A  — dusty rose accent (warm)
// accent-hi:  #DEB89E  — lighter accent on hover

const PALETTE = {
  bgDeep: "#0a0a0a  ",
  bgDark: "#111111",
  bgMid: "#1a1a1a",
  textBright: "#f5f5f5",
  textMid: "#a1a1a1",
  textMuted: "#6b7280",
  textDim: "#3f3f46",
  accent: "#7EB8C9",
  accentHi: "#A8D6E2",
};

const education = [
  {
    school: "Universitas Bina Sarana Informatika",
    major: "Bachelor of Information Systems",
    year: ["2021", "2025"],
    highlight: true,
    tag: "S1",
    description:
      "Focused on system design, software engineering, and information architecture across 4 years of intensive study.",
    before: "https://ik.imagekit.io/0bdqq0ixx/education/Kuliah1.jpg",
    after: "https://ik.imagekit.io/0bdqq0ixx/Kuliah2.jpg",
  },
  {
    school: "SMAN 7 Kota Bekasi",
    year: ["2018", "2021"],
    tag: "SMA",
    description:
      "Science major. Three years of foundation in analytical thinking and problem-solving.",
    before: "https://ik.imagekit.io/0bdqq0ixx/education/SMA1.jpg",
    after: "https://ik.imagekit.io/0bdqq0ixx/education/SMA2.jpg",
  },
  {
    school: "SMPK Strada Kampung Sawah",
    year: ["2015", "2018"],
    tag: "SMP",
    description:
      "Junior years shaped by curiosity and the early seeds of creative thinking.",
    before: "https://ik.imagekit.io/0bdqq0ixx/education/SMP1.jpg",
    after: "https://ik.imagekit.io/0bdqq0ixx/education/SMP2.jpg",
  },
  {
    school: "SDK Strada Kampung Sawah",
    year: ["2009", "2015"],
    tag: "SD",
    description:
      "Where it all began. Six formative years of childhood wonder and first lessons.",
    before: null,
    after: null,
  },
];

type EducationItem = (typeof education)[0];

// ─── Per-item component ───────────────────────────────────────────────────────
interface EducationItemProps {
  item: EducationItem;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  expanded: boolean;
  hoveredIndex: number | null;
  onExpand: () => void;
  onOpen: (item: EducationItem) => void;
  onHoverEnter: (index: number) => void;
  onHoverLeave: () => void;
}

function EducationItemRow({
  item,
  index,
  scrollYProgress,
  expanded,
  hoveredIndex,
  onExpand,
  onOpen,
  onHoverEnter,
  onHoverLeave,
}: EducationItemProps) {
  const start = 0.05 + 0.14 * index;
  const end = start + 0.3;

  const rawY = useTransform(
    scrollYProgress,
    [start, start + 0.12, end - 0.05, end],
    [90, 0, 0, -12],
  );
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.06, end],
    [0, 1, 1, 0.3],
  );

  const scale = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.06, end],
    [0.93, 1, 1, 0.97],
  );

  const blur = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.06, end],
    [10, 0, 0, 3],
  );
  const blurFilter = useMotionTemplate`blur(${blur}px)`;

  const rawX = useTransform(
    scrollYProgress,
    [start, start + 0.1],
    [index % 2 === 0 ? -32 : 32, 0],
  );
  const x = useSpring(rawX, { stiffness: 80, damping: 24 });

  const isUniversity = index === 0;
  const isHovered = hoveredIndex === index;
  const duration = parseInt(item.year[1]) - parseInt(item.year[0]);

  return (
    <motion.div
      style={{ y, opacity, scale, filter: blurFilter, x }}
      className="relative group"
      onMouseEnter={() => onHoverEnter(index)}
      onMouseLeave={onHoverLeave}
    >
      {/* Connecting line */}
      {index < education.length - 1 && (
        <div
          className="absolute w-px h-10 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${PALETTE.textDim}, transparent)`,
            left: "-1.5rem",
            top: "calc(100% - 1px)",
          }}
        />
      )}

      <motion.div
        onClick={() => {
          if (isUniversity && !expanded) onExpand();
          else onOpen(item);
        }}
        whileHover={{ x: 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="cursor-pointer py-8 border-b relative"
        style={{
          borderColor: isHovered ? `${PALETTE.accent}33` : `${PALETTE.bgMid}CC`,
        }}
      >
        {/* Hover accent bar */}
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] rounded-full"
          animate={{ opacity: isHovered ? 1 : 0, scaleY: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.25 }}
          style={{
            background: `linear-gradient(to bottom, transparent, ${PALETTE.accent} 40%, ${PALETTE.accent} 60%, transparent)`,
            left: "-1.5rem",
            transformOrigin: "center",
          }}
        />

        {/* Editorial index */}
        <motion.span
          className="absolute right-0 top-8 text-[9px] tracking-[0.3em] select-none"
          animate={{ opacity: isHovered ? 0.5 : 0.15 }}
          style={{
            color: PALETTE.textMuted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Year + Tag row */}
            <div className="flex items-center gap-3 mb-3">
              <p
                className="text-[9px] tracking-[0.25em]"
                style={{ color: PALETTE.textMuted }}
              >
                {item.year[0]} — {item.year[1]}
              </p>
              <motion.span
                className="text-[8px] px-2 py-0.5 rounded-sm tracking-widest"
                animate={{
                  background: isHovered
                    ? `${PALETTE.accent}30`
                    : `${PALETTE.bgMid}99`,
                }}
                style={{
                  color: PALETTE.textMid,
                  border: `1px solid ${PALETTE.accent}44`,
                }}
              >
                {item.tag}
              </motion.span>
              <span className="text-[9px]" style={{ color: PALETTE.textDim }}>
                {duration}y
              </span>
            </div>

            {/* School name */}
            <h2
              className="text-[22px] font-light leading-snug transition-colors duration-300"
              style={{
                color: item.highlight
                  ? isHovered
                    ? PALETTE.accentHi
                    : PALETTE.textBright
                  : isHovered
                    ? PALETTE.textMid
                    : PALETTE.textMuted,
              }}
            >
              {item.school}
            </h2>

            {/* University expandable */}
            {isUniversity && (
              <motion.div
                animate={{
                  height: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p
                  className="text-[10px] mt-3 uppercase tracking-[0.25em]"
                  style={{ color: PALETTE.accentHi }}
                >
                  {item.major}
                </p>
                <p
                  className="text-[12px] mt-2 leading-relaxed max-w-sm"
                  style={{ color: PALETTE.textMuted }}
                >
                  {item.description}
                </p>
                <motion.p
                  className="text-[9px] mt-4 uppercase tracking-[0.2em] flex items-center gap-1.5"
                  style={{ color: PALETTE.accent }}
                  whileHover={{ x: 3 }}
                >
                  <span>↗</span>
                  <span>view memory</span>
                </motion.p>
              </motion.div>
            )}

            {/* Non-uni hover description */}
            {!isUniversity && (
              <motion.p
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] mt-2 leading-relaxed max-w-sm"
                style={{ color: PALETTE.textMuted }}
              >
                {item.description}
              </motion.p>
            )}
          </div>

          {/* Action indicator */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.65,
              rotate: isHovered ? 0 : -20,
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 mt-1"
          >
            {item.before ? (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px]"
                style={{
                  border: `1px solid ${PALETTE.accent}55`,
                  color: PALETTE.accent,
                  background: `${PALETTE.accent}15`,
                }}
              >
                ↗
              </div>
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${PALETTE.bgMid}` }}
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: PALETTE.textDim }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgressLine({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 h-28 w-px"
      style={{ background: `${PALETTE.accent}20` }}
    >
      <motion.div
        className="w-full origin-top h-full"
        style={{
          scaleY,
          background: `linear-gradient(to bottom, transparent, ${PALETTE.accent} 60%, ${PALETTE.accentHi})`,
        }}
      />
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<EducationItem | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState({
    before: false,
    after: false,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Page-level transforms
  const rawSectionScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.85, 1],
    [0.97, 1, 1, 0.96],
  );
  const sectionScale = useSpring(rawSectionScale, {
    stiffness: 55,
    damping: 18,
  });
  const rawSectionY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const sectionY = useSpring(rawSectionY, { stiffness: 55, damping: 22 });

  // Background blobs breathe
  const blob1Opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.08, 0.22, 0.06],
  );
  const blob2Opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.15, 0.06, 0.24],
  );
  const blob1X = useTransform(scrollYProgress, [0, 1], ["8%", "18%"]);
  const blob2X = useTransform(scrollYProgress, [0, 1], ["88%", "72%"]);

  // Header parallax
  const rawHeaderY = useTransform(scrollYProgress, [0, 0.45], [0, -70]);
  const headerY = useSpring(rawHeaderY, { stiffness: 45, damping: 16 });
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.42],
    [1, 1, 0],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
        setIsRevealed(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeItem]);

  return (
    <>
      <ScrollProgressLine scrollYProgress={scrollYProgress} />

      <motion.section
        ref={sectionRef}
        className="relative text-white py-40 px-6 overflow-hidden"
        style={{
          scale: sectionScale,
          y: sectionY,
          background: `
linear-gradient(
  170deg,
  #0a0a0a 0%,
  #080808 55%,
  #050505 100%
)
`,
          transformOrigin: "center top",
        }}
      >
        {/* Blob 1 — warm wine */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: blob1Opacity }}
        >
          <motion.div
            className="absolute top-[18%] w-[55%] h-[55%] rounded-full"
            style={{
              left: blob1X,
              background: `radial-gradient(ellipse, ${PALETTE.accent}33 0%, transparent 70%)`,
              filter: "blur(70px)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>

        {/* Blob 2 — deep maroon */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: blob2Opacity }}
        >
          <motion.div
            className="absolute top-[72%] w-[48%] h-[52%] rounded-full"
            style={{
              left: blob2X,
              background: `radial-gradient(ellipse, rgba(126,184,201,0.15) 0%, transparent 65%)`,
              filter: "blur(60px)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>

        {/* Ambient vertical line */}
        <div
          className="absolute top-0 h-full w-px opacity-[0.12] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${PALETTE.accent} 25%, ${PALETTE.accent} 75%, transparent)`,
            left: "max(2rem, calc(50% - 20rem))",
          }}
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "120px",
          }}
        />

        <div className="max-w-2xl mx-auto relative">
          {/* Header — parallax fade */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            className="mb-24"
          >
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-[9px] tracking-[0.45em] mb-4 uppercase"
              style={{ color: PALETTE.textMuted }}
            >
              Academic Journey
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-end gap-5"
            >
              <h1
                className="text-[48px] font-light leading-none tracking-tight"
                style={{ color: PALETTE.textBright }}
              >
                Edu
                <span
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `1px ${PALETTE.accent}88`,
                  }}
                >
                  cation
                </span>
              </h1>
              <span
                className="text-[11px] tracking-widest mb-2"
                style={{ color: PALETTE.textDim }}
              >
                2009 — 2025
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 h-px w-16 origin-left"
              style={{
                background: `linear-gradient(to right, ${PALETTE.accent}, transparent)`,
              }}
            />
          </motion.div>

          {/* Items */}
          <div className="relative">
            {education.map((item, index) => (
              <EducationItemRow
                key={index}
                item={item}
                index={index}
                scrollYProgress={scrollYProgress}
                expanded={expanded}
                hoveredIndex={hoveredIndex}
                onExpand={() => setExpanded(true)}
                onOpen={(item) => {
                  setActiveItem(item);
                  setIsRevealed(false);
                  setImageLoaded({ before: false, after: false });
                }}
                onHoverEnter={setHoveredIndex}
                onHoverLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex items-center gap-4"
          >
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${PALETTE.bgMid})`,
              }}
            />
            <p
              className="text-[8px] tracking-[0.4em] uppercase"
              style={{ color: PALETTE.textDim }}
            >
              End of record
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ——— MODAL ——— */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: `${PALETTE.bgDeep}EE` }}
            onClick={() => {
              setActiveItem(null);
              setIsRevealed(false);
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            />

            <motion.div
              key="modal-content"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between mb-6 px-1">
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[8px] tracking-[0.4em] uppercase mb-2"
                    style={{ color: PALETTE.textMuted }}
                  >
                    Memory / {activeItem.tag}
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-[20px] font-light"
                    style={{ color: PALETTE.textBright }}
                  >
                    {activeItem.school}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[11px] mt-1"
                    style={{ color: PALETTE.textMuted }}
                  >
                    {activeItem.year[0]} — {activeItem.year[1]}
                  </motion.p>
                </div>

                <motion.button
                  onClick={() => {
                    setActiveItem(null);
                    setIsRevealed(false);
                  }}
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    border: `1px solid ${PALETTE.accent}44`,
                    color: PALETTE.textMuted,
                  }}
                >
                  ×
                </motion.button>
              </div>

              {/* Images or empty */}
              {activeItem.before && activeItem.after ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {(["before", "after"] as const).map((key, i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.15 + i * 0.1,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative w-full overflow-hidden"
                        style={{
                          aspectRatio: "3/4",
                          borderRadius: "4px",
                          background: PALETTE.bgMid,
                          border: `1px solid ${PALETTE.accent}22`,
                        }}
                      >
                        <img
                          src={activeItem[key]!}
                          className="w-full h-full object-contain transition-all duration-700 cursor-pointer"
                          style={{
                            filter: isRevealed
                              ? "grayscale(0%) brightness(1)"
                              : "grayscale(100%) brightness(0.65) contrast(1.1) sepia(20%)",
                          }}
                          onClick={() => setIsRevealed(true)}
                          onLoad={() =>
                            setImageLoaded((p) => ({ ...p, [key]: true }))
                          }
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 py-2 px-3"
                          style={{
                            background: `linear-gradient(to top, ${PALETTE.bgDeep}DD, transparent)`,
                          }}
                        >
                          <p
                            className="text-[8px] tracking-[0.3em] uppercase"
                            style={{ color: PALETTE.textMuted }}
                          >
                            {key === "before" ? "then" : "now"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {!isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 flex items-center justify-center gap-2"
                      >
                        <div
                          className="h-px flex-1"
                          style={{ background: PALETTE.bgMid }}
                        />
                        <button
                          onClick={() => setIsRevealed(true)}
                          className="text-[9px] uppercase tracking-[0.3em] px-3 transition-colors duration-300"
                          style={{ color: PALETTE.textMuted }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = PALETTE.accentHi)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = PALETTE.textMuted)
                          }
                        >
                          tap to reveal color
                        </button>
                        <div
                          className="h-px flex-1"
                          style={{ background: PALETTE.bgMid }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center justify-center gap-4 py-20"
                  style={{
                    border: `1px solid ${PALETTE.bgMid}`,
                    borderRadius: "4px",
                    background: `${PALETTE.bgDeep}99`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ border: `1px solid ${PALETTE.bgMid}` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: PALETTE.textDim }}
                    />
                  </div>
                  <p
                    className="text-[9px] uppercase tracking-[0.35em]"
                    style={{ color: PALETTE.textDim }}
                  >
                    No visual memory
                  </p>
                  <p
                    className="text-[11px] max-w-xs text-center leading-relaxed"
                    style={{ color: `${PALETTE.textDim}99` }}
                  >
                    {activeItem.description}
                  </p>
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-center text-[8px] tracking-[0.3em] mt-5 uppercase"
                style={{ color: PALETTE.textDim }}
              >
                press esc to close
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
