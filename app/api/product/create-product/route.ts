import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { newProductSchema, NewProductType } from "@/schemas/new-product";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const body: NewProductType = await req.json();
  const { success, error, data } = newProductSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { message: error.errors[0].message, success: false },
      { status: 400 }
    );
  }

  const { name, title, message } = data;

  try {
    await prisma.product.create({
      data: {
        name,
        title,
        message,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Product created", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error while creating a new product: ", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
