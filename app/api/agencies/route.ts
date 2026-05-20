import { NextRequest, NextResponse } from "next/server";
import { createAgenciesRepository } from "../../../src/lib/repositories/agencies.repository";

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
    const repository = createAgenciesRepository();
    const filters = Object.fromEntries(request.nextUrl.searchParams.entries());
    const data = await repository.list(filters, contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "대리점 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const repository = createAgenciesRepository();
    const data = await repository.upsert(await request.json(), contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "대리점 저장 실패" }, { status: 500 });
  }
}
