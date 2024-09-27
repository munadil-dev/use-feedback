import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { newFeedbackSchema, FeedbackType } from "@/schemas/new-feedback";

export async function POST(req: NextRequest) {
  const body: FeedbackType = await req.json();
  const { success, error, data } = newFeedbackSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { message: error.errors[0].message, success: false },
      { status: 400 }
    );
  }

  const { id, message, customerName, customerEmail, customerImage, rating } =
    data;

  try {
    await prisma.feedback.create({
      data: {
        message,
        customerName,
        customerEmail,
        customerImage,
        rating,
        product: {
          connect: {
            id,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Feedback submitted", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error while creating a feedback: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
