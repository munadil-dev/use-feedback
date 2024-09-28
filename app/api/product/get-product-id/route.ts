import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated", success: false },
      { status: 401 }
    );
  }

  const body: { name: string } = await req.json();

  try {
    const product = await prisma.product.findFirst({
      where: {
        name: body.name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { id: product?.id, message: "Product id retrieved", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error while retrieving product id: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
