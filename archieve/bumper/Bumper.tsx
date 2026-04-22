import CubeBlock from "./CubeBlock";

export default function Bumper() {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0f0f0f] flex items-center justify-center">
      <div className="relative w-[520px] h-[520px]">
        {/* HERO */}
        <CubeBlock
          text="HELLO"
          variant="hero"
          className="top-[40px] left-[200px] z-30"
        />

        {/* ROW 2 */}
        <CubeBlock
          text="こんにちは"
          className="top-[110px] left-[140px] z-20"
        />

        <CubeBlock text="HALO" className="top-[110px] left-[290px] z-20" />

        {/* ROW 3 */}
        <CubeBlock
          text="안녕하세요"
          className="top-[180px] left-[120px] z-10"
        />

        <CubeBlock text="你好" className="top-[180px] left-[300px] z-10" />

        {/* BASE */}
        <CubeBlock text="Bonjour" className="top-[260px] left-[200px] z-0" />
      </div>
    </div>
  );
}
