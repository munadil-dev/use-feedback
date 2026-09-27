import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

interface BodyProps {
  feedbackId: string;
  isFavorite: boolean;
}

const MESSAGE = {
  ADD: "Added to favorite",
  REMOVE: "Removed from favorite",
};

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const body: BodyProps = await request.json();

  try {
    const { count } = await prisma.feedback.updateMany({
      where: {
        id: body.feedbackId,
        product: { userId: session.user.id },
      },
      data: {
        isFavorite: body.isFavorite,
      },
    });

    if (count === 0) {
      return NextResponse.json(
        { message: "Feedback not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `${body.isFavorite ? MESSAGE.ADD : MESSAGE.REMOVE}`,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while adding feedback as favorite: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
