import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ feedbackId: string }> };

const MESSAGE = {
  ADD: "Added to favorite",
  REMOVE: "Removed from favorite",
};

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const { feedbackId } = await params;
  const body = await req.json().catch(() => null);

  if (typeof body?.isFavorite !== "boolean") {
    return NextResponse.json(
      { message: "isFavorite must be a boolean", success: false },
      { status: 400 }
    );
  }

  try {
    const { count } = await prisma.feedback.updateMany({
      where: {
        id: feedbackId,
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

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const { feedbackId } = await params;

  try {
    const { count } = await prisma.feedback.deleteMany({
      where: {
        id: feedbackId,
        product: { userId: session.user.id },
      },
    });

    if (count === 0) {
      return NextResponse.json(
        { message: "Feedback not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Feedback deleted successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while deleting feedback: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
