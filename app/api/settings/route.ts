import { NextRequest, NextResponse } from "next/server";
import { createSettingsRepository } from "../../../src/lib/repositories/settings.repository";

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
    const repository = createSettingsRepository();
    const key = request.nextUrl.searchParams.get("key");
    const data = key
      ? await repository.get(key, contextFrom(request))
      : await repository.list(contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "설정 조회 실패" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const repository = createSettingsRepository();
    const body = await request.json();
    const data = await repository.set(body.key, body.value, contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "설정 저장 실패" }, { status: 500 });
  }
}
