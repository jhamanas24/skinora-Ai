import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkinImage } from '@/services/skinAnalysis';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to run skin analysis.' },
        { status: 401 }
      );
    }

    const { imageBase64, imageUrl } = await req.json();

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json({ error: 'Image is required for analysis' }, { status: 400 });
    }

    const targetBase64 = imageBase64 || imageUrl;
    const metrics = await analyzeSkinImage(targetBase64);

    // Persist analysis record linked to authenticated user
    const analysisRecord = await prisma.skinAnalysis.create({
      data: {
        userId: user.id,
        imagePath: imageUrl || '/uploads/sample_face.jpg',
        brightness: metrics.brightness,
        evenness: metrics.evenness,
        darkSpots: metrics.darkSpots,
        redness: metrics.redness,
        texture: metrics.texture,
        pores: metrics.pores,
        appearanceNotes: metrics.appearanceNotes,
        isDemo: Boolean(metrics.isDemo),
      },
    });

    return NextResponse.json({
      success: true,
      analysisId: analysisRecord.id,
      metrics,
    });
  } catch (error: any) {
    console.error('Skin analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete skin analysis' },
      { status: 500 }
    );
  }
}
