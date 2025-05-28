import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});
const prisma = new PrismaClient();
const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;

async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !endpointSecret) {
    return new Response("Missing Stripe signature or secret", { status: 400 });
  }

  let rawBody: Buffer;
  try {
    if (!req.body) return new Response("Empty request body", { status: 400 });
    rawBody = await buffer(req.body);
  } catch {
    return new Response("Failed to read request body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Invalid Stripe signature:", err);
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return new Response("Event not handled", { status: 200 });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const orderId = `ORD-${Date.now()}`;

  let items: any[] = [];
  try {
    items = JSON.parse(intent.metadata.items || "[]");
  } catch {
    console.warn("⚠️ Failed to parse items JSON:", intent.metadata.items);
    return new Response("Invalid items format", { status: 400 });
  }

  const ship = intent.metadata.ship === "true";
  const orderData = {
    orderId,
    email: intent.metadata.email || intent.receipt_email || "no-email",
    firstName: ship ? intent.metadata.firstName || null : null,
    lastName: ship ? intent.metadata.lastName || null : null,
    amount: (intent.amount || 0) / 100,
    sessionId: intent.id,
    ship: ship ? true : intent.metadata.ship === "false" ? false : null,
    country: ship ? intent.metadata.country || null : null,
    state: ship ? intent.metadata.state || null : null,
    city: ship ? intent.metadata.city || null : null,
    address: ship ? intent.metadata.address || null : null,
    postalCode: ship ? intent.metadata.postalCode || null : null,
    unitDetails: ship ? intent.metadata.unitDetails || null : null,
    location: !ship ? intent.metadata.location || null : null,
    pickupTime: !ship ? intent.metadata.time || null : null,
    orderTotal: intent.metadata.orderTotal,
    taxes: intent.metadata.taxes,
    subtotal: intent.metadata.subtotal,
    shippingFee: intent.metadata.shippingFee,
  };

  try {
    // Step 1: Create the order
    const createdOrder = await prisma.order.create({
      data: orderData,
    });

    // Step 2: Create order items (with foreign key to order)
    // await prisma.orderItem.createMany({
    //   data: items.map((item) => ({
    //     orderId: createdOrder.id,
    //     productId: item.id,
    //     quantity: item.quantity,
    //     price: item.price,
    //     selectedSize: item.size,
    //     color: item.color,
    //   })),
    // });

    // Step 3: Notify Zapier
    if (zapierWebhookUrl) {
      const payload = {
        ...orderData,
        productsOrdered: items.map((item) => ({
          productName: item.title,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.size,
          color: item.color,
        })),
      };

      try {
        const res = await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const responseText = await res.text();
        console.log("🔔 Zapier response:", res.status, responseText);

        if (!res.ok) {
          console.error("❌ Zapier webhook failed:", res.statusText);
        }
      } catch (zapierError) {
        console.error("❌ Failed to send to Zapier:", zapierError);
      }
    }
  } catch (err: any) {
    console.error("❌ Error handling order:", err);
    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    }
    return new Response("Internal error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

  return new Response("✅ Order processed", { status: 200 });
}