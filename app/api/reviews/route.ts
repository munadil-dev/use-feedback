import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { newReviewSchema } from "@/schemas/new-review";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { success, error, data } = newReviewSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { message: error.issues[0].message, success: false },
      { status: 400 }
    );
  }

  const { id, message, customerName, customerEmail, customerImage, rating } =
    data;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    await prisma.review.create({
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
      { message: "Review submitted", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error while creating a review: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
