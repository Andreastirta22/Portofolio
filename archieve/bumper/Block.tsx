type CubeBlockProps = {
  text: string;
  className?: string;
  invert?: boolean;
};

export default function CubeBlock({ text, className, invert }: CubeBlockProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative w-[140px] h-[60px]">
        {/* TOP FACE */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center font-bold
            ${invert ? "bg-black text-white" : "bg-white text-black"}
          `}
          style={{
            transform: "skewY(-10deg) skewX(10deg)",
          }}
        >
          {text}
        </div>

        {/* LEFT FACE */}
        <div
          className="absolute top-[60px] left-0 w-full h-[40px] bg-black/80"
          style={{
            transform: "skewY(10deg)",
            transformOrigin: "top",
          }}
        />

        {/* RIGHT FACE */}
        <div
          className="absolute top-0 left-[140px] w-[40px] h-full bg-black/60"
          style={{
            transform: "skewX(10deg)",
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
}
