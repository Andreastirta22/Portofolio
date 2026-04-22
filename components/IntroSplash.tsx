"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SPLASH_IMAGES = [
  "/splash/splash-blue.png",
  "/splash/splash-purple.png",
  "/splash/splash-teal.png",
  "/splash/splash-warm.png",
];

const HOLD_DURATION = 700;

const imageVariants = {
  enter: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.08,
    y: -20,
    filter: "blur(6px)",
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 1, 1],
    },
  },
};

interface IntroSplashProps {
  onFinish: () => void;
}

export default function IntroSplash({ onFinish }: IntroSplashProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const hasFinishedRef = useRef(false); // 🔥 guard biar ga double call

  // preload images
  useEffect(() => {
    SPLASH_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // sequence logic
  useEffect(() => {
    if (currentIndex < SPLASH_IMAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, HOLD_DURATION);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, HOLD_DURATION + 200);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          onFinish();
        }
      }}
    >
      {isVisible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden pointer-events-none"
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1 }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 70%)",
            }}
          />

          {/* rotating blur */}
          <motion.div
            className="absolute w-[120%] h-[120%]"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0.04), transparent, rgba(255,255,255,0.04))",
              filter: "blur(80px)",
            }}
          />

          {/* image sequence */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={SPLASH_IMAGES[currentIndex]}
              variants={imageVariants}
              initial="enter"
              animate="visible"
              exit="exit"
              className="absolute select-none"
              style={{
                width: "min(680px, 86vw)",
                height: "auto",
                objectFit: "contain",
                willChange: "transform, opacity, filter",
                pointerEvents: "none",
              }}
              draggable={false}
            />
          </AnimatePresence>

          {/* vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.6))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
