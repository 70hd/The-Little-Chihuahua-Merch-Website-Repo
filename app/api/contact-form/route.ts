import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.phoneNumber || !body.selectLocation || !body.comments) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const updateForm = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        selectLocation: body.selectLocation,
        comments: body.comments,
      },
    });

    return new Response(JSON.stringify(updateForm), { status: 200 });
  } catch (error) {
    console.error("Error submitting data:", error);
    return new Response(JSON.stringify({ error: "Couldn't submit data" }), { status: 500 });
  }
}