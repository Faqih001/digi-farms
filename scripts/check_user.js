require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
(async () => {
  const db = new PrismaClient();
  try {
    const u = await db.user.findUnique({ where: { email: 'john.farmer@digi-farms.com' } });
    console.log(JSON.stringify(u, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
  }
})();
