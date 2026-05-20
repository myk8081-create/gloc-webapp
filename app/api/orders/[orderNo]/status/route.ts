import { NextRequest, NextResponse } from "next/server";
import { createOrdersRepository } from "../../../../../src/lib/repositories/orders.repository";
import type { OrderStatus } from "../../../../../src/lib/providers";

export const dynamic = "force-dynamic";

function contextFrom(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return {
    token: authorization.replace(/^Bearer\s+/i, "") || request.headers.get("x-session-token") || "",
    customerId: request.headers.get("x-gloc-customer") || undefined
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderNo: string } }
) {
  try {
    const repository = createOrdersRepository();
    const body = await request.json();
    const data = await repository.updateStatus(
      {
        order_no: params.orderNo,
        status: body.status as OrderStatus,
        courier: body.courier,
        tracking_no: body.tracking_no,
        shipping_receipt_no: body.shipping_receipt_no
      },
      contextFrom(request)
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "상태 변경 실패" }, { status: 500 });
  }
}
