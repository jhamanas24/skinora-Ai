import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { FullAnalysisReport } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view analysis reports.' },
        { status: 401 }
      );
    }

    const recommendation = await prisma.recommendation.findUnique({
      where: { id: params.id },
      include: {
        skinAnalysis: true,
        product: true,
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Check ownership if linked to a user
    if (
      recommendation.skinAnalysis.userId &&
      recommendation.skinAnalysis.userId !== user.id &&
      user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Forbidden. Access to this analysis report is denied.' },
        { status: 403 }
      );
    }

    const report: FullAnalysisReport = {
      id: recommendation.id,
      createdAt: recommendation.createdAt.toISOString(),
      isDemo: recommendation.skinAnalysis.isDemo,
      imagePath: recommendation.skinAnalysis.imagePath,
      simulationImagePath: recommendation.simulationImagePath,
      metrics: {
        brightness: recommendation.skinAnalysis.brightness,
        evenness: recommendation.skinAnalysis.evenness,
        darkSpots: recommendation.skinAnalysis.darkSpots as any,
        redness: recommendation.skinAnalysis.redness as any,
        texture: recommendation.skinAnalysis.texture as any,
        pores: recommendation.skinAnalysis.pores as any,
        appearanceNotes: recommendation.skinAnalysis.appearanceNotes,
        isDemo: recommendation.skinAnalysis.isDemo,
      },
      product: {
        ...recommendation.product,
        ingredients: JSON.parse(recommendation.product.ingredients || '[]'),
        claimedBenefits: JSON.parse(recommendation.product.claimedBenefits || '[]'),
        skinTypes: JSON.parse(recommendation.product.skinTypes || '[]'),
        warnings: JSON.parse(recommendation.product.warnings || '[]'),
      },
      recommendation: {
        id: recommendation.id,
        compatibilityScore: recommendation.compatibilityScore,
        matchLevel: recommendation.matchLevel as any,
        buyScore: recommendation.buyScore,
        buyVerdict: recommendation.buyVerdict,
        advantages: JSON.parse(recommendation.advantages || '[]'),
        cautions: JSON.parse(recommendation.cautions || '[]'),
        explanation: recommendation.explanation,
      },
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Fetch analysis report error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
