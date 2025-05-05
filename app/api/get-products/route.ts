import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.product.updateMany({
      where: {
        inventory: {
          lte: 10,
          gt: 0,
        },
      },
      data: {
        status: "LOW_STOCK",
      },
    });

    await prisma.product.updateMany({
      where: {
        inventory: 0,
      },
      data: {
        status: "OUT_OF_STOCK",
      },
    });
    await prisma.size.updateMany({
        where: {
          inventory: 0,
        },
        data: {
          status: "OUT_OF_STOCK",
        },
      });

    const getProducts = await prisma.product.findMany();
    const getPrices = await prisma.prices.findMany();
    const getSizes = await prisma.size.findMany();

    const sortProducts = getProducts.map((product) => {
      const productPrices = getPrices.filter((prev) => prev.productId === product.id);
      const productSizes = getSizes.filter((prev) => prev.productId === product.id);
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        colorHex: product.colorHex,
        colorName: product.colorName,
        status: product.status,
        inventory: product.inventory,
        priceOptions: [...productPrices],
        sizeOptions: [...productSizes],
      };
    });

    return new Response(JSON.stringify(sortProducts));
  } catch (error) {
    console.error("Could not fetch products", error);
    return new Response(JSON.stringify({ error }));
  }
}