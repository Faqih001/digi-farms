import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { include: { supplier: { select: { companyName: true } } } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { productId, quantity, deliveryAddress } = body;

  if (!productId || !quantity || !deliveryAddress) {
    return NextResponse.json({ error: "productId, quantity, and deliveryAddress are required" }, { status: 400 });
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not found or unavailable" }, { status: 404 });
  }

  if (product.stock !== null && product.stock < quantity) {
    return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
  }

  const order = await db.order.create({
    data: {
      totalAmount: product.price * quantity,
      shippingAddress: deliveryAddress,
      userId: session.user.id,
      status: "PENDING",
      items: {
        create: {
          productId,
          quantity,
          price: product.price,
        },
      },
    },
  });

  return NextResponse.json(order, { status: 201 });
}
