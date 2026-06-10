function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function customerEnvKey(customerId) {
  return `APPS_SCRIPT_API_URL_${String(customerId || "").toUpperCase().replace(/[^A-Z0-9_]/g, "_")}`;
}

function appsScriptUrlFor(req, body) {
  const customerId = req.headers["x-gloc-customer"] || body.customer_id || process.env.GLOC_CUSTOMER_ID || "default";
  return process.env[customerEnvKey(customerId)] || process.env.APPS_SCRIPT_API_URL || "";
}

module.exports = async function handler(req, res) {
  const startedAt = Date.now();
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-gloc-customer");
    return sendJson(res, 204, {});
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, error: "POST 요청만 지원합니다." });
  }

  const body = readBody(req);
  const action = body.action || "unknown";
  const appsScriptUrl = appsScriptUrlFor(req, body);
  if (!appsScriptUrl) {
    return sendJson(res, 500, { ok: false, error: "APPS_SCRIPT_API_URL 환경변수가 설정되지 않았습니다." });
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: body.action,
        token: body.token || "",
        payload: body.payload || {}
      })
    });

    const text = await response.text();
    const durationMs = Date.now() - startedAt;
    res.statusCode = response.status;
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Server-Timing", `apps-script;dur=${durationMs}`);
    console.info(JSON.stringify({
      type: "api_performance",
      endpoint: "/api/gloc",
      action,
      durationMs,
      source: "apps_script",
      status: response.status
    }));
    res.end(text);
  } catch (error) {
    console.error(JSON.stringify({
      type: "api_performance",
      endpoint: "/api/gloc",
      action,
      durationMs: Date.now() - startedAt,
      source: "apps_script",
      status: 502,
      error: error && error.message ? error.message : "unknown"
    }));
    return sendJson(res, 502, {
      ok: false,
      error: error && error.message ? error.message : "Apps Script API 호출에 실패했습니다."
    });
  }
};
