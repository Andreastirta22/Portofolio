import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────
interface VoxelConfig {
  x: number;
  y: number;
  z: number;
  color: number;
}

interface GuitarColors {
  body: number;
  neck: number;
  headstock: number;
  fretboard: number;
  fret: number;
  pickup: number;
  knob: number;
  bridge: number;
  string: number;
  nut: number;
  binding: number;
}

// ────────────────────────────────────────────────────────────────────────────────
// Guitar voxel data builder
// ────────────────────────────────────────────────────────────────────────────────
function buildGuitarVoxels(colors: GuitarColors): VoxelConfig[] {
  const voxels: VoxelConfig[] = [];

  const add = (x: number, y: number, z: number, color: number) =>
    voxels.push({ x, y, z, color });

  // ── Body (Stratocaster silhouette, top view) ──────────────────────
  // Row by row from bottom (y=0) to top of body
  const bodyMap: [number, number, number, number][] = [
    // [xStart, xEnd, yRow, zDepth] — depth = 2 layers
    // Lower bout
    [2, 7, 0, 0],
    [2, 7, 0, 1],
    [1, 8, 1, 0],
    [1, 8, 1, 1],
    [1, 8, 2, 0],
    [1, 8, 2, 1],
    [0, 9, 3, 0],
    [0, 9, 3, 1],
    [0, 9, 4, 0],
    [0, 9, 4, 1],
    [0, 9, 5, 0],
    [0, 9, 5, 1],
    [0, 9, 6, 0],
    [0, 9, 6, 1],
    [0, 9, 7, 0],
    [0, 9, 7, 1],
    // Waist
    [1, 8, 8, 0],
    [1, 8, 8, 1],
    [2, 7, 9, 0],
    [2, 7, 9, 1],
    [2, 7, 10, 0],
    [2, 7, 10, 1],
    // Upper bout
    [1, 8, 11, 0],
    [1, 8, 11, 1],
    [0, 9, 12, 0],
    [0, 9, 12, 1],
    [0, 9, 13, 0],
    [0, 9, 13, 1],
    [0, 8, 14, 0],
    [0, 8, 14, 1],
    [1, 7, 15, 0],
    [1, 7, 15, 1],
    [2, 6, 16, 0],
    [2, 6, 16, 1],
    // Upper horn (treble side, right)
    [0, 3, 17, 0],
    [0, 3, 17, 1],
    [0, 2, 18, 0],
    [0, 2, 18, 1],
    // Upper area (bass side continues higher)
    [4, 8, 17, 0],
    [4, 8, 17, 1],
    [5, 7, 18, 0],
    [5, 7, 18, 1],
  ];

  bodyMap.forEach(([xs, xe, y, z]) => {
    for (let x = xs; x < xe; x++) {
      add(x, y, z, colors.body);
    }
  });

  // Binding (edge highlight)
  const bindingRows = [0, 1, 2, 3, 7, 8, 14, 16, 17];
  bindingRows.forEach((y) => {
    add(0, y, 0, colors.binding);
    add(8, y, 0, colors.binding);
  });

  // ── Pickups ───────────────────────────────────────────────────────
  // Bridge pickup
  for (let x = 3; x < 7; x++) add(x, 3, 1, colors.pickup);
  for (let x = 3; x < 7; x++) add(x, 4, 1, colors.pickup);
  // Middle pickup
  for (let x = 3; x < 7; x++) add(x, 7, 1, colors.pickup);
  // Neck pickup
  for (let x = 3; x < 7; x++) add(x, 11, 1, colors.pickup);

  // ── Knobs ─────────────────────────────────────────────────────────
  add(7, 5, 1, colors.knob);
  add(7, 6, 1, colors.knob);
  add(7, 7, 1, colors.knob);
  add(8, 5, 1, colors.knob);

  // ── Bridge ────────────────────────────────────────────────────────
  for (let x = 3; x < 7; x++) add(x, 2, 1, colors.bridge);
  add(2, 2, 1, colors.bridge);
  add(7, 2, 1, colors.bridge);

  // ── Neck ─────────────────────────────────────────────────────────
  for (let y = 16; y <= 34; y++) {
    add(3, y, 0, colors.fretboard);
    add(4, y, 0, colors.fretboard);
    add(5, y, 0, colors.fretboard);
    add(3, y, 1, colors.neck);
    add(4, y, 1, colors.neck);
    add(5, y, 1, colors.neck);
  }

  // Frets (every 2 rows)
  for (let y = 18; y <= 34; y += 2) {
    add(3, y, 0, colors.fret);
    add(4, y, 0, colors.fret);
    add(5, y, 0, colors.fret);
  }

  // Nut
  add(3, 35, 0, colors.nut);
  add(4, 35, 0, colors.nut);
  add(5, 35, 0, colors.nut);

  // ── Headstock ────────────────────────────────────────────────────
  for (let y = 36; y <= 41; y++) {
    for (let x = 2; x < 8; x++) {
      add(x, y, 0, colors.headstock);
      add(x, y, 1, colors.headstock);
    }
  }
  // Tuner pegs
  const pegPositions = [2, 3, 4, 5, 6, 7];
  pegPositions.forEach((x, i) => {
    const side = i < 3 ? 1 : -1;
    const py = 37 + (i % 3);
    add(x + side, py, 0, colors.knob);
    add(x + side, py, 1, colors.knob);
  });

  // ── Strings ───────────────────────────────────────────────────────
  const stringXs = [3, 3, 4, 4, 5, 5];
  stringXs.forEach((x, i) => {
    for (let y = 2; y <= 35; y++) {
      // sparse string: every other y to save voxels
      if (y % 2 === i % 2) add(x, y, 2, colors.string);
    }
  });

  return voxels;
}

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────
export default function PixelGuitar3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.3, y: 0.5 });
  const autoRotate = useRef(true);

  const [guitarColor, setGuitarColor] = useState<
    "sunburst" | "sea" | "cherry" | "midnight"
  >("sunburst");
  const [showWireframe, setShowWireframe] = useState(false);
  const [voxelCount, setVoxelCount] = useState(0);

  const palettes: Record<string, GuitarColors> = {
    sunburst: {
      body: 0xd4420a,
      neck: 0xc8a96e,
      headstock: 0xd4420a,
      fretboard: 0x4a2c0a,
      fret: 0xc8b860,
      pickup: 0x111111,
      knob: 0xf0d060,
      bridge: 0x888888,
      string: 0xe8e8c0,
      nut: 0xf0ece0,
      binding: 0xf5e8c0,
    },
    sea: {
      body: 0x1a7a8a,
      neck: 0xc8a96e,
      headstock: 0x1a7a8a,
      fretboard: 0x3a1a0a,
      fret: 0xd0c880,
      pickup: 0x222222,
      knob: 0xe0d080,
      bridge: 0x999999,
      string: 0xe8e8d0,
      nut: 0xf0ece0,
      binding: 0xffffff,
    },
    cherry: {
      body: 0x8b0000,
      neck: 0xb89060,
      headstock: 0x8b0000,
      fretboard: 0x2a1000,
      fret: 0xc0b870,
      pickup: 0x0a0a0a,
      knob: 0xd0c060,
      bridge: 0x777777,
      string: 0xe0e0c0,
      nut: 0xf0ece0,
      binding: 0xf8f0e0,
    },
    midnight: {
      body: 0x1a1a3a,
      neck: 0x8a7050,
      headstock: 0x1a1a3a,
      fretboard: 0x200a00,
      fret: 0xa0a060,
      pickup: 0x050505,
      knob: 0xc0b050,
      bridge: 0x555555,
      string: 0xd0d0b0,
      nut: 0xe0dcd8,
      binding: 0x6060a0,
    },
  };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(0, 0, 38);
    cameraRef.current = camera;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff0e0, 1.2);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe0f0ff, 0.4);
    fillLight.position.set(-10, -5, 10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffa0a0, 0.3);
    rimLight.position.set(0, -15, -10);
    scene.add(rimLight);

    // Build guitar
    const buildScene = (colors: GuitarColors, wireframe: boolean) => {
      if (groupRef.current) {
        scene.remove(groupRef.current);
        groupRef.current.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            (obj.material as THREE.Material).dispose();
          }
        });
      }

      const group = new THREE.Group();
      const voxels = buildGuitarVoxels(colors);
      setVoxelCount(voxels.length);

      // Merge voxels by color for better performance
      const byColor = new Map<number, VoxelConfig[]>();
      voxels.forEach((v) => {
        if (!byColor.has(v.color)) byColor.set(v.color, []);
        byColor.get(v.color)!.push(v);
      });

      const voxelSize = 0.9;
      const geo = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);

      byColor.forEach((vs, color) => {
        const mat = new THREE.MeshStandardMaterial({
          color,
          wireframe,
          roughness: wireframe ? 1 : 0.55,
          metalness: wireframe ? 0 : 0.25,
        });

        vs.forEach(({ x, y, z }) => {
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x - 4.5, y - 20, z - 0.5);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });
      });

      group.rotation.x = rotation.current.x;
      group.rotation.y = rotation.current.y;
      groupRef.current = group;
      scene.add(group);
    };

    buildScene(palettes[guitarColor], showWireframe);

    // Animation loop
    let t = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      t += 0.008;
      if (groupRef.current && autoRotate.current && !isDragging.current) {
        groupRef.current.rotation.y += 0.004;
        rotation.current.y = groupRef.current.rotation.y;
        // Subtle floating
        groupRef.current.position.y = Math.sin(t) * 0.3;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse drag
    const onDown = (e: MouseEvent) => {
      isDragging.current = true;
      autoRotate.current = false;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !groupRef.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      groupRef.current.rotation.y += dx * 0.01;
      groupRef.current.rotation.x += dy * 0.01;
      rotation.current = {
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
      };
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      isDragging.current = false;
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      autoRotate.current = false;
      prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !groupRef.current) return;
      const dx = e.touches[0].clientX - prevMouse.current.x;
      const dy = e.touches[0].clientY - prevMouse.current.y;
      groupRef.current.rotation.y += dx * 0.01;
      groupRef.current.rotation.x += dy * 0.01;
      rotation.current = {
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
      };
      prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onUp);

    // Resize
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      el.removeChild(renderer.domElement);
      renderer.dispose();
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guitarColor, showWireframe]);

  const resetRotation = () => {
    if (!groupRef.current) return;
    rotation.current = { x: 0.3, y: 0.5 };
    groupRef.current.rotation.x = 0.3;
    groupRef.current.rotation.y = 0.5;
    autoRotate.current = true;
  };

  const colorOptions: {
    key: typeof guitarColor;
    label: string;
    hex: string;
  }[] = [
    { key: "sunburst", label: "Sunburst", hex: "#d4420a" },
    { key: "sea", label: "Sea Foam", hex: "#1a7a8a" },
    { key: "cherry", label: "Cherry", hex: "#8b0000" },
    { key: "midnight", label: "Midnight", hex: "#1a1a3a" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Courier New', monospace",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#f0e0c0",
              letterSpacing: "0.12em",
            }}
          >
            PIXEL GUITAR
          </h1>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.2em",
            }}
          >
            3D VOXEL MODEL · {voxelCount} VOXELS
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => setShowWireframe((v) => !v)}
            style={{
              background: showWireframe
                ? "rgba(255,200,80,0.15)"
                : "transparent",
              border: `1px solid ${showWireframe ? "rgba(255,200,80,0.5)" : "rgba(255,255,255,0.15)"}`,
              color: showWireframe ? "#ffc850" : "rgba(255,255,255,0.5)",
              padding: "5px 12px",
              borderRadius: 4,
              fontSize: 11,
              cursor: "pointer",
              letterSpacing: "0.1em",
              transition: "all 0.2s",
            }}
          >
            WIRE
          </button>
          <button
            onClick={resetRotation}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.5)",
              padding: "5px 12px",
              borderRadius: 4,
              fontSize: 11,
              cursor: "pointer",
              letterSpacing: "0.1em",
              transition: "all 0.2s",
            }}
          >
            RESET
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={mountRef}
        style={{
          flex: 1,
          cursor: isDragging.current ? "grabbing" : "grab",
          position: "relative",
          minHeight: 0,
        }}
      >
        {/* Drag hint */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
            pointerEvents: "none",
          }}
        >
          DRAG TO ROTATE
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: "12px 24px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {colorOptions.map(({ key, label, hex }) => (
          <button
            key={key}
            onClick={() => setGuitarColor(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 14px",
              background:
                guitarColor === key ? "rgba(255,255,255,0.08)" : "transparent",
              border: `1px solid ${guitarColor === key ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 4,
              cursor: "pointer",
              color: guitarColor === key ? "#ffffff" : "rgba(255,255,255,0.4)",
              fontSize: 11,
              letterSpacing: "0.1em",
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: hex,
                flexShrink: 0,
                boxShadow: guitarColor === key ? `0 0 6px ${hex}` : "none",
              }}
            />
            {label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
