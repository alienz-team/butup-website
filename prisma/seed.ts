import { PrismaClient } from "@prisma/client";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "../lib/catalog";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  for (const [i, c] of SEED_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameAr: c.nameAr, nameEn: c.nameEn, image: c.image, parentId: c.parentId, sortOrder: i },
      create: { ...c, sortOrder: i },
    });
  }

  // The store mirrors the original Site123 catalog exactly: products are overwritten from lib/catalog.ts
  // and anything not in that list (older seed rows, test products) is removed.
  for (const p of SEED_PRODUCTS) {
    const { id: _id, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, colors: p.colors as unknown as object },
      create: { ...p, colors: p.colors as unknown as object },
    });
  }
  await prisma.product.deleteMany({ where: { slug: { notIn: SEED_PRODUCTS.map((p) => p.slug) } } });
  await prisma.category.deleteMany({ where: { slug: { notIn: SEED_CATEGORIES.map((c) => c.slug) } } });

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hashPassword(password), role: "ADMIN" },
      create: { email, name: "Beautup admin", role: "ADMIN", passwordHash: hashPassword(password) },
    });
    console.log(`Admin user ready: ${email}`);
  } else {
    console.log("Skipped admin user: set ADMIN_EMAIL and ADMIN_PASSWORD to create one.");
  }
  console.log(`Seeded ${SEED_CATEGORIES.length} categories and ${SEED_PRODUCTS.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
