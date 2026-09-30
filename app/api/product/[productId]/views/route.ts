import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { toDay } from "@/lib/analytics";

type Context = { params: Promise<{ productId: string }> };

export async function POST(_req: NextRequest, { params }: Context) {
  const { productId } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    const date = new Date(toDay(new Date()));

    await prisma.productView.upsert({
      where: { productId_date: { productId, date } },
      create: { productId, date },
      update: { count: { increment: 1 } },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error while counting a product view: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
