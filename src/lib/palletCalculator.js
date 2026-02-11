// Calculate level from pallet number
export const getLevelFromPallet = (palletNumber) => {
  if (!palletNumber) return null;
  const num = parseInt(palletNumber);
  return Math.ceil(num / 8); // 8 pallets per level
};

// Estimate retrieval time based on level
export const estimateRetrievalTime = (level) => {
  if (!level) return { min: 2, max: 4 }; // Default if unknown
  
  const baseTime = 2; // Base 2 minutes for ground level
  const perLevel = 0.5; // +30 seconds per level
  
  const minTime = baseTime + ((level - 1) * perLevel);
  const maxTime = minTime + 1; // Add 1 minute variance
  
  return {
    min: Math.round(minTime),
    max: Math.round(maxTime)
  };
};

// Calculate which lift serves which pallets (if we know the pattern)
export const getLiftForPallet = (palletNumber, liftPattern = 'alternating') => {
  if (!palletNumber) return null;
  
  // Assuming alternating pattern: odd pallets = Lift A, even = Lift B
  // You can adjust based on actual Robinson Suites configuration
  const num = parseInt(palletNumber);
  
  if (liftPattern === 'alternating') {
    return num % 2 === 1 ? 'A' : 'B';
  }
  
  // Or by range: 1-28 = Lift A, 29-56 = Lift B
  if (liftPattern === 'byRange') {
    return num <= 28 ? 'A' : 'B';
  }
  
  return null;
};
