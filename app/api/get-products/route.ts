import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await Promise.all([
      prisma.product.updateMany({
        where: { inventory: { lte: 10, gt: 0 } },
        data: { status: "LOW_STOCK" },
      }),
      prisma.product.updateMany({
        where: { inventory: { gt: 10 } },
        data: { status: "AVAILABLE" },
      }),
      prisma.product.updateMany({
        where: { inventory: 0 },
        data: { status: "OUT_OF_STOCK" },
      }),
      prisma.size.updateMany({
        where: { inventory: 0 },
        data: { status: "OUT_OF_STOCK" },
      }),
    ]);
    const [getProducts, getPrices, getSizes, getImages, restockUsers] = await Promise.all([
      prisma.product.findMany(),
      prisma.prices.findMany(),
      prisma.size.findMany(),
      prisma.image.findMany(),
      prisma.restockNotification.findMany(),
    ]);

    const sortProducts = getProducts.map((product) => {
      const productId = Number(product.id);

      const productPrices = getPrices.filter((p) => Number(p.productId) === productId);
      const productSizes = getSizes.filter((s) => Number(s.productId) === productId);
      const productImages = getImages.filter((i) => Number(i.productId) === productId);

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        colorHex: product.colorHex,
        colorName: product.colorName,
        status: product.status,
        inventory: product.inventory,
        priceOptions: productPrices,
        sizeOptions: productSizes,
        images: productImages,
      };
    });


    const productsBackInStock = getProducts.filter((product) => product.inventory >= 1);
    const notifyUsers: { productId: number; emails: string[] }[] = [];

    const googleSheetsUrl = process.env.GOOGLE_SHEETS_RESTOCK_NOTIFICATION_WEBHOOK_URL;
    if (!googleSheetsUrl) throw new Error("Google Sheets Url webhook URL is not defined");

    for (const product of productsBackInStock) {
      const usersForProduct = restockUsers.filter((user) => user.productId === product.id);

      if (usersForProduct.length > 0) {
        try {
          await Promise.all(
  usersForProduct.map((user) => {
    if (!user.email) return;

    return fetch(googleSheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        productName: product.title,
      }),
    });
  })
);

          notifyUsers.push({
            productId: product.id,
            emails: usersForProduct
              .map((u) => u.email)
              .filter((email): email is string => email !== null),
          });

          await prisma.restockNotification.deleteMany({
            where: { productId: product.id },
          });
        } catch (zapError) {
          console.error(`Failed to notify users for product ${product.id}`, zapError);
        }
      }
    }

    return new Response(JSON.stringify(sortProducts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Could not fetch products", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}