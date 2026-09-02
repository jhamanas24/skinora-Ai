import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const query = searchParams.get('q');

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const parsed = products.map((p) => ({
      ...p,
      ingredients: JSON.parse(p.ingredients || '[]'),
      claimedBenefits: JSON.parse(p.claimedBenefits || '[]'),
      skinTypes: JSON.parse(p.skinTypes || '[]'),
      warnings: JSON.parse(p.warnings || '[]'),
    }));

    return NextResponse.json({ products: parsed });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
      source,
    } = body;

    if (!name || !brand || !category || !price) {
      return NextResponse.json(
        { error: 'Name, brand, category, and price are required' },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        price: parseFloat(price),
        size: size || '30 ml',
        image: image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        description: description || '',
        ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients || []),
        claimedBenefits: typeof claimedBenefits === 'string' ? claimedBenefits : JSON.stringify(claimedBenefits || []),
        usageInstructions: usageInstructions || '',
        skinTypes: typeof skinTypes === 'string' ? skinTypes : JSON.stringify(skinTypes || []),
        warnings: typeof warnings === 'string' ? warnings : JSON.stringify(warnings || []),
        source: source || 'Admin Catalog Entry',
      },
    });

    return NextResponse.json({
      product: {
        ...created,
        ingredients: JSON.parse(created.ingredients),
        claimedBenefits: JSON.parse(created.claimedBenefits),
        skinTypes: JSON.parse(created.skinTypes),
        warnings: JSON.parse(created.warnings),
      },
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
