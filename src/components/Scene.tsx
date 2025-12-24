import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Shape, ExtrudeGeometry } from "three";
import { generateData } from "../utils/generateData";
import { FloatingElement } from "./FloatingElement";
import type { SceneMode } from "../types";

interface SceneProps {
  mode: SceneMode;
  focusedId: string | null;
  onFocus: (id: string) => void;
  onCloseFocus: () => void;
  onToggleMode: () => void;
}

const Loader = () => (
  <Html center>
    <div className="text-white">Loading Christmas...</div>
  </Html>
);

// Create a 5-pointed star shape
const createStarShape = () => {
  const shape = new Shape();
  const outerRadius = 1.0;
  const innerRadius = 0.5;
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = (i / (points * 2)) * Math.PI * 2;
    const x = Math.cos(a + Math.PI / 2) * r; // Rotate to point up
    const y = Math.sin(a + Math.PI / 2) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
};

export const Scene = ({
  mode,
  focusedId,
  onFocus,
  onCloseFocus,
  onToggleMode,
}: SceneProps) => {
  const data = useMemo(() => generateData(300), []);

  const starGeometry = useMemo(() => {
    const shape = createStarShape();
    const geom = new ExtrudeGeometry(shape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2,
    });
    geom.center(); // Center the geometry so it rotates around its center
    return geom;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 35], fov: 45 }}
      style={{ background: "#000" }}
      onPointerMissed={() => {
        if (focusedId) {
          onCloseFocus();
        } else {
          onToggleMode();
        }
      }}
    >
      <Suspense fallback={<Loader />}>
        <Environment preset="city" />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {data.map((el) => (
          <FloatingElement
            key={el.id}
            data={el}
            mode={mode}
            onFocus={onFocus}
            isFocused={focusedId === el.id}
          />
        ))}

        {/* Top Star (3D Extruded 5-Point Star) */}
        <mesh
          position={[0, 12.5, 0]}
          scale={mode === "FORMED" ? 1.0 : 0}
          rotation={[0, 0, 0]}
        >
          <primitive object={starGeometry} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={2}
            roughness={0.1}
            metalness={1}
          />
        </mesh>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
            height={300}
            intensity={1.2}
          />
        </EffectComposer>
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={60}
        autoRotate={!focusedId && mode === "FORMED"}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
