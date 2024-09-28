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

  const body: { productId: string } = await request.json();

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: body.productId,
        userId: session.user.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: {
        id: body.productId,
      },
    });

    return NextResponse.json(
      { message: "Product deleted successfully", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error while deleting a product: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
