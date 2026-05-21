export type LabelSize = "post-overlay-150x100";

export interface ShippingLabelOrder {
  order_no: string;
  courier: string;
  tracking_no: string;
  shipping_receipt_no?: string;
  agency_name: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_zipcode?: string;
  recipient_address: string;
  recipient_address_detail?: string;
  product_name: string;
  quantity: number;
  weight?: string;
  fee?: string;
  memo?: string;
  shipping_memo?: string;
  promotion_text?: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
}

export interface PdfLabelOptions {
  labelSize: LabelSize;
  testMode?: boolean;
}

export interface PdfLabelDocument {
  mimeType: "text/html";
  html: string;
}

export const KOREA_POST_OVERLAY = {
  PAGE_WIDTH_MM: 150,
  PAGE_HEIGHT_MM: 100,
  OFFSET_X_MM: 0,
  OFFSET_Y_MM: 0,
  SCALE: 1,
  PRINT_ROTATION_DEG: 180,
  CUSTOMER_ORDER_X_MM: 7,
  CUSTOMER_ORDER_Y_MM: 15,
  CUSTOMER_ORDER_WIDTH_MM: 61,
  PAYMENT_X_MM: 36,
  PAYMENT_Y_MM: 25,
  BARCODE_X_MM: 7,
  BARCODE_Y_MM: 39,
  BARCODE_WIDTH_MM: 49,
  BARCODE_HEIGHT_MM: 17,
  MESSAGE_X_MM: 7,
  MESSAGE_Y_MM: 60,
  MESSAGE_WIDTH_MM: 62,
  CONTENT_X_MM: 7,
  CONTENT_Y_MM: 71,
  CONTENT_WIDTH_MM: 63,
  PROMO_X_MM: 24,
  PROMO_Y_MM: 88,
  PROMO_WIDTH_MM: 43,
  SENDER_X_MM: 78,
  SENDER_Y_MM: 27,
  SENDER_WIDTH_MM: 62,
  RECIPIENT_X_MM: 78,
  RECIPIENT_Y_MM: 36,
  RECIPIENT_WIDTH_MM: 61,
  RECIPIENT_BARCODE_X_MM: 118,
  RECIPIENT_BARCODE_Y_MM: 35,
  RECIPIENT_BARCODE_WIDTH_MM: 19,
  RECIPIENT_BARCODE_HEIGHT_MM: 22,
  REGISTRATION_X_MM: 91,
  REGISTRATION_Y_MM: 76,
  REGISTRATION_WIDTH_MM: 50,
  BOTTOM_BARCODE_X_MM: 89,
  BOTTOM_BARCODE_Y_MM: 82,
  BOTTOM_BARCODE_WIDTH_MM: 49,
  BOTTOM_BARCODE_HEIGHT_MM: 12,
  WATERMARK_X_MM: 75,
  WATERMARK_Y_MM: 50
} as const;

export function createPdfLabelDocument(order: ShippingLabelOrder, options: PdfLabelOptions): PdfLabelDocument {
  const watermark = options.testMode === false ? "" : '<div class="test-watermark">TEST / 실제 접수 아님</div>';
  const registrationNo = order.shipping_receipt_no || order.tracking_no || order.order_no;
  const paymentMethod = /선불|prepaid/i.test(order.fee || "") ? "선불" : "착불";
  const deliveryMessage = order.shipping_memo || order.memo || "배송 전 연락 바랍니다.";
  const promo = order.promotion_text || "";

  return {
    mimeType: "text/html",
    html: [
      "<!doctype html>",
      '<html lang="ko">',
      "<head>",
      '<meta charset="UTF-8" />',
      `<title>송장출력 ${escapeHtml(order.tracking_no)}</title>`,
      "<style>",
      "@page{size:150mm 100mm;margin:0}",
      "html,body{margin:0;width:150mm;height:100mm;background:transparent;color:#000;font-family:Arial,'Noto Sans KR','Apple SD Gothic Neo',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}",
      `.label-overlay{position:relative;width:150mm;height:100mm;overflow:hidden;background:transparent;color:#000;transform:rotate(${KOREA_POST_OVERLAY.PRINT_ROTATION_DEG}deg);transform-origin:center center}`,
      ".field,.barcode-slot,.test-watermark{position:absolute;color:#000}",
      ".field{font-size:3.1mm;font-weight:700;line-height:1.18;white-space:normal;overflow-wrap:anywhere;word-break:keep-all}",
      ".field-small{font-size:2.45mm;line-height:1.2}",
      `.customer-order{left:${x(KOREA_POST_OVERLAY.CUSTOMER_ORDER_X_MM)};top:${y(KOREA_POST_OVERLAY.CUSTOMER_ORDER_Y_MM)};width:${s(KOREA_POST_OVERLAY.CUSTOMER_ORDER_WIDTH_MM)}}`,
      `.payment-method{left:${x(KOREA_POST_OVERLAY.PAYMENT_X_MM)};top:${y(KOREA_POST_OVERLAY.PAYMENT_Y_MM)};width:25mm;text-align:center;font-size:6.2mm;font-weight:900;line-height:1}`,
      `.main-barcode{left:${x(KOREA_POST_OVERLAY.BARCODE_X_MM)};top:${y(KOREA_POST_OVERLAY.BARCODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.BARCODE_WIDTH_MM)};height:${s(KOREA_POST_OVERLAY.BARCODE_HEIGHT_MM)}}`,
      `.delivery-message{left:${x(KOREA_POST_OVERLAY.MESSAGE_X_MM)};top:${y(KOREA_POST_OVERLAY.MESSAGE_Y_MM)};width:${s(KOREA_POST_OVERLAY.MESSAGE_WIDTH_MM)}}`,
      `.content-name{left:${x(KOREA_POST_OVERLAY.CONTENT_X_MM)};top:${y(KOREA_POST_OVERLAY.CONTENT_Y_MM)};width:${s(KOREA_POST_OVERLAY.CONTENT_WIDTH_MM)}}`,
      `.promo{left:${x(KOREA_POST_OVERLAY.PROMO_X_MM)};top:${y(KOREA_POST_OVERLAY.PROMO_Y_MM)};width:${s(KOREA_POST_OVERLAY.PROMO_WIDTH_MM)};text-align:center}`,
      `.sender{left:${x(KOREA_POST_OVERLAY.SENDER_X_MM)};top:${y(KOREA_POST_OVERLAY.SENDER_Y_MM)};width:${s(KOREA_POST_OVERLAY.SENDER_WIDTH_MM)}}`,
      `.recipient{left:${x(KOREA_POST_OVERLAY.RECIPIENT_X_MM)};top:${y(KOREA_POST_OVERLAY.RECIPIENT_Y_MM)};width:${s(KOREA_POST_OVERLAY.RECIPIENT_WIDTH_MM)}}`,
      `.recipient-barcode{left:${x(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_X_MM)};top:${y(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_WIDTH_MM)};height:${s(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_HEIGHT_MM)}}`,
      `.registration{left:${x(KOREA_POST_OVERLAY.REGISTRATION_X_MM)};top:${y(KOREA_POST_OVERLAY.REGISTRATION_Y_MM)};width:${s(KOREA_POST_OVERLAY.REGISTRATION_WIDTH_MM)}}`,
      `.bottom-barcode{left:${x(KOREA_POST_OVERLAY.BOTTOM_BARCODE_X_MM)};top:${y(KOREA_POST_OVERLAY.BOTTOM_BARCODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.BOTTOM_BARCODE_WIDTH_MM)};height:${s(KOREA_POST_OVERLAY.BOTTOM_BARCODE_HEIGHT_MM)}}`,
      ".barcode-slot svg{display:block;width:100%;height:100%;fill:#000;shape-rendering:crispEdges}",
      ".sender-name{display:block;font-size:5.2mm;font-weight:900;line-height:1}",
      ".recipient-name{display:block;margin:1.4mm 0 1mm;font-size:6.8mm;font-weight:900;line-height:1}",
      ".address-line{display:block;margin-top:1.1mm}",
      `.test-watermark{left:${x(KOREA_POST_OVERLAY.WATERMARK_X_MM)};top:${y(KOREA_POST_OVERLAY.WATERMARK_Y_MM)};transform:translate(-50%,-50%) rotate(-20deg);color:rgba(0,0,0,.12);font-size:9mm;font-weight:700;white-space:nowrap}`,
      "</style>",
      "</head>",
      "<body>",
      '<main class="label-overlay">',
      watermark,
      `<div class="field field-small customer-order"><span class="address-line">접수일: ${escapeHtml(datePart())}</span><span class="address-line">주문: ${escapeHtml(order.order_no)}</span><span class="address-line">고객: ${escapeHtml(order.agency_name)}</span></div>`,
      `<div class="field payment-method">${escapeHtml(paymentMethod)}</div>`,
      `<div class="barcode-slot main-barcode">${code39BarcodeSvg(registrationNo)}</div>`,
      `<div class="field field-small delivery-message">배송메시지: ${escapeHtml(deliveryMessage)}</div>`,
      `<div class="field field-small content-name">내용품명: ${escapeHtml(order.product_name || "필름 제품")}</div>`,
      promo ? `<div class="field field-small promo">${escapeHtml(promo)}</div>` : "",
      `<div class="field field-small sender"><strong class="sender-name">${escapeHtml(order.sender_name)}</strong><span class="address-line">${escapeHtml(order.sender_address)}</span><span class="address-line">T: ${escapeHtml(order.sender_phone)}</span></div>`,
      `<div class="field recipient"><strong class="recipient-name">${escapeHtml(order.recipient_name || order.agency_name)}</strong><span class="address-line">T: ${escapeHtml(order.recipient_phone)}</span><span class="address-line">${escapeHtml(order.recipient_zipcode || "")}</span><span class="address-line">${escapeHtml(order.recipient_address)}</span>${order.recipient_address_detail ? `<span class="address-line">${escapeHtml(order.recipient_address_detail)}</span>` : ""}</div>`,
      `<div class="barcode-slot recipient-barcode">${code39BarcodeSvg(order.tracking_no.slice(-10) || order.tracking_no)}</div>`,
      `<div class="field field-small registration"><span class="address-line">등기번호: ${escapeHtml(registrationNo)}</span><span class="address-line">수량: ${Number(order.quantity || 0).toLocaleString("ko-KR")}롤</span></div>`,
      `<div class="barcode-slot bottom-barcode">${code39BarcodeSvg(registrationNo)}</div>`,
      "</main>",
      "</body>",
      "</html>"
    ].join("")
  };
}

function x(value: number) {
  return mm(KOREA_POST_OVERLAY.OFFSET_X_MM + value * KOREA_POST_OVERLAY.SCALE);
}

function y(value: number) {
  return mm(KOREA_POST_OVERLAY.OFFSET_Y_MM + value * KOREA_POST_OVERLAY.SCALE);
}

function s(value: number) {
  return mm(value * KOREA_POST_OVERLAY.SCALE);
}

function mm(value: number) {
  return `${value.toFixed(2)}mm`;
}

function datePart() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", ".");
}

function code39BarcodeSvg(value: string) {
  const patterns: Record<string, string> = {
    "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
    "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
    A: "wnnnnwnnw", B: "nnwnnwnnw", C: "wnwnnwnnn", D: "nnnnwwnnw", E: "wnnnwwnnn",
    F: "nnwnwwnnn", G: "nnnnnwwnw", H: "wnnnnwwnn", I: "nnwnnwwnn", J: "nnnnwwwnn",
    K: "wnnnnnnww", L: "nnwnnnnww", M: "wnwnnnnwn", N: "nnnnwnnww", O: "wnnnwnnwn",
    P: "nnwnwnnwn", Q: "nnnnnnwww", R: "wnnnnnwwn", S: "nnwnnnwwn", T: "nnnnwnwwn",
    U: "wwnnnnnnw", V: "nwwnnnnnw", W: "wwwnnnnnn", X: "nwnnwnnnw", Y: "wwnnwnnnn",
    Z: "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
    "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn"
  };
  const encoded = `*${String(value || "").toUpperCase().replace(/[^0-9A-Z .$/+%-]/g, "")}*`;
  const narrow = 2;
  const wide = 5;
  const height = 80;
  let cursor = 0;
  const rects: string[] = [];

  encoded.split("").forEach((char) => {
    const pattern = patterns[char] || patterns["-"];
    pattern.split("").forEach((unit, index) => {
      const width = unit === "w" ? wide : narrow;
      if (index % 2 === 0) rects.push(`<rect x="${cursor}" y="0" width="${width}" height="${height}" />`);
      cursor += width;
    });
    cursor += narrow;
  });

  return `<svg viewBox="0 0 ${cursor} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="송장번호 바코드" fill="#000" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
