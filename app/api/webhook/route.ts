import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { Readable } from 'stream';
import { PickupContext } from "@/context/pickup-context";
import { useContext } from 'react';

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
  let body: Buffer;
  let signature = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const { location, time,ship } = useContext(PickupContext);

  try {
    if (!req.body || !signature || !endpointSecret) {
      console.error("Missing required parts of the request.");
      return new Response("Bad Request", { status: 400 });
    }

    body = await buffer(req.body as any);
  } catch (err) {
    console.error("Error buffering request body:", err);
    return new Response("Failed to read request body", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${(err as any).message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const orderId = `ORD-${Date.now()}`;

      if (ship) {
        console.log("Creating shipping order:", {
          orderId,
          sessionId: session.id,
          email: session.customer_email,
          amount: session.amount_total,
          ship: ship
        });

        await prisma.order.create({
          data: {
            orderId,
            sessionId: session.id,
            email: session.customer_email || "no-email",
            amount: session.amount_total || 0,
            ship: ship
          },
        });
      } else {
        console.log("Creating pickup order:", {
          orderId,
          sessionId: session.id,
          email: session.customer_email,
          amount: session.amount_total,
          location: location,
          pickupTime: time,
          ship: ship
        });

        await prisma.order.create({
          data: {
            orderId,
            sessionId: session.id,
            email: session.customer_email || "no-email",
            amount: session.amount_total || 0,
            location: location,
            pickupTime: time,
            ship: ship
          },
        });
      }
      try {
        if (!zapierUrl) {
          console.error("Missing ZAPIER_ORDER_WEBHOOK_URL environment variable.");
        } else {
          await fetch(zapierUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              sessionId: session.id,
              email: session.customer_email || "no-email",
              amount: session.amount_total || 0,
              ship: ship || null,
              location: location || null,
              pickupTime: time || null
            }),
          });
        }
      } catch (zapError) {
        console.error(`Failed to notify users for product`, zapError);
      }
      console.log("Order successfully created.");
    } catch (err) {
      console.error("Error storing order in database:", err);
      return new Response(`Database Error: ${(err as any).message}`, { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}