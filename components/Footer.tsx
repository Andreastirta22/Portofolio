"use client";

import FallingLetters from "@/components/FallinfLetters";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative min-h-[350px] bg-neutral-100 text-black overflow-hidden border-t border-black/10">
      {/* NOISE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.webp')]" />

      {/* GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

      {/* 🔥 TEXT ATAS */}
      <div className="relative z-10 flex flex-col items-center pt-10 gap-4">
        <div className="flex gap-6 text-sm text-black/60">
          <a href="#">Github</a>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
        </div>

        <p className="text-xs text-black/40">© 2026 Andre</p>

        <p className="text-[10px] text-black/20 hover:text-black/50 transition cursor-default">
          PLEASE LOGO DI NAVBAR JANGAN DICLICK YAHHHH!!!!! 👀
        </p>
      </div>

      {/* 🔥 SEKIAN IMAGE */}
      <div className="absolute bottom-[2px] md:bottom-[20px] left-[40px] md:left-[200px] z-10">
        <Image
          src="/sekian.png"
          alt="Sekian Dari Saya"
          width={220}
          height={220}
          className="opacity-80 hover:opacity-100 transition duration-300"
        />
      </div>

      {/* 🔥 ANDRE */}
      <FallingLetters />
    </footer>
  );
}
