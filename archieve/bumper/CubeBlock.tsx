type CubeBlockProps = {
  text: string;
  className?: string;
  variant?: "hero" | "normal";
};

export default function CubeBlock({
  text,
  className,
  variant = "normal",
}: CubeBlockProps) {
  const isHero = variant === "hero";

  return (
    <div className={`absolute ${className}`}>
      <div className="relative inline-block">
        {/* FRONT FACE */}
        <div
          className={`
            px-6 py-3 font-bold whitespace-nowrap
            ${isHero ? "bg-black text-white" : "bg-white text-black"}
          `}
          style={{
            transform: "skewY(-12deg)",
          }}
        >
          {text}
        </div>

        {/* RIGHT FACE */}
        <div
          className={`
            absolute top-0 right-[-28px] h-full w-[28px]
            ${isHero ? "bg-neutral-900" : "bg-gray-300"}
            flex items-center justify-center
            text-[10px] font-bold
          `}
          style={{
            transform: "skewY(-12deg)",
            transformOrigin: "left",
          }}
        >
          {/* ini yang bikin HELLO muncul di samping */}
          <span className="rotate-90 tracking-widest">{text}</span>
        </div>

        {/* BOTTOM FACE */}
        <div
          className={`
            absolute left-0 top-full w-full h-[22px]
            ${isHero ? "bg-neutral-800" : "bg-gray-400"}
          `}
          style={{
            transform: "skewX(45deg)",
            transformOrigin: "top left",
          }}
        />

        {/* SHADOW (biar ngangkat) */}
        <div className="absolute left-2 top-[110%] w-full h-[20px] bg-black/30 blur-md" />
      </div>
    </div>
  );
}
