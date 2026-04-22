"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

const navItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
];

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [active, setActive] = useState("about");
  const [easter, setEaster] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const easterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── scroll listener ── */
  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 120);
      navItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) setActive(item.id);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── confetti burst ── */
  const triggerConfetti = () => {
    const colors = ["#a855f7", "#ec4899", "#3b82f6", "#f59e0b", "#10b981"];
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.15 }, colors });
    setTimeout(
      () =>
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.12 },
          colors,
        }),
      200,
    );
  };

  /* ── logo click ── */
  const handleLogoClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 700);

    if (easterTimeout.current) clearTimeout(easterTimeout.current);
    setEaster(true);
    triggerConfetti();
    document.body.style.cursor = "crosshair";

    easterTimeout.current = setTimeout(() => {
      setEaster(false);
      document.body.style.cursor = "default";
    }, 5000);
  };

  /* ── smooth scroll ── */
  const smoothScrollTo = (targetY: number, duration = 900) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const step = (time: number) => {
      if (!startTime) startTime = time;
      const p = Math.min((time - startTime) / duration, 1);
      window.scrollTo(0, startY + diff * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 100, 900);
  };

  /* ── derived classes ── */
  const pillBase =
    "relative w-full max-w-4xl flex items-center justify-between px-6 py-3 rounded-full transition-all duration-700 ease-out";
  const pillNormal =
    "bg-white/25 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl";
  const pillEaster =
    "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 border-transparent shadow-[0_0_60px_rgba(168,85,247,0.8),0_0_120px_rgba(236,72,153,0.4)] scale-105";

  return (
    <>
      {/* ── Inject keyframe animations via style tag ── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 60px rgba(168,85,247,0.8), 0 0 120px rgba(236,72,153,0.4); }
          50%       { box-shadow: 0 0 90px rgba(168,85,247,1),   0 0 180px rgba(236,72,153,0.6); }
        }
        @keyframes badgePop {
          0%   { transform: translateX(-50%) scale(0) rotate(-8deg); opacity: 0; }
          60%  { transform: translateX(-50%) scale(1.15) rotate(2deg); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes rippleOut {
          from { transform: scale(0); opacity: 0.6; }
          to   { transform: scale(4); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-3px); }
        }
        .nav-pill-easter {
          animation: glowPulse 1.8s ease-in-out infinite;
        }
        .badge-pop {
          animation: badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     floatBadge 2s ease-in-out 0.5s infinite;
        }
      `}</style>

      <div
        className={`
          fixed top-6 left-0 w-full z-50 flex justify-center px-4
          transition-all duration-500 ease-out
          ${
            showNav
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8 pointer-events-none"
          }
        `}
        style={
          showNav
            ? { animation: "slideDown 0.45s cubic-bezier(0.22,1,0.36,1) both" }
            : undefined
        }
      >
        <div
          ref={navRef}
          className={`${pillBase} ${easter ? pillEaster + " nav-pill-easter" : pillNormal}`}
        >
          {/* ── LOGO ── */}
          <div className="relative">
            <img
              src="/logo.png"
              onClick={handleLogoClick}
              className={`
                h-9 cursor-pointer select-none
                transition-all duration-300
                ${
                  easter
                    ? "brightness-0 invert scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                    : "hover:scale-110 hover:brightness-110"
                }
              `}
              draggable={false}
            />
            {/* Ripple on click */}
            {ripple && (
              <span
                style={{
                  position: "absolute",
                  left: ripple.x,
                  top: ripple.y,
                  width: 40,
                  height: 40,
                  marginLeft: -20,
                  marginTop: -20,
                  borderRadius: "50%",
                  background: easter
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(139,92,246,0.4)",
                  pointerEvents: "none",
                  animation: "rippleOut 0.7s ease-out forwards",
                }}
              />
            )}
          </div>

          {/* ── NAV ITEMS ── */}
          <nav className="flex gap-2">
            {navItems.map((item) => {
              const isActive = active === item.id;
              const isHovered = hovered === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    color: easter
                      ? "white"
                      : isActive
                        ? "rgba(0,0,0,0.9)"
                        : "rgba(0,0,0,0.45)",
                  }}
                >
                  {/* Pill background */}
                  <span
                    className="absolute inset-0 rounded-full transition-all duration-300"
                    style={{
                      background: easter
                        ? "rgba(255,255,255,0.2)"
                        : isActive
                          ? "rgba(0,0,0,0.08)"
                          : isHovered
                            ? "rgba(0,0,0,0.04)"
                            : "transparent",
                      transform:
                        isHovered || isActive ? "scale(1)" : "scale(0.85)",
                      opacity: isActive || isHovered ? 1 : 0,
                    }}
                  />

                  {/* Label */}
                  <span className="relative z-10 transition-all duration-200">
                    {item.label}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: easter ? "white" : "rgba(0,0,0,0.5)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── SHIMMER overlay when easter ── */}
          {easter && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
          )}
        </div>

        {/* ── EASTER BADGE ── */}
        {easter && (
          <div
            className="badge-pop absolute -bottom-14 left-1/2 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#db2777,#2563eb)",
              whiteSpace: "nowrap",
            }}
          >
            <span>🎉</span>
            <span>SECRET MODE UNLOCKED</span>
            <span>😈</span>
          </div>
        )}
      </div>
    </>
  );
}
