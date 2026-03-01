/**
 * Prisma Seed Script
 * Run with: npx prisma db seed
 */

import { PrismaClient, Role, SubscriptionTier } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@digi-farms.com" },
    update: {},
    create: {
      name: "DIGI-FARMS Admin",
      email: "admin@digi-farms.com",
      password: adminPassword,
      role: Role.ADMIN,
      country: "Kenya",
      subscription: {
        create: { tier: SubscriptionTier.ENTERPRISE, price: 0 },
      },
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create sample farmer
  const farmerPassword = await bcrypt.hash("Farmer@123456", 12);
  const farmer = await prisma.user.upsert({
    where: { email: "john.farmer@digi-farms.com" },
    update: {},
    create: {
      name: "John Kamau",
      email: "john.farmer@digi-farms.com",
      password: farmerPassword,
      role: Role.FARMER,
      phone: "+254712345678",
      country: "Kenya",
      subscription: {
        create: { tier: SubscriptionTier.PRO, price: 29 },
      },
    },
  });
  console.log("✅ Farmer created:", farmer.email);

  // Create farm for farmer
  const farm = await prisma.farm.upsert({
    where: { userId: farmer.id },
    update: {},
    create: {
      userId: farmer.id,
      name: "Kamau Family Farm",
      location: "Nakuru, Kenya",
      latitude: -0.3031,
      longitude: 36.0800,
      sizeHectares: 5.5,
      soilType: "Red Loam",
      waterSource: "Borehole + Rainwater",
      description: "Mixed crop farm specializing in maize and vegetables",
    },
  });

  // Create crops
  await prisma.crop.createMany({
    data: [
      {
        farmId: farm.id,
        name: "Maize",
        variety: "H614D Hybrid",
        plantedAt: new Date("2025-03-15"),
        areaHectares: 3.0,
        expectedYield: 18.0,
        status: "HEALTHY",
        season: "Long Rains 2025",
      },
      {
        farmId: farm.id,
        name: "Tomatoes",
        variety: "Anna F1",
        plantedAt: new Date("2025-04-01"),
        areaHectares: 1.5,
        expectedYield: 45.0,
        status: "AT_RISK",
        season: "Long Rains 2025",
      },
      {
        farmId: farm.id,
        name: "Kale (Sukuma Wiki)",
        variety: "Collard Green",
        plantedAt: new Date("2025-04-20"),
        areaHectares: 1.0,
        expectedYield: 8.0,
        status: "HEALTHY",
        season: "Long Rains 2025",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Farm and crops created");

  // Create supplier user
  const supplierPassword = await bcrypt.hash("Supplier@123456", 12);
  const supplierUser = await prisma.user.upsert({
    where: { email: "wanjiku.agro@digi-farms.com" },
    update: {},
    create: {
      name: "Wanjiku Agrovet",
      email: "wanjiku.agro@digi-farms.com",
      password: supplierPassword,
      role: Role.SUPPLIER,
      phone: "+254722345678",
      country: "Kenya",
      subscription: {
        create: { tier: SubscriptionTier.PRO, price: 49 },
      },
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: { userId: supplierUser.id },
    update: {},
    create: {
      userId: supplierUser.id,
      companyName: "Wanjiku Agro Supplies Ltd",
      description: "Leading supplier of quality seeds, fertilizers and agrochemicals in East Africa",
      phone: "+254722345678",
      address: "Tom Mboya Street, Nairobi, Kenya",
      isVerified: true,
      rating: 4.7,
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        supplierId: supplier.id,
        name: "DK8031 Yellow Maize Seed",
        description: "High-yield drought-tolerant hybrid maize seed. Produces 30–35 bags/acre in optimal conditions.",
        category: "Seeds",
        subcategory: "Maize",
        price: 2850,
        unit: "2kg bag",
        stock: 500,
        imageUrls: [],
        tags: ["maize", "hybrid", "drought-tolerant"],
        isActive: true,
        isFeatured: true,
        isAntiCounterfeit: true,
      },
      {
        supplierId: supplier.id,
        name: "CAN Fertilizer 50kg",
        description: "Calcium Ammonium Nitrate fertilizer for top dressing. 26% Nitrogen content.",
        category: "Fertilizers",
        subcategory: "Nitrogen",
        price: 3600,
        unit: "50kg bag",
        stock: 1200,
        imageUrls: [],
        tags: ["fertilizer", "nitrogen", "can"],
        isActive: true,
        isFeatured: false,
        isAntiCounterfeit: true,
      },
      {
        supplierId: supplier.id,
        name: "Ridomil Gold MZ 68WP",
        description: "Systemic fungicide for control of downy mildew, blight and damping off in vegetables.",
        category: "Agrochemicals",
        subcategory: "Fungicides",
        price: 1800,
        unit: "100g packet",
        stock: 300,
        imageUrls: [],
        tags: ["fungicide", "blight", "vegetables"],
        isActive: true,
        isFeatured: true,
        isAntiCounterfeit: true,
      },
      {
        supplierId: supplier.id,
        name: "Drip Irrigation Kit (1/4 Acre)",
        description: "Complete drip irrigation kit for 1/4 acre. Includes pipes, drippers, filter, and connectors.",
        category: "Irrigation",
        subcategory: "Drip Systems",
        price: 12500,
        unit: "kit",
        stock: 80,
        imageUrls: [],
        tags: ["irrigation", "drip", "water-saving"],
        isActive: true,
        isFeatured: true,
        isAntiCounterfeit: false,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Supplier & products created");

  // Create lender user
  const lenderPassword = await bcrypt.hash("Lender@123456", 12);
  const lender = await prisma.user.upsert({
    where: { email: "equity.agri@digi-farms.com" },
    update: {},
    create: {
      name: "Equity Agri Finance",
      email: "equity.agri@digi-farms.com",
      password: lenderPassword,
      role: Role.LENDER,
      country: "Kenya",
      subscription: {
        create: { tier: SubscriptionTier.ENTERPRISE, price: 199 },
      },
    },
  });
  console.log("✅ Lender created:", lender.email);

  // Create loan application
  await prisma.loanApplication.create({
    data: {
      userId: farmer.id,
      amount: 150000,
      purpose: "Purchase of inputs (seeds, fertilizer, pesticides) for the long rains season",
      tenure: 6,
      status: "SUBMITTED",
      riskScore: 72.5,
    },
  });

  // Create insurance policy
  await prisma.insurancePolicies.create({
    data: {
      userId: farmer.id,
      policyNumber: "DF-INS-2025-001",
      provider: "UAP Old Mutual",
      cropCovered: "Maize",
      coverageAmount: 200000,
      premium: 6000,
      startDate: new Date("2025-03-15"),
      endDate: new Date("2025-09-15"),
      status: "ACTIVE",
    },
  });
  console.log("✅ Loan & insurance created");

  // Create agrovets
  await prisma.agrovet.createMany({
    data: [
      {
        name: "Nakuru Agrovet",
        address: "Kenyatta Avenue, Nakuru",
        latitude: -0.3031,
        longitude: 36.0800,
        phone: "+254712000001",
        services: ["Seeds", "Fertilizers", "Pesticides", "Veterinary Drugs"],
        isVerified: true,
        rating: 4.5,
        openingHours: "Mon-Sat 8AM-6PM",
      },
      {
        name: "Mkulima Supplies",
        address: "Moi Avenue, Eldoret",
        latitude: 0.5143,
        longitude: 35.2698,
        phone: "+254712000002",
        services: ["Seeds", "Fertilizers", "Farm Tools", "Advisory"],
        isVerified: true,
        rating: 4.3,
        openingHours: "Mon-Sat 7:30AM-6:30PM",
      },
      {
        name: "Green Thumb Agro",
        address: "Kimathi Street, Nairobi",
        latitude: -1.2921,
        longitude: 36.8219,
        phone: "+254712000003",
        services: ["Seeds", "Organic Fertilizers", "Irrigation Equipment"],
        isVerified: true,
        rating: 4.8,
        openingHours: "Mon-Fri 8AM-5PM, Sat 8AM-2PM",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Agrovets created");

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📋 Sample Login Credentials:");
  console.log("   Admin:    admin@digi-farms.com    / Admin@123456");
  console.log("   Farmer:   john.farmer@digi-farms.com / Farmer@123456");
  console.log("   Supplier: wanjiku.agro@digi-farms.com / Supplier@123456");
  console.log("   Lender:   equity.agri@digi-farms.com / Lender@123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
