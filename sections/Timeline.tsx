"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const isPlus = value.includes("+");
  const number = parseInt(value);

  const count = useCountUp(number);

  return (
    <div>
      <p className="text-2xl font-extralight text-white">
        {count}
        {isPlus && "+"}
      </p>
      <p
        className="text-[10px] tracking-[0.25em] uppercase mt-1"
        style={{ color: "rgba(255,255,255,0.18)" }}
      >
        {label}
      </p>
    </div>
  );
}

const slides = [
  {
    year: "2022",
    title: "Uniqlo Grand Mall Bekasi",
    role: "Store Opening Coordinator",
    impact: "Coordinated store opening operations & team execution",
    desc: "Gained early leadership exposure in a fast-paced retail launch, developing strong operational discipline, team coordination, and execution under pressure.",
    hasImage: false,
    color: "#888888",
    index_label: "01",
  },
  // ================= 2023 =================
  {
    year: "2023",
    title: "Bogor Fest",
    role: "Event Crew",
    impact: "Handled high-traffic public event operations",
    desc: "Supported logistics and ensured smooth crowd flow in a dynamic festival environment.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/BogorFest.jpg",
    team: "20+",
    scale: "Public Event",
    color: "#7A8A6B",
    hasImage: true,
    index_label: "02",
  },
  {
    year: "2023",
    title: "Ice Skating Mall Ciputra Tangerang",
    role: "Event Crew",
    impact: "Maintained visitor experience & operational flow",
    desc: "Handled operational execution in a high-footfall entertainment environment.",
    hasImage: false,
    color: "#6B8A9A",
    index_label: "03",
  },

  // ================= 2024 =================
  {
    year: "2024",
    title: "Snow Playground Pondok Indah Mall",
    role: "Head Crew",
    impact: "Led team coordination and on-site execution",
    desc: "First major leadership role in event operations, managing team performance and solving real-time issues.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/PIM-2023.jpg",
    team: "20+",
    scale: "Large Event",
    color: "#8B7A6B",
    hasImage: true,
    index_label: "04",
  },
  {
    year: "2024",
    title: "Ice Skating Summarecon Mall Bandung",
    role: "Head Crew",
    impact: "Improved workflow efficiency and team coordination",
    desc: "Expanded leadership responsibilities with stronger operational control.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/BANDUNG-2024.jpg",
    team: "25+",
    scale: "Regional Event",
    color: "#8B7355",
    hasImage: true,
    index_label: "05",
  },
  {
    year: "2024",
    title: "Ice Skating Pondok Indah Mall",
    role: "Head Crew",
    impact: "Handled complex operations under pressure",
    desc: "Managed multiple responsibilities in a fast-paced environment.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/PIM-2024.jpg",
    team: "20+",
    scale: "Large Event",
    hasImage: true,
    color: "#7A6B5A",
    index_label: "06",
  },
  {
    year: "202X",
    title: "PT AFCO Mahakarya Hutama",
    role: "Web Developer Intern",
    impact: "Developed and delivered a functional company website",
    desc: "Built and deployed a website that is used internally by the company, focusing on UI/UX and performance.",
    hasImage: true,
    image: "https://ik.imagekit.io/0bdqq0ixx/Magang.jpg",
    color: "#6A7A8A",
    index_label: "07",
  },
  {
    year: "2024",
    title: "Job Fair Disnaker Bogor",
    role: "Event Crew",
    impact: "Supported structured government event execution",
    desc: "Worked in a formal environment requiring precise coordination.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/JobFair.jpg",
    hasImage: true,
    color: "#6F7C8A",
    index_label: "08",
  },

  // ================= 2025 =================
  {
    year: "2025",
    title: "Kuliner Braga Ngabuburit Festival",
    role: "Event Crew",
    impact: "Handled high-density cultural event operations",
    desc: "Maintained smooth execution in a crowded public setting.",
    hasImage: true,
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/BragaFest.jpg",
    color: "#8A6B6B",
    index_label: "09",
  },
  {
    year: "2025",
    title: "Ice Skating Summarecon Mall Bandung",
    role: "Head Crew",
    impact: "Led larger team with refined operational strategy",
    desc: "Second-year leadership with improved efficiency and stronger team control.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/BANDUNG-2025.jpg",
    hasImage: true,
    color: "#9A7B5F",
    index_label: "10",
  },
  {
    year: "2025",
    title: "Booth Production Project",
    role: "Booth Quality Control Specialist",
    impact:
      "Ensured production quality and design compliance before installation",
    desc: "Performed quality control inspections during booth production, ensuring alignment with design specifications, finishing standards, and overall build readiness. Coordinated with craftsmen to maintain consistent production quality prior to installation.",
    image: "https://ik.imagekit.io/0bdqq0ixx/QC.jpg",
    hasImage: true,
    color: "#888888",
    index_label: "11",
  },

  // ================= PEAK =================
  {
    year: "2025",
    title: "Ice Skating Pondok Indah Mall",
    role: "Event Manager",
    impact: "Led full event lifecycle — planning, execution, and evaluation",
    desc: "Transitioned into strategic leadership — overseeing end-to-end event management at scale.",
    image: "https://ik.imagekit.io/0bdqq0ixx/experience/PIM-2025.jpg",
    team: "50+",
    scale: "Major Event",
    color: "#C9A84C",
    hasImage: true,
    index_label: "12",
  },
  {
    year: "2023 - 2026",
    title: "Theresia Jesus Jornet",
    role: "Digital & Communication Division",
    impact: "Managed digital communication & internal coordination",
    desc: "Handled organizational communication systems, documentation, and digital presence.",
    hasImage: true,
    image: "https://ik.imagekit.io/0bdqq0ixx/Lingkungan2.jpg",
    color: "#5A6A7A",
    index_label: "13",
  },
];

/* ─── Main ──────────────────────────────────────── */

export default function Timeline({ onClose }: { onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto text-white"
        style={{ background: "#080808" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Subtle noise texture */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        {/* Gold hairline top */}
        <div
          className="pointer-events-none fixed top-0 left-0 right-0 h-px z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #C9A84C55 50%, transparent 100%)",
          }}
        />

        {/* ── Header ── */}
        <StickyHeader onClose={onClose} />

        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Timeline ── */}
        <div className="relative pb-40">
          {/* Center spine — desktop */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 8%, rgba(201,168,76,0.15) 92%, transparent)",
            }}
          />

          <div className="flex flex-col">
            {slides.map((item, i) => (
              <TimelineRow
                key={i}
                item={item}
                index={i}
                isActive={activeIndex === i}
                onToggle={() => setActiveIndex(activeIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* End cap */}
          <motion.div
            className="flex flex-col items-center gap-3 mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            />
            <p
              className="text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(201,168,76,0.3)" }}
            >
              Still growing
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Sticky Header ─────────────────────────────── */

function StickyHeader({ onClose }: { onClose: () => void }) {
  return (
    <motion.header
      className="sticky top-0 z-20 flex items-center justify-between px-8 md:px-16 py-5"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        background:
          "linear-gradient(to bottom, rgba(8,8,8,0.97) 70%, transparent)",
        borderBottom: "0.5px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(201,168,76,0.55)" }}
        >
          Experience
        </span>
        <div
          className="w-10 h-px"
          style={{ background: "rgba(201,168,76,0.2)" }}
        />
      </div>

      <button
        onClick={onClose}
        className="group flex items-center gap-2 transition-colors duration-300"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase group-hover:text-white/60 transition-colors">
          Close
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 group-hover:border-white/25"
          style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M1 1L8 8M8 1L1 8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>
    </motion.header>
  );
}

function useCountUp(target: number, duration = 1.5) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [target, duration]);

  return count;
} /* ─── Hero ──────────────────────────────────────── */

function HeroSection() {
  return (
    <div className="px-8 md:px-16 pt-10 pb-24">
      <motion.p
        className="text-[10px] tracking-[0.5em] uppercase mb-5"
        style={{ color: "rgba(255,255,255,0.18)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        2022 — 2025
      </motion.p>

      <div className="overflow-hidden">
        <motion.h1
          className="text-5xl md:text-8xl font-extralight leading-[0.95] tracking-tight"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          Leadership
          <br />
          <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Journey</em>
        </motion.h1>
      </div>

      <motion.p
        className="mt-8 text-sm leading-relaxed max-w-xs"
        style={{ color: "rgba(255,255,255,0.26)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.8 }}
      >
        Six milestones — from retail crew to event manager. Each step building
        the next.
      </motion.p>

      {/* Quick stats */}
      <motion.div
        className="flex gap-10 mt-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {[
          ["6", "Events"],
          ["3+", "Years"],
          ["100+", "Team Peak"],
        ].map(([val, label]) => (
          <AnimatedStat key={label} value={val} label={label} />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Timeline Row ──────────────────────────────── */

function TimelineRow({
  item,
  index,
  isActive,
  onToggle,
}: {
  item: (typeof slides)[0];
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative px-8 md:px-0 mb-20 md:mb-28"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-5">
        <CardBlock item={item} isActive={isActive} onToggle={onToggle} />
        {item.hasImage && item.image ? (
          <ImageBlock item={item} />
        ) : (
          <NoImageBlock item={item} />
        )}
      </div>

      {/* Desktop — 3-col */}
      <div
        className="hidden md:grid md:px-16"
        style={{ gridTemplateColumns: "1fr 100px 1fr" }}
      >
        {isEven ? (
          <>
            <div className="pr-12 flex justify-end items-center">
              <div className="w-full max-w-md">
                <CardBlock
                  item={item}
                  isActive={isActive}
                  onToggle={onToggle}
                  align="right"
                />
              </div>
            </div>
            <SpineDot item={item} />
            <div className="pl-12 flex items-center">
              <div className="w-full max-w-md">
                {item.hasImage && item.image ? (
                  <ImageBlock item={item} />
                ) : (
                  <NoImageBlock item={item} />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pr-12 flex items-center justify-end">
              <div className="w-full max-w-md">
                {item.hasImage && item.image ? (
                  <ImageBlock item={item} />
                ) : (
                  <NoImageBlock item={item} />
                )}
              </div>
            </div>
            <SpineDot item={item} />
            <div className="pl-12 flex items-center">
              <div className="w-full max-w-md">
                <CardBlock
                  item={item}
                  isActive={isActive}
                  onToggle={onToggle}
                  align="left"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Spine Dot ─────────────────────────────────── */

function SpineDot({ item }: { item: (typeof slides)[0] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 z-10">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Pulse */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 28, height: 28, background: item.color + "22" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Core */}
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: item.color }}
        />
      </motion.div>

      <motion.p
        className="text-[9px] tracking-[0.25em] font-light"
        style={{ color: item.color + "99" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {item.year}
      </motion.p>
    </div>
  );
}

/* ─── Card Block ────────────────────────────────── */

function CardBlock({
  item,
  isActive,
  onToggle,
  align = "left",
}: {
  item: (typeof slides)[0];
  isActive: boolean;
  onToggle: () => void;
  align?: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <motion.div
      onClick={onToggle}
      className="cursor-pointer"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Mobile year tag */}
      <div className="flex items-center gap-2 mb-3 md:hidden">
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: item.color }}
        >
          {item.year}
        </span>
        <div className="h-px w-6" style={{ background: item.color + "45" }} />
      </div>

      {/* Card */}
      <motion.div
        className="rounded-2xl p-6"
        animate={{
          background: isActive ? item.color + "09" : "rgba(255,255,255,0.018)",
          borderColor: isActive ? item.color + "35" : "rgba(255,255,255,0.055)",
        }}
        style={{
          border: "0.5px solid rgba(255,255,255,0.055)",
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Index */}
        <div
          className={`flex items-center gap-2 mb-4 ${isRight ? "justify-end" : ""}`}
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{ color: item.color + "70" }}
          >
            {item.index_label}
          </span>
          <div className="h-px w-5" style={{ background: item.color + "30" }} />
        </div>

        {/* Title & role */}
        <h3
          className={`text-xl font-light text-white leading-tight ${isRight ? "text-right" : ""}`}
        >
          {item.title}
        </h3>
        <p
          className={`text-[11px] tracking-[0.2em] uppercase mt-1.5 font-medium ${isRight ? "text-right" : ""}`}
          style={{ color: item.color }}
        >
          {item.role}
        </p>

        <p
          className={`mt-4 text-sm leading-relaxed ${isRight ? "text-right" : ""}`}
          style={{ color: "rgba(255,255,255,0.36)" }}
        >
          {item.desc}
        </p>

        {/* Expandable */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                className="mt-5 pt-5"
                style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
              >
                {/* Stats */}
                {(item.team || item.scale) && (
                  <div
                    className={`flex gap-8 mb-4 ${isRight ? "justify-end" : ""}`}
                  >
                    {item.team && <Stat label="Team" value={item.team} />}
                    {item.scale && <Stat label="Scale" value={item.scale} />}
                  </div>
                )}

                {/* Impact */}
                <div
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: item.color + "0C",
                    border: `0.5px solid ${item.color}20`,
                  }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: item.color + "BB" }}
                  >
                    "{item.impact}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle cue */}
        <div
          className={`mt-4 flex items-center gap-1.5 ${isRight ? "justify-end" : ""}`}
          style={{ color: "rgba(255,255,255,0.14)" }}
        >
          <span className="text-[9px] tracking-widest uppercase">
            {isActive ? "Collapse" : "Details"}
          </span>
          <motion.svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              d="M1 3L4 6L7 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Image Block ───────────────────────────────── */

function ImageBlock({ item }: { item: (typeof slides)[0] }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{ aspectRatio: "4/3" }}
      initial={{ scale: 1.07, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.015 }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.82) saturate(0.85)" }}
      />
      {/* Color tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(155deg, ${item.color}18 0%, transparent 55%, rgba(8,8,8,0.3) 100%)`,
        }}
      />
      {/* Scale badge */}
      {item.scale && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,8,0.72), transparent)",
          }}
        >
          <p
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: item.color + "CC" }}
          >
            {item.scale}
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ─── No Image Block ────────────────────────────── */

function NoImageBlock({ item }: { item: (typeof slides)[0] }) {
  return (
    <motion.div
      className="rounded-2xl p-8 flex flex-col justify-center"
      style={{
        aspectRatio: "4/3",
        background: "rgba(255,255,255,0.012)",
        border: "0.5px solid rgba(255,255,255,0.045)",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
    >
      <p
        className="text-7xl font-extralight leading-none select-none"
        style={{ color: item.color + "16" }}
      >
        {item.year}
      </p>
      <div
        className="my-4 w-8 h-px"
        style={{ background: item.color + "35" }}
      />
      <p
        className="text-sm leading-relaxed"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        {item.desc}
      </p>
    </motion.div>
  );
}

/* ─── Stat ──────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[9px] tracking-[0.25em] uppercase mb-1"
        style={{ color: "rgba(255,255,255,0.18)" }}
      >
        {label}
      </p>
      <p className="text-lg font-extralight text-white">{value}</p>
    </div>
  );
}
