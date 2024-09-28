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
    await prisma.feedback.delete({
      where: {
        id: body.feedbackId,
      },
    });

    return NextResponse.json(
      { message: "Feedback deleted successfully", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error while adding feedback as favorite: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
