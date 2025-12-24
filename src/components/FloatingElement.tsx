import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { Group, Vector3, Quaternion, Euler } from "three";
import type { FloatingElementData, SceneMode } from "../types";
import { PhotoFrame } from "./PhotoFrame";

interface FloatingElementProps {
  data: FloatingElementData;
  mode: SceneMode;
  onFocus: (id: string) => void;
  isFocused: boolean;
}

export const FloatingElement = ({
  data,
  mode,
  onFocus,
  isFocused,
}: FloatingElementProps) => {
  const groupRef = useRef<Group>(null);
  const targetPosRef = useRef(new Vector3());
  const targetRotRef = useRef(new Quaternion());

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isFocused) {
      // Calculate position relative to camera: 6 units in front
      const camera = state.camera;
      const forward = new Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.multiplyScalar(6);

      const target = camera.position.clone().add(forward);
      targetPosRef.current.copy(target);
      targetRotRef.current.copy(camera.quaternion);
    } else {
      const p = mode === "FORMED" ? data.treePos : data.chaosPos;
      targetPosRef.current.set(p[0], p[1], p[2]);

      if (mode === "FORMED") {
        const angle = Math.atan2(data.treePos[0], data.treePos[2]);
        targetRotRef.current.setFromEuler(new Euler(0, angle, 0));
      } else {
        targetRotRef.current.setFromEuler(
          new Euler(data.rotation[0], data.rotation[1], data.rotation[2])
        );
      }
    }

    const smoothTime = isFocused ? 0.2 : 0.8;

    easing.damp3(
      groupRef.current.position,
      targetPosRef.current,
      smoothTime,
      delta
    );
    easing.dampQ(
      groupRef.current.quaternion,
      targetRotRef.current,
      smoothTime,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      {data.type === "PHOTO" && data.imageUrl ? (
        <PhotoFrame
          url={data.imageUrl}
          onClick={() => onFocus(data.id)}
          selected={isFocused}
        />
      ) : (
        <mesh>
          {data.shape === "box" ? (
            <boxGeometry args={[0.6, 0.6, 0.6]} />
          ) : (
            <sphereGeometry args={[0.4, 32, 32]} />
          )}
          <meshStandardMaterial
            color={data.color}
            metalness={0.9}
            roughness={0.2}
            emissive={data.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
};
