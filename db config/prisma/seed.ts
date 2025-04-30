import { PrismaClient } from '../../app/generated/prisma';
const prisma = new PrismaClient();

async function Main(){
   const products =  await prisma.product.createMany({
    data: [
        {
            title: "TLC T Shirt",
            description: "Charcoal Black Unisex Triblend Tee",
            colorHex:"#221E1F",
            colorName: "Black",
            status: "AVAILABLE",
            inventory: 1
        },
        {
            title: "TLC Dog Hoodie",
            description: "Have your little dog sport some TLC",
            colorHex:"#CD3626",
            colorName: "Red",
            status: "AVAILABLE",
            inventory: 1
        }
        ,
        {
            title: "TLC Beanie",
            description: "Heather Charcoal Waffle Beanie featuring a black on white TLC Logo. Softest beanie in the world! 100% acrylic. One size fits most.",
            colorHex:"#221E1F",
            colorName: "Black",
            status: "AVAILABLE",
            inventory: 1
        },
        {
            title: "TLC Trucker Hat",
            description: "Adjustable Snap-Back Trucker Hat",
            colorHex:"#221E1F",
            colorName: "Black",
            status: "AVAILABLE",
            inventory: 1
        },
        {
            title: "TLC Grey hoodie with woven patch",
            description: "Nickel Grey - Heavyweight Full-Zip Hooded Sweatshirt",
            colorHex:"#808080",
            colorName: "Grey",
            status: "AVAILABLE",
            inventory: 1
        },
        {
            title: "TLC Printed Hoodie",
            description: "Charcoal Grey Midweight Full- Zip Hooded Sweatshirt with printed TLC logo on the back.",
            colorHex:"#221E1F",
            colorName: "Black",
            status: "AVAILABLE",
            inventory: 1
        },
        {
            title: "TLC Printed Hoodie",
            description: "Charcoal Grey Midweight Full- Zip Hooded Sweatshirt with printed TLC logo on the back.",
            colorHex:"#221E1F",
            colorName: "Black",
            status: "AVAILABLE",
            inventory: 1
        }
    ]
   })
   const sizes = await prisma.size.createMany({ 
    data: [
        {
            productId: 1,
            size: "Xtra Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 1,
            size: "Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 1,
            size: "Medium",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 1,
            size: "Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 1,
            size: "Xtra Large",
            inventory: 1,
            status: "AVAILABLE",
        }
        ,
        {
            productId: 2,
            size: "Small (3-6lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 2,
            size: "Medium (6-10lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 2,
            size: "Large (10-14lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 2,
            size: "XLarge (14-20lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 2,
            size: "XXX Large (25-35lbs)",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 2,
            size: "5XL (45-60Lbs)",
            inventory: 1,
            status: "AVAILABLE",
        }
        ,
        {
            productId: 3,
            size: "(FIGURE OUT THE SIZE THAAT IT IS))",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 4,
            size: "(FIGURE OUT THE SIZE THAAT IT IS))",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 5,
            size: "Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 5,
            size: "Medium",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 5,
            size: "Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 5,
            size: "Xtra Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 6,
            size: "Small",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 6,
            size: "Medium",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 6,
            size: "Large",
            inventory: 1,
            status: "AVAILABLE",
        },
        {
            productId: 6,
            size: "Xtra Large",
            inventory: 1,
            status: "AVAILABLE",
        }
    ]
   })
   const prices = await prisma.prices.createMany({
    data: [
        {
            productId: 1,
            price: 20
        },
        {
            productId: 2,
            price: 25
        },
        {
            productId: 2,
            price: 35
        },
        {
            productId: 3,
            price: 25
        },
        {
            productId: 4,
            price: 20
        },{
            productId: 5,
            price: 55
        },{
            productId: 6,
            price: 55
        },
    ]
   })
//    const images = await prisma.image.createMany({
//     data: [
//         {
//             productId: 1,
//             image: "",
//             alt: ""
//         }
//     ]
//    })
const images = await prisma.image.createMany({
    data: [
      {
        productId: 1,
        image: "path/to/image.jpg",
        // alt: "TLC T-Shirt Image"  // This should autocomplete now
      }
    ]
  });
}

// CREATE TABLE images (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     image_data LONGBLOB NOT NULL,
//     image_name VARCHAR(255) NOT NULL
// );