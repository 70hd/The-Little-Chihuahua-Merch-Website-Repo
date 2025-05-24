import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const zapierUrl = process.env.ZAPIER_ORDER_WEBHOOK_URL;

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const signature = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !endpointSecret) {
    console.error("Missing Stripe signature or secret.");
    return new Response("Bad Request", { status: 400 });
  }

  let body: Buffer;
  try {
    body = await buffer(req.body as any);
  } catch (err) {
    console.error("Error reading Stripe body:", err);
    return new Response("Invalid body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${(err as any).message}`, { status: 400 });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;

      const orderId = `ORD-${Date.now()}`;
      console.log("Creating order from payment intent:", { orderId, sessionId: intent.id, email: intent.receipt_email, amount: intent.amount });

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
          body: JSON.stringify({ orderId, sessionId: intent.id, email: intent.receipt_email || "no-email", amount: intent.amount || 0 }),
        });
      } else {
        console.error("ZAPIER_ORDER_WEBHOOK_URL is not set.");
      }

      console.log("Order successfully created from payment intent.");
    }

    else if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = `ORD-${Date.now()}`;
      console.log("Creating order from checkout session:", { orderId, sessionId: session.id, email: session.customer_details?.email, amount: session.amount_total });

      await prisma.order.create({
        data: {
          orderId,
          sessionId: session.id,
          email: session.customer_details?.email || "no-email",
          amount: session.amount_total || 0,
        },
      });

      if (zapierUrl) {
        await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, sessionId: session.id, email: session.customer_details?.email || "no-email", amount: session.amount_total || 0 }),
        });
      } else {
        console.error("ZAPIER_ORDER_WEBHOOK_URL is not set.");
      }

      console.log("Order successfully created from checkout session.");
    }
  } catch (err) {
    console.error("Failed to store order:", err);
    return new Response(`Database Error: ${(err as any).message}`, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}