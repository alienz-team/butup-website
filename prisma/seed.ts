import { PrismaClient } from "@prisma/client";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "../lib/catalog";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  for (const [i, c] of SEED_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameAr: c.nameAr, nameEn: c.nameEn, image: c.image, sortOrder: i },
      create: { slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn, image: c.image, sortOrder: i },
    });
    for (const [j, s] of c.subs.entries()) {
      await prisma.subCategory.upsert({
        where: { slug: s.slug },
        update: { nameAr: s.nameAr, nameEn: s.nameEn, categorySlug: c.slug, sortOrder: j },
        create: { slug: s.slug, nameAr: s.nameAr, nameEn: s.nameEn, categorySlug: c.slug, sortOrder: j },
      });
    }
  }

  // Existing products keep any edits made in the dashboard; only missing ones are created.
  for (const p of SEED_PRODUCTS) {
    const { id: _id, ...data } = p;
    await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: { ...data, colors: data.colors as unknown as object },
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
