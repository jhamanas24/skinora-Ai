import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateCompatibility } from '@/services/productRecommendation';
import { getCurrentUser } from '@/lib/auth';
import { SkinMetrics, Product } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to calculate product compatibility.' },
        { status: 401 }
      );
    }

    const { skinAnalysisId, productId, userPreferences } = await req.json();

    if (!skinAnalysisId || !productId) {
      return NextResponse.json(
        { error: 'skinAnalysisId and productId are required' },
        { status: 400 }
      );
    }

    const skinAnalysis = await prisma.skinAnalysis.findUnique({
      where: { id: skinAnalysisId },
    });

    if (!skinAnalysis) {
      return NextResponse.json({ error: 'Skin analysis record not found' }, { status: 404 });
    }

    // Verify ownership
    if (skinAnalysis.userId && skinAnalysis.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Access to this analysis is denied.' }, { status: 403 });
    }

    const productRecord = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productRecord) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product: Product = {
      ...productRecord,
      ingredients: JSON.parse(productRecord.ingredients || '[]'),
      claimedBenefits: JSON.parse(productRecord.claimedBenefits || '[]'),
      skinTypes: JSON.parse(productRecord.skinTypes || '[]'),
      warnings: JSON.parse(productRecord.warnings || '[]'),
    };

    const metrics: SkinMetrics = {
      brightness: skinAnalysis.brightness,
      evenness: skinAnalysis.evenness,
      darkSpots: skinAnalysis.darkSpots as any,
      redness: skinAnalysis.redness as any,
      texture: skinAnalysis.texture as any,
      pores: skinAnalysis.pores as any,
      appearanceNotes: skinAnalysis.appearanceNotes,
      isDemo: skinAnalysis.isDemo,
    };

    const compatibility = calculateCompatibility(metrics, product, userPreferences);

    // Save Recommendation
    const recommendation = await prisma.recommendation.create({
      data: {
        skinAnalysisId: skinAnalysis.id,
        productId: product.id,
        compatibilityScore: compatibility.compatibilityScore,
        matchLevel: compatibility.matchLevel,
        buyScore: compatibility.buyScore,
        buyVerdict: compatibility.buyVerdict,
        advantages: JSON.stringify(compatibility.advantages),
        cautions: JSON.stringify(compatibility.cautions),
        explanation: compatibility.explanation,
        simulationImagePath: skinAnalysis.imagePath,
      },
    });

    return NextResponse.json({
      success: true,
      recommendationId: recommendation.id,
      compatibility,
      product,
      metrics,
    });
  } catch (error: any) {
    console.error('Compatibility calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate compatibility' },
      { status: 500 }
    );
  }
}
