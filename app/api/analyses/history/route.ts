import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analyses = await prisma.skinAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        recommendations: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Fetch analysis history error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
