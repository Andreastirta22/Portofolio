"use client";

import { useEffect } from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleScroll = () => {
      const content = document.getElementById("main-content");
      if (!content) return;

      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;

      const progress = scrollY / maxScroll;

      // 🎬 cinematic effect
      const scale = 1 - progress * 0.05;
      const radius = progress * 40;

      content.style.transform = `scale(${scale})`;
      content.style.borderRadius = `${radius}px`;
      content.style.boxShadow = "0 30px 80px rgba(0,0,0,0.25)";
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <>{children}</>;
}
