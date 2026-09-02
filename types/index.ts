export type SeverityLevel = 'Low' | 'Moderate' | 'High';
export type TextureLevel = 'Smooth' | 'Moderate' | 'Pronounced';
export type PoreLevel = 'Refined' | 'Moderate' | 'Visible';

export interface SkinMetrics {
  brightness: number; // 0 - 100
  evenness: number;   // 0 - 100
  darkSpots: SeverityLevel;
  redness: SeverityLevel;
  texture: TextureLevel;
  pores: PoreLevel;
  appearanceNotes: string;
  isDemo?: boolean;
}

export interface ProductIngredient {
  name: string;
  concentration?: string;
  purpose: string;
  keyActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string;
  image: string;
  description: string;
  ingredients: ProductIngredient[];
  claimedBenefits: string[];
  usageInstructions: string;
  skinTypes: string[];
  warnings: string[];
  source?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type MatchLevel = 'Strong Match' | 'Good Match' | 'Consider Carefully' | 'Low Match';

export interface CompatibilityFactors {
  concernAlignmentScore: number;    // Weight: 40%
  ingredientRelevanceScore: number;  // Weight: 25%
  userProfileScore: number;          // Weight: 15%
  sensitivitySafetyScore: number;    // Weight: 10%
  suitabilityScore: number;          // Weight: 10%
}

export interface CompatibilityResult {
  compatibilityScore: number; // 0 - 100
  matchLevel: MatchLevel;
  buyScore: number;           // 0 - 100
  buyVerdict: string;
  advantages: string[];
  cautions: string[];
  explanation: string;
  factors: CompatibilityFactors;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface FullAnalysisReport {
  id: string;
  createdAt: string;
  isDemo: boolean;
  imagePath: string;
  simulationImagePath?: string | null;
  metrics: SkinMetrics;
  product: Product;
  recommendation: {
    id: string;
    compatibilityScore: number;
    matchLevel: MatchLevel;
    buyScore: number;
    buyVerdict: string;
    advantages: string[];
    cautions: string[];
    explanation: string;
  };
}
