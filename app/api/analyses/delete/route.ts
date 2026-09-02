import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { deleteUploadedImage } from '@/services/storage';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisId } = await req.json();

    if (!analysisId) {
      return NextResponse.json({ error: 'analysisId is required' }, { status: 400 });
    }

    const analysis = await prisma.skinAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Authorization check: User must own the record or be admin
    if (analysis.userId && analysis.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete associated physical image file for privacy
    if (analysis.imagePath && analysis.imagePath.startsWith('/uploads/')) {
      await deleteUploadedImage(analysis.imagePath);
    }

    await prisma.skinAnalysis.delete({
      where: { id: analysisId },
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis record and associated photo deleted successfully for privacy.',
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    return NextResponse.json({ error: 'Failed to delete analysis' }, { status: 500 });
  }
}
