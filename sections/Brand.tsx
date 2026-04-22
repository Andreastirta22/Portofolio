"use client";

import PixelGuitar from "@/components/PixelGuitar";
import { motion } from "framer-motion";

export default function BrandSection() {
  return (
    <section className="relative min-h-screen bg-[#0b0b0f] flex items-center overflow-hidden px-6 md:px-20">
      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#e6d3b3]/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center w-full relative z-10">
        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          {/* small label */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs tracking-[0.3em] text-gray-500 uppercase"
          >
            Creative Developer
          </motion.span>

          {/* headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 text-4xl md:text-6xl font-bold leading-[1.1]"
          >
            I Build <br />
            <span className="text-[#e6d3b3] relative">
              Creative Experience
              {/* underline glow */}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#e6d3b3]/40 blur-sm" />
            </span>
          </motion.h2>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-gray-400 max-w-md leading-relaxed"
          >
            Combining code, design, and music passion into immersive digital
            experiences that feel alive and unforgettable.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex gap-4"
          >
            <button className="px-6 py-3 bg-[#e6d3b3] text-black text-sm tracking-wide rounded-md hover:scale-105 transition">
              EXPLORE WORK
            </button>

            <button className="px-6 py-3 border border-white/20 text-sm tracking-wide rounded-md hover:bg-white/10 transition">
              CONTACT
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 60 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full h-[420px] md:h-[520px]"
        >
          {/* glow behind 3D */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#e6d3b3]/10 via-transparent to-transparent blur-3xl" />

          {/* floating effect wrapper */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <PixelGuitar />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
