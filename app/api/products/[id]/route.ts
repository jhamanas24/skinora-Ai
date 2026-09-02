import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        ingredients: JSON.parse(product.ingredients || '[]'),
        claimedBenefits: JSON.parse(product.claimedBenefits || '[]'),
        skinTypes: JSON.parse(product.skinTypes || '[]'),
        warnings: JSON.parse(product.warnings || '[]'),
      },
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      brand,
      category,
      price,
      size,
      image,
      description,
      ingredients,
      claimedBenefits,
      usageInstructions,
      skinTypes,
      warnings,
    } = body;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        brand,
        category,
        price: parseFloat(price),
        size,
        image,
        description,
        ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients || []),
        claimedBenefits: typeof claimedBenefits === 'string' ? claimedBenefits : JSON.stringify(claimedBenefits || []),
        usageInstructions,
        skinTypes: typeof skinTypes === 'string' ? skinTypes : JSON.stringify(skinTypes || []),
        warnings: typeof warnings === 'string' ? warnings : JSON.stringify(warnings || []),
      },
    });

    return NextResponse.json({
      product: {
        ...updated,
        ingredients: JSON.parse(updated.ingredients),
        claimedBenefits: JSON.parse(updated.claimedBenefits),
        skinTypes: JSON.parse(updated.skinTypes),
        warnings: JSON.parse(updated.warnings),
      },
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
