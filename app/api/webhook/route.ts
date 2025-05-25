import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const zapierUrl = process.env.ZAPIER_ORDER_WEBHOOK_URL;
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
  const signature = req.headers.get('stripe-signature');
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

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = `ORD-${Date.now()}`;
    console.log("PaymentIntent metadata:", intent.metadata);

    const orderData = {
      orderId,
      sessionId: intent.id,
      email: intent.receipt_email || "no-email",
      amount: intent.amount || 0,
      firstName: intent.metadata.firstName || null,
      lastName: intent.metadata.lastName || null,
      country: intent.metadata.country || null,
      address: intent.metadata.address || null,
      unitDetails: intent.metadata.unitDetails || null,
      city: intent.metadata.city || null,
      state: intent.metadata.state || null,
      postalCode: intent.metadata.postalCode || null,
      location: intent.metadata.location || null,
      pickupTime: intent.metadata.time || null,
      ship: intent.metadata.ship === "true" ? true : intent.metadata.ship === "false" ? false : null,
    };

    try {
      console.log("✅ Creating order:", orderData);
      await prisma.order.create({ data: orderData });

      if (zapierUrl) {
        await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
      }

      console.log("✅ Order stored and webhook sent to Zapier.");
    } catch (err) {
      console.error("❌ Failed to store order:", err);
      return new Response("Database error", { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  console.log("Webhook triggered:", event.type);
  return new Response("Webhook received", { status: 200 });
}