const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.listing.count();
    console.log('Connected! Count:', count);
  } catch(e) {
    console.error('Failed to connect:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
