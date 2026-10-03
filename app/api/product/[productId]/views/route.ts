import prisma from "@/lib/db";
import { Prisma } from "@/prisma/generated/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { toDay } from "@/lib/analytics";

type Context = { params: Promise<{ productId: string }> };

export async function POST(_req: NextRequest, { params }: Context) {
  const { productId } = await params;
  const date = new Date(toDay(new Date()));

  try {
    await prisma.productView.upsert({
      where: { productId_date: { productId, date } },
      create: { productId, date },
      update: { count: { increment: 1 } },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // P2003: the product is missing, so the new row's foreign key fails.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2003"
    ) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    console.error("Error while counting a product view: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
