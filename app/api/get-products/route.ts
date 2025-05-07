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
      const productPrices = getPrices.filter((prev) => prev.productId === product.id);
      const productSizes = getSizes.filter((prev) => prev.productId === product.id);
      const productImages = getImages.filter((prev) => prev.productId === product.id);
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
    const productsBackInStock = getProducts.filter((product) => product.inventory >= 1);
    // Group users by productId for products back in stock
    const notifyUsers: { productId: number, emails: string[] }[] = [];
    for (const product of productsBackInStock) {
      const usersForProduct = restockUsers.filter((user) => user.productId === product.id);
      if (usersForProduct.length > 0) {
        const productName = getProducts.find((prev) => prev.id === product.id)?.title;
            // Trigger Zapier webhook for these emails
            await fetch("https://hooks.zapier.com/hooks/catch/22705783/2n43tvy/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              // body: JSON.stringify({
              //   emails: usersForProduct.map((u) => u.email),
              // }),
             
              body: JSON.stringify({
                productName: productName,
                emails: usersForProduct.map((u) => u.email),
              }),
            });
        notifyUsers.push({
          productId: product.id,
          emails: usersForProduct.map((u) => u.email),
        });
        // Delete notifications for these users for this product
        await prisma.restockNotification.deleteMany({
          where: {
            productId: product.id,
          },
        });
      }
    }

   
    // return new Response(JSON.stringify({sortProducts,notifyUsers}));
    return new Response(JSON.stringify(sortProducts,));
  } catch (error) {
    console.error("Could not fetch products", error);
    return new Response(JSON.stringify({ error }));
  }
}