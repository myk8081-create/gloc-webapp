import { NextRequest, NextResponse } from "next/server";
import { createDataProvider } from "../../../src/lib/providers";

export const dynamic = "force-dynamic";

function contextFrom(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return {
    token: authorization.replace(/^Bearer\s+/i, "") || request.headers.get("x-session-token") || "",
    customerId: request.headers.get("x-gloc-customer") || undefined
  };
}

export async function POST(request: NextRequest) {
  try {
    const provider = createDataProvider();
    if (!provider.ensureSchema) {
      throw new Error("현재 provider는 시트 구조 생성을 지원하지 않습니다.");
    }
    const data = await provider.ensureSchema(contextFrom(request));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "시트 구조 생성 실패" }, { status: 500 });
  }
}
