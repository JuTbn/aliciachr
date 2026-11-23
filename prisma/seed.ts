import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { products } from "./products";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Vérifie que les images existent bien dans /public
  const missing = products.filter(
    (p) => !fs.existsSync(path.join(process.cwd(), "public", p.imageUrl))
  );
  if (missing.length > 0) {
    console.warn("⚠️ Images introuvables :");
    missing.forEach((p) => console.warn("  -", p.imageUrl));
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`${products.length} produits insérés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());