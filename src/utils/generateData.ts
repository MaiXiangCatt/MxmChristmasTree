import { v4 as uuidv4 } from "uuid";
import type { FloatingElementData, ElementType } from "../types";

export const generateData = (count: number = 300): FloatingElementData[] => {
  const data: FloatingElementData[] = [];
  const chaosRadius = 30;
  const treeHeight = 24;
  const treeBaseRadius = 10;
  const spiralTurns = 8;

  // Create type array: 30 photos, rest ornaments
  const photoCount = 30;
  const types: ElementType[] = Array(count).fill("ORNAMENT");
  for (let i = 0; i < photoCount; i++) {
    types[i] = "PHOTO";
  }

  // Shuffle types
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }

  const colors = [
    "#ff0000",
    "#e60012",
    "#008000",
    "#228b22",
    "#ffd700",
    "#ffd700",
    "#c0c0c0",
  ];

  // "Dart Throwing" approach
  // We try to fill the array until we reach 'count' items.
  // We don't rely on loop index 'i' for height anymore, we pick random heights.
  // To avoid infinite loops, we set a global max attempt limit.

  let placedCount = 0;
  let totalAttempts = 0;
  const MAX_TOTAL_ATTEMPTS = 50000;

  while (placedCount < count && totalAttempts < MAX_TOTAL_ATTEMPTS) {
    totalAttempts++;

    const type = types[placedCount];
    const isPhoto = type === "PHOTO";

    // --- Chaos Position (Sphere distribution) ---
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = chaosRadius * Math.cbrt(Math.random());
    const chaosPos: [number, number, number] = [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ];

    // --- Tree Position (Cone Spiral) ---
    // Pick a random normalized height with cone density bias
    // h = 1 - sqrt(1 - random) biases towards bottom (0)
    // We use random sampling instead of sequential filling to prevent getting stuck at the bottom

    const randomSeed = Math.random();
    const h = 1 - Math.sqrt(1 - randomSeed);

    const y = h * treeHeight - treeHeight / 2;
    const currentRadius = treeBaseRadius * (1 - h);
    const angle = h * spiralTurns * Math.PI * 2 + Math.random() * 0.5;

    const treePos: [number, number, number] = [
      currentRadius * Math.cos(angle),
      y,
      currentRadius * Math.sin(angle),
    ];

    // --- Collision Check ---
    let valid = true;
    for (let k = 0; k < data.length; k++) {
      const prev = data[k];
      const dx = treePos[0] - prev.treePos[0];
      const dy = treePos[1] - prev.treePos[1];
      const dz = treePos[2] - prev.treePos[2];
      const distSq = dx * dx + dy * dy + dz * dz;

      // Thresholds
      let minDist = 1.2;
      if (isPhoto && prev.type === "PHOTO") {
        minDist = 2.8; // Aggressive
      } else if (isPhoto || prev.type === "PHOTO") {
        minDist = 2.0;
      }

      if (distSq < minDist * minDist) {
        valid = false;
        break;
      }
    }

    if (valid) {
      // Ornament properties
      const color = !isPhoto
        ? colors[Math.floor(Math.random() * colors.length)]
        : undefined;
      const shape = !isPhoto
        ? Math.random() > 0.3
          ? "sphere"
          : "box"
        : undefined;

      data.push({
        id: uuidv4(),
        type,
        chaosPos,
        treePos,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        imageUrl: isPhoto
          ? `https://placehold.co/300x400/png?text=Memory+${placedCount}`
          : undefined,
        color,
        shape,
      });
      placedCount++;
    }
  }

  if (placedCount < count) {
    console.warn(
      `Could only place ${placedCount} items out of ${count} without collision.`
    );
  }

  return data;
};
