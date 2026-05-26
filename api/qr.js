const QRCode = require("qrcode");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "GET 요청만 지원합니다." }));
    return;
  }

  const data = String(req.query.data || "").trim();
  if (!data) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "QR 데이터가 없습니다." }));
    return;
  }

  try {
    const svg = await QRCode.toString(data, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(svg);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: error.message || "QR 생성에 실패했습니다." }));
  }
};
