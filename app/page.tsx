"use client";

import { useState, useEffect } from "react";

import Landing from "@/sections/Landing";
import About from "@/sections/About";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";
import Timeline from "@/sections/Timeline";
import Education from "@/sections/Education";
import Gallery from "@/sections/Gallery";
import IntroTransition from "@/components/IntroTransition";

export default function Home() {
  const [ready, setReady] = useState(false);

  // 🔥 INIT STATE TANPA EFFECT SETSTATE
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;

    const hasSeen = sessionStorage.getItem("intro_seen");
    return !hasSeen;
  });

  const [openTimeline, setOpenTimeline] = useState(false);

  // 🔥 SET READY + STORAGE (NO SETSHOWSPLASH DI SINI)
  useEffect(() => {
    setReady(true);

    if (showSplash) {
      sessionStorage.setItem("intro_seen", "true");
    }
  }, [showSplash]);

  // 🔥 SCROLL RESET
  useEffect(() => {
    if (!showSplash && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [showSplash]);

  // 🔥 PREVENT HYDRATION MISMATCH
  if (!ready) return null;

  return (
    <main className="relative">
      {showSplash ? (
        <IntroSplash onFinish={() => setShowSplash(false)} />
      ) : (
        <div className="relative z-0">
          <Navbar />
          <Landing />
          <IntroTransition />
          <About />
          <Hero onExplore={() => setOpenTimeline(true)} />
          <Education />
          <Projects />
          <Gallery />
          <Footer />

          {openTimeline && <Timeline onClose={() => setOpenTimeline(false)} />}
        </div>
      )}
    </main>
  );
}
