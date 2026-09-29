import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { updateProductSchema } from "@/schemas/new-product";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const { success, error, data } = updateProductSchema.safeParse(
    await req.json()
  );

  if (!success) {
    return NextResponse.json(
      { message: error.issues[0].message, success: false },
      { status: 400 }
    );
  }

  const { productId, name, title, message } = data;

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
