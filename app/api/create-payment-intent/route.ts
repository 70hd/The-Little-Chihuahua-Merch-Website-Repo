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
      // items,
    } = await request.json();

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        country: country || "",
        address: address || "",
        unitDetails: unitDetails || "",
        city: city || "",
        state: state || "",
        postalCode: postalCode || "",
        location: location || "",
        time: time || "",
        ship: typeof ship === "string" ? ship : JSON.stringify(ship),
        // items: typeof items === "string" ? items : JSON.stringify(items),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
