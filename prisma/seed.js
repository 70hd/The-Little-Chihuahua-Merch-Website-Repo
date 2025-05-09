import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    const productData = [
      {
        id: 1,
        title: "TLC T Shirt",
        description: "Charcoal Black Unisex Triblend Tee",
        colorHex: "#221E1F",
        colorName: "Black",
        status: "AVAILABLE",
        inventory: 1,
      },
      {
        id: 2,
        title: "TLC Dog Hoodie",
        description: "Have your little dog sport some TLC",
        colorHex: "#CD3626",
        colorName: "Red",
        status: "AVAILABLE",
        inventory: 1,
      },
      {
        id: 3,
        title: "TLC Beanie",
        description:
          "Heather Charcoal Waffle Beanie featuring a black on white TLC Logo. Softest beanie in the world! 100% acrylic. One size fits most.",
        colorHex: "#221E1F",
        colorName: "Black",
        status: "AVAILABLE",
        inventory: 1,
      },
      {
        id: 4,
        title: "TLC Trucker Hat",
        description: "Adjustable Snap-Back Trucker Hat",
        colorHex: "#221E1F",
        colorName: "Black",
        status: "AVAILABLE",
        inventory: 1,
      },
      {
        id: 5,
        title: "TLC Grey hoodie with woven patch",
        description: "Nickel Grey - Heavyweight Full-Zip Hooded Sweatshirt",
        colorHex: "#808080",
        colorName: "Grey",
        status: "AVAILABLE",
        inventory: 1,
      },
      {
        id: 6,
        title: "TLC Printed Hoodie",
        description:
          "Charcoal Grey Midweight Full- Zip Hooded Sweatshirt with printed TLC logo on the back.",
        colorHex: "#221E1F",
        colorName: "Black",
        status: "AVAILABLE",
        inventory: 1,
      },
    ];

    const createdProducts = [];

    for (const data of productData) {
      const product = await prisma.product.upsert({
        where: { title: data.title },
        update: {},
        create: {
          title: data.title,
          description: data.description,
          colorHex: data.colorHex,
          colorName: data.colorName,
          status: data.status,
          inventory: data.inventory,
          id: data.id,
        },
      });

      createdProducts.push(product);
    }

    await prisma.image.deleteMany();
    const images = await prisma.image.createMany({
      data: [
        {
          id: 1,
          productId: 1,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575177/2023_TLC_Product_24-min_jdudzp.jpg",
          alt: "Woman standing and pointing at a black TLC Beanie with both hands",
        },
        {
          id: 2,
          productId: 1,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746578901/2023_TLC_Product_23-min_wqskdz.jpg",
          alt: "Close-up of a woman wearing a black TLC Beanie, smiling softly",
        },
        {
          id: 3,
          productId: 1,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575177/2023_TLC_Product_22-min_dsk0lo.jpg",
          alt: "Woman smiling and spreading her arms while wearing the black TLC Beanie",
        },
        {
          id: 4,
          productId: 1,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575266/2023_TLC_Product_61-min_mcvch3.jpg",
          alt: "Black TLC Beanie displayed on a wooden surface",
        },
        {
          id: 5,
          productId: 2,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575178/2023_TLC_Product_29-min_bvksav.jpg",
          alt: "Man holding the black TLC Hat with his left hand, looking towards the left",
        },
        {
          id: 6,
          productId: 2,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575177/2023_TLC_Product_28-min_stlca8.jpg",
          alt: "Man standing with arms on hips, gazing at the sky while wearing the black TLC Hat",
        },
        {
          id: 7,
          productId: 2,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575181/2023_TLC_Product_36-min_g94dac.jpg",
          alt: "Man's back wearing the black TLC Hat with a dog on his right shoulder, looking at the camera",
        },
        {
          id: 8,
          productId: 2,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575265/2023_TLC_Product_63-min_gvdovz.jpg",
          alt: "Black TLC Hat resting on a white table next to other accessories",
        },
        {
          id: 9,
          productId: 3,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575230/2023_TLC_Product_59-min_uexc8k.jpg",
          alt: "Black TLC Beanie shown folded with tag visible",
        },
        {
          id: 10,
          productId: 3,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575264/2023_TLC_Product_60-min_sfs8jt.jpg",
          alt: "Rear view of person wearing the TLC Beanie outdoors",
        },
        {
          id: 11,
          productId: 3,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575182/2023_TLC_Product_37-min_qr42gi.jpg",
          alt: "Man's back wearing the black TLC Hat with a dog on his right shoulder, looking at the camera",
        },
        {
          id: 12,
          productId: 3,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575268/2023_TLC_Product_66-min_mg2nlw.jpg",
          alt: "Flat-lay image of TLC Beanie and woven tag",
        },
        {
          id: 13,
          productId: 4,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575177/2023_TLC_Product_01-min_cpqyxj.jpg",
          alt: "Front view of the TLC Trucker Hat on a white surface",
        },
        {
          id: 14,
          productId: 4,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575181/2023_TLC_Product_35-min_vmoxcl.jpg",
          alt: "Side profile of model wearing TLC Trucker Hat near a wall",
        },
        {
          id: 15,
          productId: 4,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575182/2023_TLC_Product_34-min_ppqg7v.jpg",
          alt: "TLC Trucker Hat laying on stone with greenery around",
        },
        {
          id: 16,
          productId: 4,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746578522/2023_TLC_Product_68_1_-min_ghrbco.jpg",
          alt: "Close-up of TLC Trucker Hat patch and stitching",
        },
        {
          id: 17,
          productId: 5,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575264/2023_TLC_Product_51-min_cq6hwq.jpg",
          alt: "Grey hoodie with woven TLC patch laid flat",
        },
        {
          id: 18,
          productId: 5,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575182/2023_TLC_Product_54-min_axuhfi.jpg",
          alt: "Model wearing grey TLC hoodie with arms folded",
        },
        {
          id: 19,
          productId: 5,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575182/2023_TLC_Product_53-min_hkj03h.jpg",
          alt: "Back of grey hoodie showing TLC patch clearly",
        },
        {
          id: 20,
          productId: 5,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746575267/2023_TLC_Product_64-min_dccjru.jpg",
          alt: "Grey TLC hoodie hanging with patch facing outward",
        },
        {
          id: 21,
          productId: 6,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746578901/2023_TLC_Product_25-min_d5dxnm.jpg",
          alt: "Model posing in charcoal grey TLC Printed Hoodie",
        },
        {
          id: 22,
          productId: 6,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746578901/2023_TLC_Product_26-min_o4hrwg.jpg",
          alt: "Side angle of model walking in TLC Printed Hoodie",
        },
        {
          id: 23,
          productId: 6,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746578902/2023_TLC_Product_58-min_rz9i3x.jpg",
          alt: "Charcoal grey TLC Hoodie laid flat with back logo visible",
        },
        {
          id: 24,
          productId: 6,
          image:
            "https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746577351/2023_TLC_Product_69-min_vgjwon.jpg",
          alt: "Model smiling and posing outside in charcoal TLC Printed Hoodie",
        },
      ],
    });

    const sizes = await prisma.size.createMany({
      data: [
        {
          id: 1,
          productId: createdProducts[0].id,
          size: "Xtra Small",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 2,
          productId: createdProducts[0].id,
          size: "Small",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 3,
          productId: createdProducts[0].id,
          size: "Medium",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 4,
          productId: createdProducts[0].id,
          size: "Large",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 5,
          productId: createdProducts[0].id,
          size: "Xtra Large",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 6,
          productId: createdProducts[1].id,
          size: "Small (3-6lbs)",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 7,
          productId: createdProducts[1].id,
          size: "Medium (6-10lbs)",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 8,
          productId: createdProducts[1].id,
          size: "Large (10-14lbs)",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 9,
          productId: createdProducts[1].id,
          size: "XLarge (14-20lbs)",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 10,
          productId: createdProducts[1].id,
          size: "XXX Large (25-35lbs)",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 11,
          productId: createdProducts[1].id,
          size: "5XL (45-60Lbs)",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 12,
          productId: createdProducts[2].id,
          size: "One Size Fits Most",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 13,
          productId: createdProducts[3].id,
          size: "Adjustable",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 14,
          productId: createdProducts[4].id,
          size: "Small",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 15,
          productId: createdProducts[4].id,
          size: "Medium",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 16,
          productId: createdProducts[4].id,
          size: "Large",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 17,
          productId: createdProducts[4].id,
          size: "Xtra Large",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 18,
          productId: createdProducts[5].id,
          size: "Small",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 19,
          productId: createdProducts[5].id,
          size: "Medium",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 20,
          productId: createdProducts[5].id,
          size: "Large",
          inventory: 1,
          status: "AVAILABLE",
        },
        {
          id: 21,
          productId: createdProducts[5].id,
          size: "Xtra Large",
          inventory: 1,
          status: "AVAILABLE",
        },
      ],
    });

    const prices = await prisma.prices.createMany({
      data: [
        { id: 1, productId: createdProducts[0].id, price: 20 },
        { id: 2, productId: createdProducts[1].id, price: 25 },
        { id: 3, productId: createdProducts[1].id, price: 35 },
        { id: 4, productId: createdProducts[2].id, price: 25 },
        { id: 5, productId: createdProducts[3].id, price: 20 },
        { id: 6, productId: createdProducts[4].id, price: 55 },
        { id: 7, productId: createdProducts[5].id, price: 55 },
      ],
    });

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error running seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error("Main seed error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
