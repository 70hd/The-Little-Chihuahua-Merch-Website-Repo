import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function Main() {
    try{
        // const products = await Promise.all([
        //     prisma.product.upsert({
        //         where: { title: "TLC T Shirt" },
        //         update: {},
        //         create: {
        //             title: "TLC T Shirt",
        //             description: "Charcoal Black Unisex Triblend Tee",
        //             colorHex: "#221E1F",
        //             colorName: "Black",
        //             status: "AVAILABLE",
        //             inventory: 1
        //         }
        //     }),
        //     prisma.product.upsert({
        //         where: { title: "TLC Dog Hoodie" },
        //         update: {},
        //         create: {
        //             title: "TLC Dog Hoodie",
        //             description: "Have your little dog sport some TLC",
        //             colorHex: "#CD3626",
        //             colorName: "Red",
        //             status: "AVAILABLE",
        //             inventory: 1
        //         }
        //     }),
        //     prisma.product.upsert({
        //         where: { title: "TLC Beanie" },
        //         update: {},
        //         create: {
        //             title: "TLC Beanie",
        //             description: "Heather Charcoal Waffle Beanie featuring a black on white TLC Logo. Softest beanie in the world! 100% acrylic. One size fits most.",
        //             colorHex: "#221E1F",
        //             colorName: "Black",
        //             status: "AVAILABLE",
        //             inventory: 1
        //         }
        //     }),
        //     prisma.product.upsert({
        //         where: { title: "TLC Trucker Hat" },
        //         update: {},
        //         create: {
        //             title: "TLC Trucker Hat",
        //             description: "Adjustable Snap-Back Trucker Hat",
        //             colorHex: "#221E1F",
        //             colorName: "Black",
        //             status: "AVAILABLE",
        //             inventory: 1
        //         }
        //     }),
        //     prisma.product.upsert({
        //         where: { title: "TLC Grey hoodie with woven patch" },
        //         update: {},
        //         create: {
        //             title: "TLC Grey hoodie with woven patch",
        //             description: "Nickel Grey - Heavyweight Full-Zip Hooded Sweatshirt",
        //             colorHex: "#808080",
        //             colorName: "Grey",
        //             status: "AVAILABLE",
        //             inventory: 1
        //         }
        //     }),
        //     prisma.product.upsert({
        //         where: { title: "TLC Printed Hoodie" },
        //         update: {},
        //         create: {
        //             title: "TLC Printed Hoodie",
        //             description: "Charcoal Grey Midweight Full- Zip Hooded Sweatshirt with printed TLC logo on the back.",
        //             colorHex: "#221E1F",
        //             colorName: "Black",
        //             status: "AVAILABLE",
        //             inventory: 1
        //         }
        //     }),
        // ]);

   const sizes = await prisma.size.createMany({ 
    data: [
        {
            productId: 8,
            size: "Xtra Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 8,
            size: "Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 8,
            size: "Medium",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 8,
            size: "Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 8,
            size: "Xtra Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 9,
            size: "Small (3-6lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 9,
            size: "Medium (6-10lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 9,
            size: "Large (10-14lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 9,
            size: "XLarge (14-20lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 9,
            size: "XXX Large (25-35lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 9,
            size: "5XL (45-60Lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 10,
            size: "(FIGURE OUT THE SIZE THAT IT IS)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 11,
            size: "(FIGURE OUT THE SIZE THAT IT IS)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 12,
            size: "Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 12,
            size: "Medium",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 12,
            size: "Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 12,
            size: "Xtra Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 13,
            size: "Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 13,
            size: "Medium",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 13,
            size: "Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 13,
            size: "Xtra Large",
            inventory: 1,
            status: "AVAILABLE",
        }
    ]
   });

   const prices = await prisma.prices.createMany({
    data: [
        {
            productId: 8,
            price: 20
        },
        {
            productId: 9,
            price: 25
        },
        {
            productId: 9,
            price: 35
        },
        {
            productId: 10,
            price: 25
        },
        {
            productId: 11,
            price: 20
        },
        {
            productId: 12,
            price: 55
        },
        {
            productId: 13,
            price: 55
        }
    ]
   });
   console.log("Seeding completed!");
} catch (error) {
  console.error("Error running seed:", error);
} finally {
  await prisma.$disconnect();
}
}

Main()
   .catch((error) => {
      console.error("Error running seed:", error);
   })
   .finally(async () => {
      await prisma.$disconnect(); // Disconnect Prisma client after execution
   });
//    const images = await prisma.image.createMany({
//     data: [
//         {
//             productId: 8,
//             image: "",
//             alt: ""
//         }
//     ]
//    })
// const images = await prisma.image.createMany({
//     data: [
//       {
//         productId: 8,
//         image: "path/to/image.jpg",
//         // alt: "TLC T-Shirt Image"  // This should autocomplete now
//       }
//     ]
//   });
// }

