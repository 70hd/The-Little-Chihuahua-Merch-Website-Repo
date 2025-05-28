import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Utility: groups items with same productId + size
function groupCartItems(cartItems: any[]) {
  const map = new Map<string, { productId: number; size: string; quantity: number }>();

  for (const item of cartItems) {
    const key = `${item.id}-${item.size}`;
    if (map.has(key)) {
      map.get(key)!.quantity += item.quantity;
    } else {
      map.set(key, {
        productId: Number(item.id),
        size: item.size,
        quantity: item.quantity,
      });
    }
  }

  return Array.from(map.values());
}

export async function PUT(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    if (!Array.isArray(cartItems)) {
      return NextResponse.json({ error: "Invalid cart data." }, { status: 400 });
    }

    const groupedItems = groupCartItems(cartItems);

    await prisma.$transaction(async (tx) => {
      for (const item of groupedItems) {
        // Fetch current inventory for the size
        const sizeRecord = await tx.size.findFirst({
          where: {
            productId: item.productId,
            size: item.size,
          },
        });

        if (!sizeRecord) {
          throw new Error(`Size not found for product ${item.productId}, size ${item.size}`);
        }

        if (sizeRecord.inventory < item.quantity) {
          throw new Error(`Insufficient inventory for product ${item.productId}, size ${item.size}`);
        }

        // Decrement inventory for size
        await tx.size.update({
          where: {
            id: sizeRecord.id,
          },
          data: {
            inventory: {
              decrement: item.quantity/2,
            },
          },
        });

        // Decrement total inventory for product
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    return NextResponse.json({ message: "Inventory updated successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Inventory update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update inventory." },
      { status: 500 }
    );
  }
}