import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const zapierUrl = process.env.ZAPIER_ORDER_WEBHOOK_URL;
const zapierOrderConformationUrl =
  process.env.ZAPIER_ORDER_CONFORMATION_WEBHOOK_URL;
const prisma = new PrismaClient();

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
    console.error("❌ Missing Stripe signature or secret.");
    return new Response("Bad Request", { status: 400 });
  }

  if (!req.body) {
    console.error("❌ Request body is null.");
    return new Response("Empty body", { status: 400 });
  }

  let rawBody: Buffer;
  try {
    rawBody = await buffer(req.body);
  } catch (err) {
    console.error("❌ Error buffering body:", err);
    return new Response("Invalid body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response("Signature error", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = `ORD-${Date.now()}`;

    // Parse items JSON string from metadata (safe fallback to empty array)
    let items = [];
    try {
      items = JSON.parse(intent.metadata.items || "[]");
    } catch {
      console.warn("Failed to parse order items JSON.");
    }

    const orderData = {
      orderId,
      sessionId: intent.id,
      email: intent.receipt_email || "no-email",
      amount: (intent.amount || 0) / 100,
      ship:
        intent.metadata.ship === "true"
          ? true
          : intent.metadata.ship === "false"
          ? false
          : null,
      firstName:
        intent.metadata.ship === "true"
          ? intent.metadata.firstName || null
          : null,
      lastName:
        intent.metadata.ship === "true"
          ? intent.metadata.lastName || null
          : null,
      country:
        intent.metadata.ship === "true"
          ? intent.metadata.country || null
          : null,
      address:
        intent.metadata.ship === "true"
          ? intent.metadata.address || null
          : null,
      unitDetails:
        intent.metadata.ship === "true"
          ? intent.metadata.unitDetails || null
          : null,
      city:
        intent.metadata.ship === "true" ? intent.metadata.city || null : null,
      state:
        intent.metadata.ship === "true" ? intent.metadata.state || null : null,
      postalCode:
        intent.metadata.ship === "true"
          ? intent.metadata.postalCode || null
          : null,
      location:
        intent.metadata.ship !== "true"
          ? intent.metadata.location || null
          : null,
      pickupTime:
        intent.metadata.ship !== "true" ? intent.metadata.time || null : null,
    };

    try {
      // Create order along with order items in one transaction
 await prisma.order.create({
  data: {
    ...orderData,
    // OrderItem: {
    //   create: items.map((item: any) => ({
    //     productId: item.id,
    //     quantity: item.quantity,
    //     price: item.price * 100,
    //   })),
    // },
  },
});
      if (zapierUrl) {
        const res = await fetch(zapierUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (!res.ok) {
          console.error(`Zapier Order Webhook failed: ${res.statusText}`);
        }
      }

      if (zapierOrderConformationUrl) {
        const res = await fetch(zapierOrderConformationUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (!res.ok) {
          console.error(
            `Zapier Confirmation Webhook failed: ${res.statusText}`
          );
        }
      }
    } catch (err) {
      console.error("❌ Zapier webhook POST error:", err);
    } finally {
      await prisma.$disconnect();
      return new Response("Database error", { status: 500 });
    }
  }
  console.log("Webhook triggered:", event.type);
  return new Response("Webhook received", { status: 200 });
}
