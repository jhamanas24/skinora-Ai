import { NextRequest, NextResponse } from 'next/server';
import { generateVisualSimulation } from '@/services/visualSimulation';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to generate visual simulations.' },
        { status: 401 }
      );
    }

    const { imageBase64, productName, keyIngredients } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image is required for simulation' }, { status: 400 });
    }

    const simulation = await generateVisualSimulation({
      imageBase64,
      productName: productName || 'Skincare Product',
      keyIngredients: keyIngredients || ['Vitamin C', 'Niacinamide'],
    });

    return NextResponse.json({
      success: true,
      simulationUrl: simulation.simulationUrl,
      simulationNote: simulation.simulationNote,
    });
  } catch (error: any) {
    console.error('Visual simulation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate visual simulation' },
      { status: 500 }
    );
  }
}
