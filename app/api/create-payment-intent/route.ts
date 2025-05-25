import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: NextRequest) {
  try {
const {
  location,
  time,
  ship,
  amount,
  email,
  firstName,
  lastName,
  country,
  address,
  unitDetails,
  city,
  state,
  postalCode,
  items // 👈 add this
} = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        email,
        firstName,
        lastName,
        country,
        address,
        unitDetails,
        city,
        state,
        postalCode,
        location,
        time,
        ship,
        items: JSON.stringify(items)
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
