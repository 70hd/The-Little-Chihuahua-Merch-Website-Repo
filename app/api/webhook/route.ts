import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});
const prisma = new PrismaClient();

const googleSheetsOrderWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

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
    if (!req.body) {
      return new Response("Empty request body", { status: 400 });
    }

    rawBody = await buffer(req.body);
  } catch {
    return new Response("Failed to read request body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch {
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
    console.warn("Failed to parse items JSON");
  }

  const ship = intent.metadata.ship === "true";
  const orderData = {
    orderId,
    email: intent.receipt_email || "no-email",
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
  };

  try {
    // Save to database
    await prisma.order.create({
      data: {
        ...orderData,
        OrderItem: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            id: item.id,
            selectedSize: item.size,
            color: item.color,
          })),
        },
      },
    });

    // ✅ Send as a single object with `products` array to Google Sheets webhook
    if (googleSheetsOrderWebhookUrl) {
      const payload = {
        ...orderData,
        products: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.size,
          color: item.color,
        })),
      };

      const res = await fetch(googleSheetsOrderWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Google Sheets webhook failed:", res.statusText);
      }
    }
  } catch (err) {
    console.error("❌ Error handling order:", err);
    return new Response("Internal error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

  return new Response("Order processed", { status: 200 });
}