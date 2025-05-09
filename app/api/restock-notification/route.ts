import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data: email, id: productId } = body;

    const restockNotification = await prisma.restockNotification.create({
      data: { email, productId },
    });

    return new Response(JSON.stringify(restockNotification), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Restock API Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create notification" }),
      { status: 500 }
    );
  }
}
