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
    await prisma.feedback.update({
      where: {
        id: body.feedbackId,
      },
      data: {
        isFavorite: body.isFavorite,
      },
    });

    return NextResponse.json(
      {
        message: `${body.isFavorite ? MESSAGE.ADD : MESSAGE.REMOVE}`,
        success: true,
      },
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
