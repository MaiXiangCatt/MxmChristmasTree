export type ElementType = "PHOTO" | "ORNAMENT";

export interface FloatingElementData {
  id: string;
  type: ElementType;
  chaosPos: [number, number, number];
  treePos: [number, number, number];
  rotation: [number, number, number];
  imageUrl?: string;
  color?: string; // For ornaments
  shape?: "sphere" | "box"; // For ornaments
}

export type SceneMode = "SCATTERED" | "FORMED";
