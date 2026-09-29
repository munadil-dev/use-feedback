import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { newProductSchema } from "@/schemas/new-product";

type Context = { params: Promise<{ productId: string }> };

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const { productId } = await params;
  const body = await req.json().catch(() => null);
  const { success, error, data } = newProductSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { message: error.issues[0].message, success: false },
      { status: 400 }
    );
  }

  const { name, title, message } = data;

  try {
    const { count } = await prisma.product.updateMany({
      where: { id: productId, userId: session.user.id },
      data: { name, title, message },
    });

    if (count === 0) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product updated", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error while updating a product: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const { productId } = await params;

  try {
    const { count } = await prisma.product.deleteMany({
      where: { id: productId, userId: session.user.id },
    });

    if (count === 0) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error while deleting a product: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
