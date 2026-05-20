import { NextRequest, NextResponse } from "next/server";
import { createOrdersRepository } from "../../../src/lib/repositories/orders.repository";

export const dynamic = "force-dynamic";

function contextFrom(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return {
    token: authorization.replace(/^Bearer\s+/i, "") || request.headers.get("x-session-token") || "",
    customerId: request.headers.get("x-gloc-customer") || undefined
  };
}

export async function GET(request: NextRequest) {
  try {
    const repository = createOrdersRepository();
    const filters = Object.fromEntries(request.nextUrl.searchParams.entries());
    const data = await repository.list(filters, contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "발주 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const repository = createOrdersRepository();
    const body = await request.json();
    const data = await repository.create(body, contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "발주 등록 실패" }, { status: 500 });
  }
}
