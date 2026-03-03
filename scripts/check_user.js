require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
(async () => {
  const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });
  try {
    const u = await db.user.findUnique({ where: { email: 'john.farmer@digi-farms.com' } });
    console.log(JSON.stringify(u, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
  }
})();
