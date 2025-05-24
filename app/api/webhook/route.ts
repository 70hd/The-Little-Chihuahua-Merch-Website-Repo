import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const zapierUrl = process.env.ZAPIER_ORDER_WEBHOOK_URL;

const prisma = new PrismaClient();

// Correct buffer function for ReadableStream in App Router
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
    console.error("Missing Stripe signature or secret.");
    return new Response("Bad Request", { status: 400 });
  }

  // ✅ Make sure req.body is not null
  if (!req.body) {
    console.error("Request body is null.");
    return new Response("Empty body", { status: 400 });
  }

  let rawBody: Buffer;
  try {
    rawBody = await buffer(req.body);
  } catch (err) {
    console.error("Error buffering body:", err);
    return new Response("Invalid body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response("Signature error", { status: 400 });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = `ORD-${Date.now()}`;

      console.log("✅ Creating order:", {
        orderId,
        sessionId: intent.id,
        email: intent.receipt_email,
        amount: intent.amount,
      });

      await prisma.order.create({
        data: {
          orderId,
          sessionId: intent.id,
          email: intent.receipt_email || "no-email",
          amount: intent.amount || 0,
        },
      });

      if (zapierUrl) {
        await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            sessionId: intent.id,
            email: intent.receipt_email || "no-email",
            amount: intent.amount || 0,
          }),
        });
      }

      console.log("✅ Order created.");
    }
  } catch (err) {
    console.error("❌ Failed to store order:", err);
    return new Response("Database error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

  return new Response("Webhook received", { status: 200 });
}