import {
  SkinMetrics,
  Product,
  CompatibilityResult,
  MatchLevel,
  CompatibilityFactors,
} from '@/types';

export function calculateCompatibility(
  metrics: SkinMetrics,
  product: Product,
  userPreferences?: {
    primaryGoal?: string;
    skinType?: string;
    sensitiveSkin?: boolean;
  }
): CompatibilityResult {
  // 1. Visible Concern Alignment (Weight: 40%)
  // For Pilgrim 10% Vitamin C Serum: Targets dullness, uneven tone, visible dark spots
  let concernScore = 50;

  // Dullness check (lower brightness = higher benefit potential from Vitamin C)
  if (metrics.brightness < 70) {
    concernScore += 25;
  } else if (metrics.brightness < 80) {
    concernScore += 15;
  } else {
    concernScore += 5;
  }

  // Uneven tone check
  if (metrics.evenness < 65) {
    concernScore += 15;
  } else if (metrics.evenness < 75) {
    concernScore += 10;
  }

  // Dark spots check
  if (metrics.darkSpots === 'High') {
    concernScore += 15;
  } else if (metrics.darkSpots === 'Moderate') {
    concernScore += 10;
  } else {
    concernScore += 5;
  }

  concernScore = Math.min(100, Math.max(20, concernScore));

  // 2. Key Active Ingredient Relevance (Weight: 25%)
  // Vitamin C (Ascorbic Acid derivative), Niacinamide, Kakadu Plum
  let ingredientScore = 85;
  const ingredientsStr = JSON.stringify(product.ingredients).toLowerCase();
  
  if (ingredientsStr.includes('vitamin c') || ingredientsStr.includes('ascorbic')) {
    ingredientScore += 5;
  }
  if (ingredientsStr.includes('niacinamide')) {
    ingredientScore += 5;
  }
  ingredientScore = Math.min(100, Math.max(30, ingredientScore));

  // 3. User Profile & Goal Fit (Weight: 15%)
  let profileScore = 80;
  if (userPreferences?.primaryGoal) {
    const goal = userPreferences.primaryGoal.toLowerCase();
    if (goal.includes('bright') || goal.includes('glow') || goal.includes('spot') || goal.includes('tone')) {
      profileScore = 95;
    }
  }

  // 4. Potential Sensitivity & Safety (Weight: 10%)
  let sensitivityScore = 85;
  if (metrics.redness === 'High' || userPreferences?.sensitiveSkin) {
    sensitivityScore = 60; // 10% Vitamin C can cause mild tingling on highly reactive skin
  } else if (metrics.redness === 'Moderate') {
    sensitivityScore = 75;
  } else {
    sensitivityScore = 90;
  }

  // 5. Formulation Suitability & Stability (Weight: 10%)
  // Ethyl Ascorbic Acid is a stable, gentle direct Vitamin C derivative
  const suitabilityScore = 88;

  // Weighted Total Calculation
  const totalWeighted =
    concernScore * 0.40 +
    ingredientScore * 0.25 +
    profileScore * 0.15 +
    sensitivityScore * 0.10 +
    suitabilityScore * 0.10;

  const finalScore = Math.round(totalWeighted);

  // Match Classification
  let matchLevel: MatchLevel = 'Good Match';
  let buyVerdict = 'WE RECOMMEND CONSIDERING IT';

  if (finalScore >= 80) {
    matchLevel = 'Strong Match';
    buyVerdict = 'STRONGLY ALIGNED WITH YOUR VISIBLE CONCERNS';
  } else if (finalScore >= 65) {
    matchLevel = 'Good Match';
    buyVerdict = 'WE RECOMMEND CONSIDERING IT';
  } else if (finalScore >= 50) {
    matchLevel = 'Consider Carefully';
    buyVerdict = 'PROCEED WITH CAREFUL PATCH TESTING';
  } else {
    matchLevel = 'Low Match';
    buyVerdict = 'MAY NOT TARGET YOUR PRIMARY CONCERNS';
  }

  // Generate Dynamic Advantages
  const advantages: string[] = [];

  if (metrics.brightness < 75) {
    advantages.push(
      'Your analysis shows visible dullness. The 10% Vitamin C (3-O-Ethyl Ascorbic Acid) and Kakadu Plum are well-known cosmetic actives designed to promote surface radiance and brightness.'
    );
  }

  if (metrics.evenness < 75 || metrics.darkSpots !== 'Low') {
    advantages.push(
      'Your analysis indicates uneven-looking skin tone and visible dark spots. The inclusion of 5% Niacinamide specifically helps improve the visual appearance of discoloration and uneven complexion.'
    );
  }

  if (metrics.texture !== 'Smooth') {
    advantages.push(
      'The lightweight serum formulation absorbs quickly without heavy residue, supporting smooth-looking skin surface texture.'
    );
  }

  if (advantages.length === 0) {
    advantages.push(
      'The antioxidant blend provides daily defense against environmental dullness and maintains visible complexion clarity.'
    );
  }

  // Generate Dynamic Considerations / Cautions
  const cautions: string[] = [
    'Visible skin analysis provides cosmetic compatibility estimates and cannot detect biological allergies or medical sensitivities.',
    'Vitamin C formulations may cause initial mild tingling on delicate skin. Perform a 24-hour patch test behind the ear before full face application.',
    'Always use broad-spectrum SPF 30+ sunscreen during daytime when using active antioxidant and brightening serums.',
    'Individual cosmetic results vary based on consistent daily routine, hydration, and sun protection.',
  ];

  if (metrics.redness === 'High') {
    cautions.unshift(
      'Moderate-to-high visible redness was detected. Introduce this 10% active serum gradually (2–3 times weekly) rather than daily to evaluate skin comfort.'
    );
  }

  // Recommendation Buy Score (slightly modulated from raw compatibility)
  const buyScore = Math.max(50, Math.min(95, finalScore - 2 + (metrics.brightness < 70 ? 2 : 0)));

  const explanation = `Based on the visible characteristics detected in your photo (radiance score: ${metrics.brightness}/100, evenness: ${metrics.evenness}/100, visible dark spots: ${metrics.darkSpots.toLowerCase()}) and ${product.name}'s active formulation (${product.brand}), this product demonstrates high functional alignment with your current skin appearance priorities.`;

  const factors: CompatibilityFactors = {
    concernAlignmentScore: concernScore,
    ingredientRelevanceScore: ingredientScore,
    userProfileScore: profileScore,
    sensitivitySafetyScore: sensitivityScore,
    suitabilityScore: suitabilityScore,
  };

  return {
    compatibilityScore: finalScore,
    matchLevel,
    buyScore,
    buyVerdict,
    advantages,
    cautions,
    explanation,
    factors,
  };
}
