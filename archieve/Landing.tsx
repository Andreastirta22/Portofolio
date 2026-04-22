"use client";

export default function Landing() {
  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#e8e1d1]">
      {/* VIDEO */}
      <video
        src="/visualism/Portofolio.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="
      absolute inset-0 w-full h-full
      object-contain
      scale-[1.1]
      md:scale-100
      contrast-[1.15]
      brightness-[0.92]
      saturate-[1.05]
      z-10
    "
      />

      {/* FOCUS GRADIENT */}
      <div
        className="
    absolute inset-0 z-20
    bg-gradient-to-b 
    from-black/25 
    via-transparent 
    to-black/25
  "
      />
    </section>
  );
}
