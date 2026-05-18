const webpush = require("web-push");

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

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-push-secret");
    return sendJson(res, 204, {});
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, error: "POST 요청만 지원합니다." });
  }

  const body = readBody(req);
  const expectedSecret = process.env.PUSH_API_SECRET || "";
  const receivedSecret = req.headers["x-push-secret"] || body.secret || "";
  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return sendJson(res, 401, { ok: false, error: "푸시 발송 권한이 없습니다." });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";
  if (!publicKey || !privateKey) {
    return sendJson(res, 500, { ok: false, error: "VAPID 키가 설정되지 않았습니다." });
  }

  const subscriptions = Array.isArray(body.subscriptions) ? body.subscriptions : [];
  if (!subscriptions.length) {
    return sendJson(res, 400, { ok: false, error: "발송할 구독 정보가 없습니다." });
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const notification = {
    title: body.notification?.title || "GLOC 발주 알림",
    body: body.notification?.body || "새 발주가 등록되었습니다.",
    url: body.notification?.url || "/index.html",
    tag: body.notification?.tag || "gloc-order"
  };

  const settled = await Promise.allSettled(
    subscriptions.map((subscription) => webpush.sendNotification(subscription, JSON.stringify(notification)))
  );

  const results = settled.map((result, index) => {
    if (result.status === "fulfilled") {
      return { index, ok: true };
    }
    const statusCode = result.reason?.statusCode || 0;
    return {
      index,
      ok: false,
      statusCode,
      expired: statusCode === 404 || statusCode === 410,
      error: result.reason?.body || result.reason?.message || "발송 실패"
    };
  });

  return sendJson(res, 200, {
    ok: true,
    sent: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    results
  });
};
