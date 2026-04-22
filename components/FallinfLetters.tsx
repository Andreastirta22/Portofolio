"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const images = [
  "/andre/a.png",
  "/andre/n.png",
  "/andre/d.png",
  "/andre/r.png",
  "/andre/e.png",
];

export default function FallingAndre() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const [styles, setStyles] = useState<
    { rotate: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    setStyles(
      images.map(() => ({
        rotate: (Math.random() - 0.5) * 40,
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 20,
      })),
    );
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-6 left-6 flex items-end pointer-events-none"
    >
      {styles.length > 0 &&
        images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            initial={{
              y: -300,
              opacity: 0,
              rotate: styles[i].rotate,
            }}
            animate={
              isInView
                ? {
                    y: [-300, 20, styles[i].y],
                    x: styles[i].x,
                    opacity: 1,
                    rotate: 0,
                  }
                : { y: -300, opacity: 0 }
            }
            transition={{
              delay: i * 0.15,
              duration: 0.9,
              ease: "easeOut",
            }}
            className="
              w-[80px] md:w-[120px]
              object-contain
              select-none
            "
            style={{
              marginLeft: i === 0 ? 0 : -20,
            }}
          />
        ))}
    </div>
  );
}
