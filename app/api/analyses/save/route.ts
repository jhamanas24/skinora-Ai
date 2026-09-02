import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to save this analysis to your account' },
        { status: 401 }
      );
    }

    const { recommendationId, notes } = await req.json();

    if (!recommendationId) {
      return NextResponse.json(
        { error: 'recommendationId is required' },
        { status: 400 }
      );
    }

    const saved = await prisma.savedAnalysis.create({
      data: {
        userId: user.id,
        recommendationId,
        notes: notes || '',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis successfully saved to your dashboard',
      savedId: saved.id,
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}
