import { NextRequest, NextResponse } from "next/server";
import { createOrdersRepository } from "../../../../../src/lib/repositories/orders.repository";

export const dynamic = "force-dynamic";

function contextFrom(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return {
    token: authorization.replace(/^Bearer\s+/i, "") || request.headers.get("x-session-token") || "",
    customerId: request.headers.get("x-gloc-customer") || undefined
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderNo: string } }
) {
  try {
    const repository = createOrdersRepository();
    const body = await request.json().catch(() => ({}));
    const data = await repository.markPrinted(
      {
        order_no: params.orderNo,
        print_status: body.print_status === "failed" ? "failed" : "printed",
        label_size: body.label_size || ""
      },
      contextFrom(request)
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "송장 출력 기록 저장 실패" }, { status: 500 });
  }
}
