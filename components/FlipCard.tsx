"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function FlipCard() {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 🔥 MOUSE 3D TILT
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -20;
    const rotateY = (x / rect.width - 0.5) * 20;

    card.style.transform = `
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div className="flex items-center justify-center min-h-[700px] px-4 bg-[#f3efe9]">
      <div
        className="relative w-[340px] h-[440px] perspective"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        {/* 🔥 GLOW FOLLOW CURSOR */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#e6dcd2]/40 via-transparent to-[#d6ccc2]/30 blur-2xl opacity-70" />

        {/* CARD */}
        <motion.div
          ref={cardRef}
          onClick={() => setFlipped(!flipped)}
          className="relative w-full h-full cursor-pointer rounded-[32px] transition-transform duration-200"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div className="absolute w-full h-full backface-hidden rounded-[32px] overflow-hidden border border-black/5 bg-white/40 backdrop-blur-xl shadow-xl">
            {/* IMAGE LAYER */}
            <div className="relative w-full h-[65%] overflow-hidden">
              <motion.img
                src="/andre.webp"
                alt="Andre"
                className="w-full h-full object-cover scale-110"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.6 }}
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f3efe9]" />

              {/* SOCIAL */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                {[FaGithub, FaLinkedin, FaInstagram].map((Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ scale: 1.2, y: -3 }}
                    href="#"
                    className="w-9 h-9 flex items-center justify-center rounded-full 
                    bg-white/40 backdrop-blur-md border border-black/10 
                    text-black/70"
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-6 pb-6">
              <h2 className="text-[28px] text-[#3e3e3e] font-serif tracking-tight">
                Andre
              </h2>

              <p className="text-[11px] tracking-[2px] uppercase text-black/40 mb-3">
                Frontend Developer
              </p>

              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "UI/UX"].map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.1 }}
                    className="text-[10px] px-3 py-1 rounded-full 
                    border border-black/10 bg-white/40 text-black/60"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-[32px] border border-black/5 bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center gap-5 p-6">
            <motion.img
              src="/qr.png"
              alt="QR"
              className="w-[190px] h-[190px] bg-white p-4 rounded-2xl shadow-lg"
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-black/50 text-xs tracking-wide"
            >
              Scan to connect
            </motion.p>
          </div>
        </motion.div>

        {/* INDICATOR */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <div
            className="px-5 py-1.5 text-[10px] tracking-wide text-black/60 
            bg-white/60 border border-black/10 rounded-full shadow-md backdrop-blur"
          >
            tap to flip
          </div>
        </motion.div>
      </div>
    </div>
  );
}
