import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.comments) {
      return new Response(JSON.stringify({ error: "Name, email, and comments are required." }), { status: 400 });
    }

    const updateForm = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber || null,  // Optional, null if not provided
        selectLocation: body.selectLocation || null,
        comments: body.comments,
      },
    });
    const zapierUrl = process.env.ZAPIER_CONTACT_FORM_WEBHOOK_URL;

    if (!zapierUrl) {
      throw new Error("Zapier webhook URL is not defined");
    }
    const zapRes = await fetch(zapierUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        selectLocation: body.selectLocation,
        comments: body.comments,
      }),
    });
    
    console.log("Zapier response:", await zapRes.text());
    
    if (!zapRes.ok) {
      console.error("Zapier request failed:", zapRes.status);
    }

    return new Response(JSON.stringify(updateForm), { status: 200 });
  } catch (error) {
    console.error("Error submitting data:", error);
    return new Response(JSON.stringify({ error: "Couldn't submit data" }), { status: 500 });
  }
}