import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const body: { feedbackId: string } = await request.json();

  try {
    const { count } = await prisma.feedback.deleteMany({
      where: {
        id: body.feedbackId,
        product: { userId: session.user.id },
      },
    });

    if (count === 0) {
      return NextResponse.json(
        { message: "Feedback not found", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Feedback deleted successfully", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error while deleting feedback: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
