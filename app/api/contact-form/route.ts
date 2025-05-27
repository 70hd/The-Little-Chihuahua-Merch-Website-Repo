import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional().nullable(),
  selectLocation: z.string().optional().nullable(),
  comments: z.string().min(1, "Comments are required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ errors: parsed.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const { name, email, phoneNumber, selectLocation, comments } = parsed.data;

    const updateForm = await prisma.contact.create({
      data: {
        name,
        email,
        phoneNumber,
        selectLocation,
        comments,
      },
    });

    const googleSheetsUrl = process.env.GOOGLE_SHEETS_CONTACT_FORM_WEBHOOK_URL;

    if (!googleSheetsUrl) {
      throw new Error("Google Sheets webhook URL is not defined");
    }

    // const zapRes = await fetch(googleSheetsUrl, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email, phoneNumber, selectLocation, comments }),
    // });
       const zapRes = await fetch(googleSheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email,selectLocation, comments, phoneNumber }),
    });

    if (!zapRes.ok) {
      console.error("Google Sheets request failed:", zapRes.status);
    }

    return new Response(JSON.stringify(updateForm), { status: 200 });
  } catch (error) {
    console.error("Error submitting data:", error);
    return new Response(JSON.stringify({ error: "Couldn't submit data" }), {
      status: 500,
    });
  }
}