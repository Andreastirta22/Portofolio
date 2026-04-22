"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function SecretGame() {
  const [secretMode, setSecretMode] = useState(false);
  const [score, setScore] = useState(0);

  // 🔥 HANDLE CLICK
  const handleClick = (e: MouseEvent) => {
    if (!secretMode) return;

    const x = e.clientX;
    const y = e.clientY;

    // 🎉 CONFETTI
    confetti({
      particleCount: 20,
      spread: 60,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });

    // ➕ SCORE
    setScore((prev) => prev + 1);

    // 💣 EFFECT
    spawnEffect(x, y);
  };

  // 💥 EFFECT FUNCTION
  const spawnEffect = (x: number, y: number) => {
    // +1 TEXT
    const text = document.createElement("div");
    text.innerHTML = "+1";
    text.className =
      "fixed text-sm font-bold text-black pointer-events-none animate-bounce z-[9999]";
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;

    document.body.appendChild(text);

    setTimeout(() => text.remove(), 800);

    // 💣 BOOM CIRCLE
    const boom = document.createElement("div");
    boom.className =
      "fixed w-10 h-10 rounded-full bg-black/20 pointer-events-none animate-ping z-[9998]";
    boom.style.left = `${x - 20}px`;
    boom.style.top = `${y - 20}px`;

    document.body.appendChild(boom);

    setTimeout(() => boom.remove(), 600);
  };

  // 🎧 LISTENER
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [secretMode]);

  return (
    <>
      {/* 🎮 TOGGLE BUTTON (debug / trigger) */}
      return (
      <>
        {secretMode && (
          <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-2 rounded-full text-sm shadow-lg">
            Score: {score}
          </div>
        )}
      </>
      );
      {/* 📊 SCORE */}
      {secretMode && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-2 rounded-full text-sm shadow-lg">
          Score: {score}
        </div>
      )}
    </>
  );
}
