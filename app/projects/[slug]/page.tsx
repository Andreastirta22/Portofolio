"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export const projects = [
  {
    slug: "koinonia-app",
    title: "Koinonia App",
    desc: "A mobile-based information system designed to digitize community management, including attendance tracking, financial reporting, and resident data management. Built with Flutter and Firebase, this app improves efficiency, transparency, and real-time access for both administrators and members.",
    images: [
      "https://ik.imagekit.io/0bdqq0ixx/koinonia/Home.jpg",
      "https://ik.imagekit.io/0bdqq0ixx/koinonia/Page1.jpg",
      "https://ik.imagekit.io/0bdqq0ixx/koinonia/Page2.jpg",
    ],
    video: "https://ik.imagekit.io/0bdqq0ixx/koinonia/Koinonia.mp4",
    stack: ["Flutter", "Firebase"],
    year: "2025",
    role: "Mobile Developer",
    status: "Live",
    num: "01",
  },
  {
    slug: "bat-army",
    title: "Batarmy Production",
    desc: "High-converting landing page with clean UI and responsive design. Built for a music production brand with dark aesthetics, bold typography, and immersive visual storytelling.",
    images: [
      "https://ik.imagekit.io/0bdqq0ixx/mockup/batarny/Home%20NightBat.png",
      "https://ik.imagekit.io/0bdqq0ixx/mockup/batarny/Home%20Bat%20Army.png",
      "https://ik.imagekit.io/0bdqq0ixx/mockup/batarny/Contact%20Us%20Bat%20Army.png",
      "https://ik.imagekit.io/0bdqq0ixx/mockup/batarny/About%20Us%20Bat%20Army.png",
    ],
    video:
      "https://ik.imagekit.io/0bdqq0ixx/MockupBatarmy.mp4?updatedAt=1776648334662",
    stack: ["React"],
    year: "2023",
    role: "UI Designer",
    status: "Draft",
    num: "02",
  },
  {
    slug: "portofolio-website",
    title: "You Are Here",
    desc: "A personal playground where I explore interaction, motion, and digital experience.",
    images: [
      "https://ik.imagekit.io/0bdqq0ixx/Mockup.png?updatedAt=1776660646799",
    ],
    video: "",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    year: "2024",
    role: "Frontend Developer",
    status: "Live",
    num: "03",
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  Live: {
    label: "Live",
    color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Draft: {
    label: "Draft",
    color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  Concept: {
    label: "Concept",
    color: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    dot: "bg-sky-400",
  },
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const router = useRouter();

  const project = projects.find((p) => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex !== -1 ? projects[(currentIndex + 1) % projects.length] : null;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setImgLoading(true);
  }, [activeImage]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight")
        setActiveImage((prev) => (prev + 1) % (project?.images.length ?? 1));
      if (e.key === "ArrowLeft")
        setActiveImage(
          (prev) =>
            (prev - 1 + (project?.images.length ?? 1)) %
            (project?.images.length ?? 1),
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-3">
          <div className="text-[120px] font-thin text-white/5 leading-none select-none">
            404
          </div>
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase">
            Project not found
          </p>
        </div>
        <button
          onClick={() => router.push("/#projects")}
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-white/40 text-sm hover:border-white/25 hover:text-white/80 transition-all duration-300"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
            ←
          </span>
          Back to Projects
        </button>
      </div>
    );
  }

  const statusStyle = statusConfig[project.status] ?? {
    label: project.status,
    color: "bg-white/5 text-white/40 border border-white/10",
    dot: "bg-white/40",
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "none" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.06] backdrop-blur-xl bg-[#0a0a0a]/70">
        <button
          onClick={() => router.push("/#projects")}
          className="group flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors duration-200"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200 text-base">
            ←
          </span>
          Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.25em] text-white/20 uppercase font-mono">
            {project.num}
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="text-[10px] tracking-[0.25em] text-white/20 uppercase">
            Project
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${statusStyle.color}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`}
          />
          {statusStyle.label}
        </div>
      </nav>

      {/* ── HERO IMAGE ── */}
      <div
        className="relative w-full overflow-hidden pt-[57px]"
        style={{ aspectRatio: "16/9" }}
      >
        {imgLoading && (
          <div className="absolute inset-0 bg-white/[0.03] animate-pulse z-10" />
        )}
        <img
          key={activeImage}
          src={project.images[activeImage]}
          alt={project.title}
          onLoad={() => setImgLoading(false)}
          className="w-full h-full object-contain"
          style={{
            transition: "opacity 0.4s ease",
            opacity: imgLoading ? 0 : 1,
          }}
        />
        {/* Bottom fade overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* Image counter */}
        <div className="absolute bottom-5 right-6 text-[11px] font-mono text-white/30">
          {String(activeImage + 1).padStart(2, "0")} /{" "}
          {String(project.images.length).padStart(2, "0")}
        </div>

        {/* Arrow navigation */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveImage(
                  (prev) =>
                    (prev - 1 + project.images.length) % project.images.length,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setActiveImage((prev) => (prev + 1) % project.images.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
        {/* ── LEFT ── */}
        <div className="space-y-8">
          {/* Title */}
          <div>
            <p className="text-[11px] tracking-[0.25em] text-white/25 uppercase font-mono mb-2">
              {project.year} · {project.role}
            </p>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">
              {project.title}
            </h1>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2.5 flex-wrap">
            {project.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="relative overflow-hidden rounded-xl flex-shrink-0 transition-all duration-200"
                style={{
                  outline:
                    i === activeImage
                      ? "2px solid rgba(255,255,255,0.4)"
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              >
                <img
                  src={img}
                  alt={`Preview ${i + 1}`}
                  className="w-20 h-14 object-cover transition-opacity duration-200"
                  style={{ opacity: i === activeImage ? 1 : 0.4 }}
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06]" />

          {/* Description */}
          <p className="text-white/50 text-base leading-relaxed">
            {project.desc}
          </p>

          {/* Stack */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs text-white/50 border border-white/[0.08] bg-white/[0.03]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="space-y-4 lg:pt-[68px]">
          {/* Info card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            {/* Meta rows */}
            <div className="divide-y divide-white/[0.06]">
              {[
                { label: "Year", value: project.year },
                { label: "Role", value: project.role },
                { label: "Stack", value: project.stack.join(", ") },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-5 py-3.5"
                >
                  <span className="text-[11px] uppercase tracking-widest text-white/20">
                    {label}
                  </span>
                  <span className="text-sm text-white/60 text-right max-w-[160px]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="p-4">
              {project.video ? (
                <button
                  onClick={() => setIsOpen(true)}
                  className="group w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full border-2 border-black/20 flex items-center justify-center text-[10px]">
                    ▶
                  </span>
                  View Teaser
                </button>
              ) : (
                <div className="w-full py-3 text-center rounded-xl border border-dashed border-white/10 text-white/20 text-sm">
                  No video available
                </div>
              )}
            </div>
          </div>

          {/* Project number display */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-[60px] font-thin text-white/[0.04] leading-none select-none tabular-nums">
              {project.num}
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* ── NEXT PROJECT ── */}
      {nextProject && (
        <div className="px-6 md:px-10 pb-16 max-w-6xl mx-auto">
          <div className="h-px bg-white/[0.06] mb-8" />
          <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase mb-4">
            Next Project
          </p>
          <button
            onClick={() => {
              setIsLoaded(false);
              setTimeout(
                () => router.push(`/projects/${nextProject.slug}`),
                200,
              );
            }}
            className="group w-full flex items-center justify-between px-6 py-5 border border-white/[0.08] rounded-2xl hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300"
          >
            <div className="text-left">
              <p className="text-white/30 text-xs mb-1 font-mono">
                {nextProject.num}
              </p>
              <p className="text-white/80 text-lg font-light group-hover:text-white transition-colors">
                {nextProject.title}
              </p>
            </div>
            <span className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200 text-xl">
              →
            </span>
          </button>
        </div>
      )}

      {/* ── VIDEO MODAL ── */}
      {isOpen && project.video && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.88)" }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-[92%] max-w-4xl"
            style={{ aspectRatio: "16/9" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white/40 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
            >
              <span className="text-xs">ESC</span>
              <span>✕</span>
            </button>

            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10">
              <video
                ref={videoRef}
                src={project.video}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
