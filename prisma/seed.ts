import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Bitmain Miner S17 Pro",
    description: "Bitmain Antminer S17 Pro ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S17 Pro",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s17-pro.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Air Cooled"],
  },

  {
    name: "Bitmain Miner S19 Pro",
    description: "Bitmain Antminer S19 Pro ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S19 Pro",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s19-pro.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Air Cooled"],
  },

  {
    name: "Bitmain Miner S19 XP Hydro",
    description: "Bitmain Antminer S19 XP Hydro ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S19 XP Hydro",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Hydro Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s19-xp-hydro.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Hydro Cooled"],
  },

  {
    name: "Bitmain Miner S19k Pro",
    description: "Bitmain Antminer S19k Pro ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S19k Pro",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s19k-pro.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Air Cooled"],
  },

  {
    name: "Bitmain Miner S21 Hydro",
    description: "Bitmain Antminer S21 Hydro ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S21 Hydro",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Hydro Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s21-hydro.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Hydro Cooled"],
  },

  {
    name: "Bitmain Miner S21 Pro",
    description: "Bitmain Antminer S21 Pro ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S21 Pro",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s21-pro.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Air Cooled"],
  },

  {
    name: "Bitmain Miner S21 XP",
    description: "Bitmain Antminer S21 XP ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer S21 XP",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-s21-xp.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Air Cooled"],
  },

  {
    name: "Bitmain Miner T19",
    description: "Bitmain Antminer T19 ASIC mining machine.",
    manufacturer: "Bitmain",
    model: "Antminer T19",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/antminer-t19.png",
    categories: ["ASIC Miner"],
    tags: ["Bitmain", "Antminer", "Air Cooled"],
  },

  {
    name: "MicroBT WhatsMiner M60S",
    description: "MicroBT WhatsMiner M60S ASIC mining machine.",
    manufacturer: "MicroBT",
    model: "WhatsMiner M60S",
    price: 0,
    hashRate: "",
    power: 0,
    cooling: "Air Cooled",
    stock: 0,
    isNew: false,
    featured: false,
    image: "/products/whatsminer-m60s.png",
    categories: ["ASIC Miner"],
    tags: ["MicroBT", "WhatsMiner", "Air Cooled"],
  },
];

async function main() {
  console.log("Starting product seeding...");

  for (const item of products) {
    const slug = item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { image, categories, tags, ...productData } = item;

    await prisma.product.upsert({
      where: { slug },

      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: [
            {
              url: image,
              alt: item.name,
              isPrimary: true,
              position: 0,
            },
          ],
        },
        categories: {
          connectOrCreate: categories.map((name) => ({
            where: {
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
            create: {
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
          })),
        },
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: {
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
            create: {
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
          })),
        },
      },

      create: {
        ...productData,
        slug,
        currency: "USD",
        images: {
          create: [
            {
              url: image,
              alt: item.name,
              isPrimary: true,
              position: 0,
            },
          ],
        },
        categories: {
          connectOrCreate: categories.map((name) => ({
            where: {
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
            create: {
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
          })),
        },
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: {
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
            create: {
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            },
          })),
        },
      },
    });

    console.log(`Seeded: ${item.name}`);
  }

  console.log("Product seeding completed!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });