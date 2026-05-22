import { KOREA_POST_OVERLAY, type ShippingLabelOrder } from "./pdf.adapter";

export interface ZplLabelOptions {
  dpi?: 203 | 300;
  testMode?: boolean;
  privacyMasking?: boolean;
}

export interface ZplLabelDocument {
  mimeType: "text/plain";
  zpl: string;
}

export function createZplLabelDocument(order: ShippingLabelOrder, options: ZplLabelOptions = {}): ZplLabelDocument {
  const dpi = options.dpi || 203;
  const dotsPerMm = dpi / 25.4;
  const privacyMasking = options.privacyMasking ?? true;
  const registrationNo = order.shipping_receipt_no || order.tracking_no || order.order_no;
  const paymentMethod = /선불|prepaid/i.test(order.shipping_fee || order.fee || "") ? "PREPAID" : "COD";
  const deliveryMessage = order.shipping_memo || order.memo || "Call before delivery";
  const recipientName = maskName(order.recipient_name || order.agency_name, privacyMasking);
  const recipientPhone = maskPhone(order.recipient_phone, privacyMasking);
  const recipientAddressDetail = maskAddressDetail(order.recipient_address_detail, privacyMasking);
  const senderName = maskName(order.sender_name, privacyMasking);
  const senderPhone = maskPhone(order.sender_phone, privacyMasking);
  const productInfo = [order.product_name, order.sku, `${Number(order.quantity || 0).toLocaleString("ko-KR")}roll`]
    .filter(Boolean)
    .join(" / ");
  const testCopy = options.testMode === false
    ? ""
    : `^FO${x(KOREA_POST_OVERLAY.WATERMARK_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.WATERMARK_Y_MM, dotsPerMm)}^A0N,44,44^FDTEST / ACTUAL ACCEPTANCE NO^FS`;

  return {
    mimeType: "text/plain",
    zpl: [
      "^XA",
      `^PW${mm(KOREA_POST_OVERLAY.PAGE_WIDTH_MM, dotsPerMm)}`,
      `^LL${mm(KOREA_POST_OVERLAY.PAGE_HEIGHT_MM, dotsPerMm)}`,
      "^CI28",
      KOREA_POST_OVERLAY.PRINT_ROTATION_DEG === 180 ? "^POI" : "",
      `^FO${x(KOREA_POST_OVERLAY.REGION_CODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.REGION_CODE_Y_MM, dotsPerMm)}^A0N,104,104^FB${mm(KOREA_POST_OVERLAY.REGION_CODE_WIDTH_MM, dotsPerMm)},1,0,C^FD${safeZpl(labelRegionCode(order))}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.SORT_CODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.SORT_CODE_Y_MM, dotsPerMm)}^A0N,68,68^FB${mm(KOREA_POST_OVERLAY.SORT_CODE_WIDTH_MM, dotsPerMm)},1,0,C^FD${safeZpl(labelSortCode(order))}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.CUSTOMER_ORDER_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.CUSTOMER_ORDER_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.CUSTOMER_ORDER_WIDTH_MM, dotsPerMm)},3,0,L^FDDate: ${safeZpl(datePart(order))}\\&Order: ${safeZpl(order.order_no)}\\&Customer: ${safeZpl(order.agency_name)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.PAYMENT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.PAYMENT_Y_MM, dotsPerMm)}^A0N,44,44^FD${paymentMethod}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.WEIGHT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.WEIGHT_Y_MM, dotsPerMm)}^A0N,19,19^FDWeight:${safeZpl(labelWeightText(order))}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.VOLUME_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.VOLUME_Y_MM, dotsPerMm)}^A0N,19,19^FDVol:${safeZpl(labelVolumeText(order))}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.FEE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.FEE_Y_MM, dotsPerMm)}^A0N,19,19^FDFee:${safeZpl(labelFeeText(order))}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.BARCODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.BARCODE_Y_MM, dotsPerMm)}^BY2^BCN,${mm(KOREA_POST_OVERLAY.BARCODE_HEIGHT_MM, dotsPerMm)},N,N,N^FD${safeZpl(registrationNo)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.MESSAGE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.MESSAGE_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.MESSAGE_WIDTH_MM, dotsPerMm)},2,0,L^FDMessage: ${safeZpl(deliveryMessage)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.CONTENT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.CONTENT_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.CONTENT_WIDTH_MM, dotsPerMm)},2,0,L^FDItem: ${safeZpl(order.product_name)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.PRODUCT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.PRODUCT_Y_MM, dotsPerMm)}^A0N,17,17^FB${mm(KOREA_POST_OVERLAY.PRODUCT_WIDTH_MM, dotsPerMm)},2,0,L^FD${safeZpl(productInfo)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.SENDER_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.SENDER_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.SENDER_WIDTH_MM, dotsPerMm)},4,0,L^FD${safeZpl(order.sender_address)}\\&${safeZpl(senderName)}\\&T: ${safeZpl(senderPhone)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.RECIPIENT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.RECIPIENT_Y_MM, dotsPerMm)}^A0N,22,22^FB${mm(KOREA_POST_OVERLAY.RECIPIENT_WIDTH_MM, dotsPerMm)},7,0,L^FD${safeZpl(order.recipient_address)}\\&${safeZpl(recipientAddressDetail)}\\&${safeZpl(recipientName)}\\&T: ${safeZpl(recipientPhone)}\\&${safeZpl(order.recipient_zipcode || "")}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.REGISTRATION_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.REGISTRATION_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.REGISTRATION_WIDTH_MM, dotsPerMm)},2,0,L^FDRegistration: ${safeZpl(registrationNo)}\\&Qty: ${Number(order.quantity || 0).toLocaleString("ko-KR")}roll^FS`,
      `^FO${x(KOREA_POST_OVERLAY.BOTTOM_BARCODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.BOTTOM_BARCODE_Y_MM, dotsPerMm)}^BY2^BCN,${mm(KOREA_POST_OVERLAY.BOTTOM_BARCODE_HEIGHT_MM, dotsPerMm)},N,N,N^FD${safeZpl(registrationNo)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.BOTTOM_CODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.BOTTOM_CODE_Y_MM, dotsPerMm)}^A0N,68,68^FB${mm(KOREA_POST_OVERLAY.BOTTOM_CODE_WIDTH_MM, dotsPerMm)},1,0,C^FD${safeZpl(labelBottomCode(order))}^FS`,
      testCopy,
      "^XZ"
    ].filter(Boolean).join("\n")
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
  return String(order.shipping_fee || order.fee || "4,500 COD").trim();
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

function datePart(order?: ShippingLabelOrder) {
  const value = String(order?.created_at || "");
  const matched = value.match(/\d{4}-\d{2}-\d{2}/);
  return (matched?.[0] || new Date().toISOString().slice(0, 10)).replaceAll("-", ".");
}

function x(value: number, dotsPerMm: number) {
  return mm(KOREA_POST_OVERLAY.OFFSET_X_MM + value * KOREA_POST_OVERLAY.SCALE, dotsPerMm);
}

function y(value: number, dotsPerMm: number) {
  return mm(KOREA_POST_OVERLAY.OFFSET_Y_MM + value * KOREA_POST_OVERLAY.SCALE, dotsPerMm);
}

function mm(value: number, dotsPerMm: number) {
  return Math.round(value * dotsPerMm);
}

function safeZpl(value: unknown) {
  return String(value ?? "").replace(/[\^~]/g, " ").trim();
}
