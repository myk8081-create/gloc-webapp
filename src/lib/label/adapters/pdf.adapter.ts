import { KOREA_POST_LABEL_LAYOUT } from "../koreaPostLabelLayout";

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
  sku?: string;
  quantity: number;
  weight?: string;
  shipping_weight?: string;
  volume?: string;
  shipping_volume?: string;
  fee?: string;
  shipping_fee?: string;
  memo?: string;
  shipping_memo?: string;
  region_code?: string;
  zone_code?: string;
  label_region_code?: string;
  sort_code?: string;
  classification_code?: string;
  label_sort_code?: string;
  bottom_code?: string;
  routing_code?: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  created_at?: string;
}

export interface PdfLabelOptions {
  labelSize: LabelSize;
  testMode?: boolean;
  privacyMasking?: boolean;
}

export interface PdfLabelDocument {
  mimeType: "text/html";
  html: string;
}

export const KOREA_POST_OVERLAY = KOREA_POST_LABEL_LAYOUT;

export function createPdfLabelDocument(order: ShippingLabelOrder, options: PdfLabelOptions): PdfLabelDocument {
  const privacyMasking = options.privacyMasking ?? true;
  const watermark = options.testMode === false ? "" : '<div class="test-watermark">TEST / 실제 접수 아님</div>';
  const registrationNo = order.shipping_receipt_no || order.tracking_no || order.order_no;
  const paymentMethod = /선불|prepaid/i.test(order.shipping_fee || order.fee || "") ? "선불" : "착불";
  const deliveryMessage = order.shipping_memo || order.memo || "배송 전 연락 바랍니다.";
  const recipientName = maskName(order.recipient_name || order.agency_name, privacyMasking);
  const recipientPhone = maskPhone(order.recipient_phone, privacyMasking);
  const recipientAddressDetail = maskAddressDetail(order.recipient_address_detail, privacyMasking);
  const senderName = maskName(order.sender_name, privacyMasking);
  const senderPhone = maskPhone(order.sender_phone, privacyMasking);
  const productInfo = [order.product_name, order.sku, `${Number(order.quantity || 0).toLocaleString("ko-KR")}롤`]
    .filter(Boolean)
    .join(" / ");

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
      "html,body{margin:0;width:150mm;height:100mm;background:transparent;color:#000;font-family:Arial,'Noto Sans KR','Apple SD Gothic Neo',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;text-rendering:geometricPrecision}",
      `.label-overlay{position:relative;width:150mm;height:100mm;overflow:hidden;background:transparent;color:#000;transform:rotate(${KOREA_POST_OVERLAY.PRINT_ROTATION_DEG}deg);transform-origin:center center}`,
      ".field,.barcode-slot,.test-watermark{position:absolute;color:#000}",
      ".field{font-size:3mm;font-weight:700;line-height:1.16;letter-spacing:0;white-space:normal;overflow-wrap:anywhere;word-break:keep-all}",
      ".field-small{font-size:2.45mm;font-weight:700;line-height:1.2}",
      ".field-tiny{font-size:2.15mm;font-weight:700;line-height:1.2}",
      `.region-code{left:${x(KOREA_POST_OVERLAY.REGION_CODE_X_MM)};top:${y(KOREA_POST_OVERLAY.REGION_CODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.REGION_CODE_WIDTH_MM)};text-align:center;font-size:14mm;font-weight:900;line-height:.9}`,
      `.sort-code{left:${x(KOREA_POST_OVERLAY.SORT_CODE_X_MM)};top:${y(KOREA_POST_OVERLAY.SORT_CODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.SORT_CODE_WIDTH_MM)};text-align:center;font-size:9mm;font-weight:900;line-height:1}`,
      `.customer-order{left:${x(KOREA_POST_OVERLAY.CUSTOMER_ORDER_X_MM)};top:${y(KOREA_POST_OVERLAY.CUSTOMER_ORDER_Y_MM)};width:${s(KOREA_POST_OVERLAY.CUSTOMER_ORDER_WIDTH_MM)}}`,
      `.payment-method{left:${x(KOREA_POST_OVERLAY.PAYMENT_X_MM)};top:${y(KOREA_POST_OVERLAY.PAYMENT_Y_MM)};width:18mm;text-align:center;font-size:6mm;font-weight:900;line-height:1}`,
      `.weight{left:${x(KOREA_POST_OVERLAY.WEIGHT_X_MM)};top:${y(KOREA_POST_OVERLAY.WEIGHT_Y_MM)};width:18mm}`,
      `.volume{left:${x(KOREA_POST_OVERLAY.VOLUME_X_MM)};top:${y(KOREA_POST_OVERLAY.VOLUME_Y_MM)};width:18mm}`,
      `.fee{left:${x(KOREA_POST_OVERLAY.FEE_X_MM)};top:${y(KOREA_POST_OVERLAY.FEE_Y_MM)};width:20mm}`,
      `.main-barcode{left:${x(KOREA_POST_OVERLAY.BARCODE_X_MM)};top:${y(KOREA_POST_OVERLAY.BARCODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.BARCODE_WIDTH_MM)};height:${s(KOREA_POST_OVERLAY.BARCODE_HEIGHT_MM)}}`,
      `.delivery-message{left:${x(KOREA_POST_OVERLAY.MESSAGE_X_MM)};top:${y(KOREA_POST_OVERLAY.MESSAGE_Y_MM)};width:${s(KOREA_POST_OVERLAY.MESSAGE_WIDTH_MM)}}`,
      `.content-name{left:${x(KOREA_POST_OVERLAY.CONTENT_X_MM)};top:${y(KOREA_POST_OVERLAY.CONTENT_Y_MM)};width:${s(KOREA_POST_OVERLAY.CONTENT_WIDTH_MM)}}`,
      `.product-info{left:${x(KOREA_POST_OVERLAY.PRODUCT_X_MM)};top:${y(KOREA_POST_OVERLAY.PRODUCT_Y_MM)};width:${s(KOREA_POST_OVERLAY.PRODUCT_WIDTH_MM)}}`,
      `.sender{left:${x(KOREA_POST_OVERLAY.SENDER_X_MM)};top:${y(KOREA_POST_OVERLAY.SENDER_Y_MM)};width:${s(KOREA_POST_OVERLAY.SENDER_WIDTH_MM)}}`,
      `.recipient{left:${x(KOREA_POST_OVERLAY.RECIPIENT_X_MM)};top:${y(KOREA_POST_OVERLAY.RECIPIENT_Y_MM)};width:${s(KOREA_POST_OVERLAY.RECIPIENT_WIDTH_MM)}}`,
      `.registration{left:${x(KOREA_POST_OVERLAY.REGISTRATION_X_MM)};top:${y(KOREA_POST_OVERLAY.REGISTRATION_Y_MM)};width:${s(KOREA_POST_OVERLAY.REGISTRATION_WIDTH_MM)}}`,
      `.bottom-barcode{left:${x(KOREA_POST_OVERLAY.BOTTOM_BARCODE_X_MM)};top:${y(KOREA_POST_OVERLAY.BOTTOM_BARCODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.BOTTOM_BARCODE_WIDTH_MM)};height:${s(KOREA_POST_OVERLAY.BOTTOM_BARCODE_HEIGHT_MM)}}`,
      `.bottom-code{left:${x(KOREA_POST_OVERLAY.BOTTOM_CODE_X_MM)};top:${y(KOREA_POST_OVERLAY.BOTTOM_CODE_Y_MM)};width:${s(KOREA_POST_OVERLAY.BOTTOM_CODE_WIDTH_MM)};text-align:center;font-size:9mm;font-weight:900;line-height:.9}`,
      ".barcode-slot svg{display:block;width:100%;height:100%;fill:#000;shape-rendering:crispEdges}",
      ".sender-name{display:block;margin-top:.8mm;font-size:4.2mm;font-weight:900;line-height:1}",
      ".recipient-name{display:block;margin:1.2mm 0 1mm;font-size:6.6mm;font-weight:900;line-height:1}",
      ".address-line{display:block;margin-top:.8mm}",
      ".address-strong{display:block;margin-top:1.2mm;font-size:4.6mm;font-weight:900;line-height:1.14}",
      `.test-watermark{left:${x(KOREA_POST_OVERLAY.WATERMARK_X_MM)};top:${y(KOREA_POST_OVERLAY.WATERMARK_Y_MM)};transform:translate(-50%,-50%) rotate(-20deg);color:rgba(0,0,0,.12);font-size:9mm;font-weight:700;white-space:nowrap}`,
      "</style>",
      "</head>",
      "<body>",
      '<main class="label-overlay">',
      watermark,
      `<div class="field region-code">${escapeHtml(labelRegionCode(order))}</div>`,
      `<div class="field sort-code">${escapeHtml(labelSortCode(order))}</div>`,
      `<div class="field field-small customer-order"><span class="address-line">접수일: ${escapeHtml(datePart(order))}</span><span class="address-line">주문: ${escapeHtml(order.order_no)}</span><span class="address-line">고객: ${escapeHtml(order.agency_name)}</span></div>`,
      `<div class="field payment-method">${escapeHtml(paymentMethod)}</div>`,
      `<div class="field field-small weight">중량:${escapeHtml(labelWeightText(order))}</div>`,
      `<div class="field field-small volume">용적:${escapeHtml(labelVolumeText(order))}</div>`,
      `<div class="field field-small fee">요금:${escapeHtml(labelFeeText(order))}</div>`,
      `<div class="barcode-slot main-barcode">${code128BarcodeSvg(registrationNo)}</div>`,
      `<div class="field field-small delivery-message">배송메시지: ${escapeHtml(deliveryMessage)}</div>`,
      `<div class="field field-small content-name">내용품명: ${escapeHtml(order.product_name || "필름 제품")}</div>`,
      `<div class="field field-tiny product-info">${escapeHtml(productInfo)}</div>`,
      `<div class="field field-small sender"><span class="address-line">${escapeHtml(order.sender_address)}</span><strong class="sender-name">${escapeHtml(senderName)}</strong><span class="address-line">T: ${escapeHtml(senderPhone)}</span></div>`,
      `<div class="field recipient"><span class="address-line">${escapeHtml(order.recipient_address)}</span>${recipientAddressDetail ? `<span class="address-line">${escapeHtml(recipientAddressDetail)}</span>` : ""}<strong class="recipient-name">${escapeHtml(recipientName)}</strong><span class="address-line">T: ${escapeHtml(recipientPhone)}</span><span class="address-strong">${escapeHtml(order.recipient_zipcode || "")}</span></div>`,
      `<div class="field field-small registration"><span class="address-line">등기번호: ${escapeHtml(registrationNo)}</span><span class="address-line">수량: ${Number(order.quantity || 0).toLocaleString("ko-KR")}롤</span></div>`,
      `<div class="barcode-slot bottom-barcode">${code128BarcodeSvg(registrationNo)}</div>`,
      `<div class="field bottom-code">${escapeHtml(labelBottomCode(order))}</div>`,
      "</main>",
      "</body>",
      "</html>"
    ].join("")
  };
}

function labelRegionCode(order: ShippingLabelOrder) {
  return String(order.region_code || order.zone_code || order.label_region_code || "B4 484").trim();
}

function labelSortCode(order: ShippingLabelOrder) {
  return String(order.sort_code || order.classification_code || order.label_sort_code || "0316").trim();
}

function labelWeightText(order: ShippingLabelOrder) {
  return String(order.shipping_weight || order.weight || "1190g").trim();
}

function labelVolumeText(order: ShippingLabelOrder) {
  return String(order.shipping_volume || order.volume || "60cm").trim();
}

function labelFeeText(order: ShippingLabelOrder) {
  return String(order.shipping_fee || order.fee || "4,500 착불").trim();
}

function labelBottomCode(order: ShippingLabelOrder) {
  return String(order.bottom_code || order.routing_code || "031 000").trim();
}

function maskName(value: string, enabled: boolean) {
  const name = String(value || "").trim();
  if (!enabled || name.length < 2) return name;
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${"*".repeat(Math.max(1, name.length - 2))}${name[name.length - 1]}`;
}

function maskPhone(value: string, enabled: boolean) {
  const phone = String(value || "").trim();
  if (!enabled) return phone;
  return phone.replace(/(\d{2,3})-?(\d{3,4})-?(\d{4})$/, "$1-****-$3");
}

function maskAddressDetail(value: string | undefined, enabled: boolean) {
  const detail = String(value || "").trim();
  if (!enabled || !detail) return detail;
  const parts = detail.split(/\s+/);
  if (parts.length === 1) return "***";
  return `${parts.slice(0, -1).join(" ")} ***`;
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

function datePart(order?: ShippingLabelOrder) {
  const value = String(order?.created_at || "");
  const matched = value.match(/\d{4}-\d{2}-\d{2}/);
  return (matched?.[0] || new Date().toISOString().slice(0, 10)).replaceAll("-", ".");
}

function code128BarcodeSvg(value: string) {
  const patterns = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
    "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
  ];
  const encoded = String(value || "-").replace(/[^\x20-\x7e]/g, "-");
  const values = [104, ...encoded.split("").map((char) => char.charCodeAt(0) - 32)];
  const checksum = values.slice(1).reduce((total, next, index) => total + next * (index + 1), values[0]) % 103;
  values.push(checksum, 106);
  const moduleWidth = 2;
  const height = 80;
  let cursor = 20;
  const rects: string[] = [];

  values.forEach((code) => {
    patterns[code].split("").forEach((unit, index) => {
      const width = Number(unit) * moduleWidth;
      if (index % 2 === 0) rects.push(`<rect x="${cursor}" y="0" width="${width}" height="${height}" />`);
      cursor += width;
    });
  });

  return `<svg viewBox="0 0 ${cursor + 20} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Code128 송장번호 바코드" fill="#000" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
