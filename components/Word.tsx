"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

export default function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const spread = 0.6;
  const range = spread / total;

  const start = index * range;
  const mid = start + range * 0.6; // 🔥 lebih panjang dikit biar kebaca
  const end = start + range * 1.2; // kasih overlap dikit
  const opacity = useTransform(progress, [start, mid], [0.1, 1]);

  // blur → sharp
  const blur = useTransform(progress, [start, mid], [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  // highlight active word
  const color = useTransform(
    progress,
    [start, mid, end],
    ["#9CA3AF", "#111827", "#9CA3AF"], // abu → hitam → abu
  );

  return (
    <motion.span
      style={{ opacity, filter, color }}
      className="mr-2 inline-block"
    >
      {word}
    </motion.span>
  );
}
