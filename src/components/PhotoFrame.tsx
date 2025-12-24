import { Image } from "@react-three/drei";

interface PhotoFrameProps {
  url: string;
  onClick?: () => void;
  selected?: boolean;
}

export const PhotoFrame = ({ url, onClick }: PhotoFrameProps) => {
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Frame Background (Polaroid White Border) */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#fdfdfd" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Placeholder Dark Background (Visible if image fails) */}
      <mesh position={[0, 0.1, 0.005]}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* The Photo Image */}
      <Image
        url={url}
        position={[0, 0.1, 0.01]} // Slightly up to leave space for bottom border
        scale={[1.0, 1.0]} // Square-ish photo area
        toneMapped={false} // Important for bloom
        transparent
        opacity={1}
      />
    </group>
  );
};
