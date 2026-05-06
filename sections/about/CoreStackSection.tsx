"use client";

import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiGreensock,
} from "react-icons/si";

const stacks = [
  {
    title: "Next.js",
    icon: SiNextdotjs,
    description:
      "Building scalable modern web applications with high performance architecture.",
  },
  {
    title: "React",
    icon: SiReact,
    description:
      "Creating reusable component systems and immersive user interfaces.",
  },
  {
    title: "TypeScript",
    icon: SiTypescript,
    description:
      "Writing maintainable, scalable, and strongly typed frontend code.",
  },
  {
    title: "Tailwind CSS",
    icon: SiTailwindcss,
    description:
      "Crafting responsive premium interfaces with utility-first styling.",
  },
  {
    title: "Framer Motion",
    icon: SiFramer,
    description:
      "Designing smooth animations and interactive motion experiences.",
  },
  {
    title: "GSAP",
    icon: SiGreensock,
    description:
      "Building cinematic transitions and advanced web interactions.",
  },
];

export default function CoreStackSection() {
  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
            Core Stack
          </p>

          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
            Technologies I Use
            <span className="block text-white/40 mt-2">
              To Craft Modern Experiences
            </span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stacks.map((stack, index) => {
            const Icon = stack.icon;

            return (
              <motion.div
                key={stack.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]"
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
                </div>

                {/* Icon */}
                <div className="mb-8 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <Icon className="text-3xl text-white" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">
                    {stack.title}
                  </h3>

                  <p className="leading-relaxed text-white/50 text-sm">
                    {stack.description}
                  </p>
                </div>

                {/* Bottom Line */}
                <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
