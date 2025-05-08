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
    const getImages = await prisma.image.findMany();
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
        priceOptions: [...productPrices],
        sizeOptions: [...productSizes],
        images: [...productImages]
      };
    });
    // Find users whose associated product is now back in stock
    const restockUsers = await prisma.restockNotification.findMany();
    // Filter products back in stock
    const productsBackInStock = getProducts.filter((product) => product.inventory && product.inventory >= 1);
    // Group users by productId for products back in stock
    const notifyUsers: { productId: number, emails: string[] }[] = [];
    for (const product of productsBackInStock) {
      const usersForProduct = restockUsers.filter((user) => user.productId === product.id);
      if (usersForProduct.length > 0) {
        const zapierUrl = process.env.ZAPIER_RESTOCK_NOTIFICATION_WEBHOOK_URL;

        if (!zapierUrl) {
          throw new Error("Zapier webhook URL is not defined");
        }
        const productName = getProducts.find((prev) => prev.id === product.id)?.title;
            // Trigger Zapier webhook for these emails
            await fetch(zapierUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
    
              body: JSON.stringify({
                productName: productName,
                emails: usersForProduct.map((u) => u.email),
              }),
            });
            notifyUsers.push({
              productId: Number(product.id), // Convert BigInt to number
              emails: usersForProduct
              .map((u) => u.email)
              .filter((email): email is string => email !== null),
            });
        // Delete notifications for these users for this product
        await prisma.restockNotification.deleteMany({
          where: {
            productId: product.id, // Use 'productid' instead of 'productId'
          },
        });
      }
    }

   
    // return new Response(JSON.stringify({sortProducts,notifyUsers}));
    return new Response(JSON.stringify(sortProducts));
  } catch (error) {
    console.error("Could not fetch products", error);
    return new Response(JSON.stringify({ error }));
  }
}