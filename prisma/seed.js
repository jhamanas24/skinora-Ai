const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Skinora AI database...');

  // 1. Create Default Users (Admin & Demo User)
  const adminPasswordHash = await bcrypt.hash('Admin@Skinora2026', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skinora.ai' },
    update: {},
    create: {
      email: 'admin@skinora.ai',
      name: 'Skinora Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const demoUserPasswordHash = await bcrypt.hash('DemoUser123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'user@skinora.ai' },
    update: {},
    create: {
      email: 'user@skinora.ai',
      name: 'Eleanor Vance',
      passwordHash: demoUserPasswordHash,
      role: 'USER',
    },
  });

  console.log(`Users seeded: Admin (${admin.email}), Demo User (${demoUser.email})`);

  // 2. Seed Initial Flagship Product: Pilgrim 10% Vitamin C Face Serum
  const flagshipProduct = await prisma.product.upsert({
    where: { id: 'pilgrim-vitamin-c-serum-30ml' },
    update: {},
    create: {
      id: 'pilgrim-vitamin-c-serum-30ml',
      name: '10% Vitamin C Face Serum with Niacinamide & Kakadu Plum',
      brand: 'Pilgrim',
      category: 'Face Serum',
      price: 650,
      size: '30 ml',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      description: 'A scientifically formulated, antioxidant-rich brightening serum powered by stable 3-O-Ethyl Ascorbic Acid, Niacinamide, and Kakadu Plum to visibly improve skin radiance, target dark spots, and smooth uneven skin tone.',
      ingredients: JSON.stringify([
        {
          name: '3-O-Ethyl Ascorbic Acid (Vitamin C 10%)',
          concentration: '10%',
          purpose: 'High-stability Vitamin C derivative that targets surface dullness and supports skin radiance.',
          keyActive: true,
        },
        {
          name: 'Niacinamide (Vitamin B3 5%)',
          concentration: '5%',
          purpose: 'Supports the appearance of even skin tone, refines visible pores, and strengthens surface barrier.',
          keyActive: true,
        },
        {
          name: 'Kakadu Plum Extract',
          concentration: '2%',
          purpose: 'World’s richest natural source of Vitamin C; provides intense antioxidant defence.',
          keyActive: true,
        },
        {
          name: 'Hyaluronic Acid (Sodium Hyaluronate)',
          concentration: '1%',
          purpose: 'Deeply hydrates outer skin layers, giving a plump, fresh appearance.',
          keyActive: false,
        },
        {
          name: 'Centella Asiatica (Cica) Extract',
          concentration: '1%',
          purpose: 'Comforts and soothes skin during active ingredient absorption.',
          keyActive: false,
        },
        {
          name: 'Aqua / Purified Water',
          concentration: 'Q.S.',
          purpose: 'Purified solvent vehicle for optimal penetration.',
          keyActive: false,
        },
      ]),
      claimedBenefits: JSON.stringify([
        'Promotes visible surface brightness and natural radiance',
        'Helps reduce the appearance of visible dark spots and sun discoloration',
        'Visibly balances uneven-looking skin tone and texture',
        'Lightweight, fast-absorbing, non-sticky hydration',
        'Antioxidant shield against daily environmental stress',
      ]),
      usageInstructions: 'After gentle cleansing, dispense 3 to 5 drops directly onto dry face and neck. Gently press and pat with fingertips until fully absorbed. Use consistently in your AM and PM routines. In the morning, always follow with broad-spectrum SPF 30+ sunscreen.',
      skinTypes: JSON.stringify(['All Skin Types', 'Normal', 'Combination', 'Dull Skin', 'Uneven Tone']),
      warnings: JSON.stringify([
        'For external cosmetic use only. Avoid contact with eyes.',
        'Perform a 24-hour patch test behind the ear or on inner forearm prior to initial use.',
        'Mild tingling may occur during initial applications as skin adjusts to Vitamin C.',
        'Discontinue use if significant discomfort or redness persists.',
        'Store in a cool, dry place away from direct sunlight.',
      ]),
      source: 'Official Pilgrim Catalog Specifications',
    },
  });

  console.log(`Initial product seeded: ${flagshipProduct.brand} ${flagshipProduct.name}`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
