import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// Initialize Stripe & Prisma
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});
const prisma = new PrismaClient();

// Environment variables
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
const zapierOrderWebhookUrl = process.env.ZAPIER_ORDER_URL;

// Helper to read raw request body
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
  if (!stripeWebhookSecret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Missing Stripe secret", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing Stripe signature", { status: 400 });

  let rawBody: Buffer;
  try {
    rawBody = await buffer(req.body!);
  } catch {
    return new Response("Failed to read body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch (err) {
    console.error("❌ Invalid Stripe signature:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return new Response("Unhandled event", { status: 200 });
  }

  const intent = event.data.object as Stripe.PaymentIntent;

  // Parse order metadata
  let items: any[] = [];
  try {
    items = JSON.parse(intent.metadata.items || "[]");
  } catch {
    console.warn("⚠️ Invalid items JSON:", intent.metadata.items);
    return new Response("Invalid items JSON", { status: 400 });
  }

  const ship = intent.metadata.ship === "true";
  const orderData = {
    orderId: intent.metadata.orderId,
    email: intent.metadata.email || intent.receipt_email || "no-email",
    firstName: ship ? intent.metadata.firstName || null : null,
    lastName: ship ? intent.metadata.lastName || null : null,
    amount: (intent.amount || 0) / 100,
    sessionId: intent.id,
    ship,
    country: ship ? intent.metadata.country || null : null,
    state: ship ? intent.metadata.state || null : null,
    city: ship ? intent.metadata.city || null : null,
    address: ship ? intent.metadata.address || null : null,
    postalCode: ship ? intent.metadata.postalCode || null : null,
    unitDetails: ship ? intent.metadata.unitDetails || null : null,
    location: !ship ? intent.metadata.location || null : null,
    pickupTime: !ship ? intent.metadata.time || null : null,
  };

  const payload = {
    ...orderData,
    orderTotal: intent.metadata.orderTotal,
    taxes: intent.metadata.taxes,
    subtotal: intent.metadata.subtotal,
    shippingFee: intent.metadata.shippingFee,
    productsOrdered: items.map((item) => ({
      productName: item.title,
      quantity: item.quantity,
      price: item.price,
      selectedSize: item.size,
      color: item.color,
    })),
  };

  try {
    const createdOrder = await prisma.order.create({ data: orderData });

    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId: createdOrder.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.size,
        color: item.color,
      })),
    });

    // Log loaded URLs
    console.log("🧪 ZAPIER_WEBHOOK_URL:", zapierWebhookUrl);
    console.log("🧪 ZAPIER_ORDER_URL:", zapierOrderWebhookUrl);

    // Run webhooks in parallel
    await Promise.all([
      sendToZapier(zapierWebhookUrl, "Zapier Webhook 1", payload),
      sendToZapier(zapierOrderWebhookUrl, "Zapier Webhook 2", payload),
    ]);

  } catch (err) {
    console.error("❌ Failed to process order:", err);
    return new Response("Internal error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

  return new Response("✅ Order processed", { status: 200 });
}

async function sendToZapier(url: string | undefined, label: string, payload: object) {
  if (!url) {
    console.warn(`⚠️ ${label} not sent — URL undefined.`);
    return;
  }

  console.log(`📡 Sending to ${label}: ${url}`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log(`🔔 ${label} response (${res.status}): ${text}`);

    if (!res.ok) {
      console.error(`❌ ${label} failed:`, res.statusText);
    }
  } catch (err) {
    console.error(`❌ ${label} error:`, err);
  }
}