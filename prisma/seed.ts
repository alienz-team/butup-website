import { PrismaClient } from "@prisma/client";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "../lib/catalog";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  for (const [i, c] of SEED_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameAr: c.nameAr, nameEn: c.nameEn, image: c.image, sortOrder: i },
      create: { ...c, sortOrder: i },
    });
  }

  // Seed products are refreshed from lib/catalog.ts (images, copy, price); stock is left as the dashboard set it.
  for (const p of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { titleAr: p.titleAr, titleEn: p.titleEn, descriptionAr: p.descriptionAr, descriptionEn: p.descriptionEn, price: p.price, compareAtPrice: p.compareAtPrice, images: p.images, sizes: p.sizes, colors: p.colors as unknown as object, categoryId: p.categoryId, isFeatured: p.isFeatured },
      create: { ...p, colors: p.colors as unknown as object },
    });
  }

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
