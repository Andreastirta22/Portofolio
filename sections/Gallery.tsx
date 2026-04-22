"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    image: "https://ik.imagekit.io/0bdqq0ixx/Keluarga4.jpg",
    caption:
      "Thank you for always being there, even when I didn’t realize I needed it.",
  },
  {
    image: "https://ik.imagekit.io/0bdqq0ixx/keluarga/Keluarga1.jpg",
    caption: "Every step I take is built on your sacrifices.",
  },
  {
    image: "https://ik.imagekit.io/0bdqq0ixx/Keluarga5.jpg",
    caption: "I may not say it often, but I carry your love everywhere I go.",
  },
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-base-main via-base-soft to-base-deep">
      {/* 🔥 TOP TRANSITION (BIAR GA JATUH) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-base-main to-transparent z-10" />

      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(126,184,201,0.08),transparent_60%)]" />
      <div className="absolute top-[35%] w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] bg-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 w-full h-[150px] sm:h-[200px] bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* HEADER */}
      <div className="text-center z-20 max-w-xl sm:max-w-2xl">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light leading-tight">
          <span className="text-text-primary">Support All Life</span>{" "}
          <span className="text-accent/80">by Family</span>
        </h2>

        <p className="text-text-muted mt-4 text-xs sm:text-sm md:text-base leading-relaxed">
          Everything I am today is built on your patience, your strength, and
          your love.
        </p>

        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
          <div className="w-10 sm:w-12 h-[1px] bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-accent/40" />
          <div className="w-10 sm:w-12 h-[1px] bg-white/20" />
        </div>
      </div>

      {/* GRID */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 z-20 w-full max-w-6xl">
        {items.map((item, i) => (
          <motion.div
            key={i}
            layoutId={`card-${i}`}
            onClick={() => setActive(i)}
            className="cursor-pointer group relative"
            whileHover={{ scale: 1.03 }}
          >
            {/* IMAGE */}
            <img
              src={item.image}
              className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover rounded-2xl grayscale brightness-90 contrast-105 group-hover:grayscale-0 transition duration-500 shadow-lg group-hover:shadow-2xl"
            />

            {/* DARK OVERLAY (BIAR CINEMATIC) */}
            <div className="absolute inset-0 bg-black/30 rounded-2xl pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* BOTTOM MESSAGE */}
      <motion.div
        className="mt-16 sm:mt-24 max-w-2xl text-center z-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-light">
          In this family, warmth is not just felt — it is lived.
          <br />
          Every dream is held, every step is guided.
          <br />
          And in every prayer, we find the strength to keep going.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="w-10 h-[1px] bg-white/20" />
          <span className="text-text-muted text-xs tracking-[0.3em]">
            WITH LOVE
          </span>
          <div className="w-10 h-[1px] bg-white/20" />
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`card-${active}`}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[active].image}
                className="w-full max-h-[70vh] object-contain rounded-2xl"
              />

              <motion.p
                className="text-text-secondary text-center mt-4 sm:mt-6 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed px-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {items[active].caption}
              </motion.p>

              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-4 text-white/40 hover:text-white text-xl sm:text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
