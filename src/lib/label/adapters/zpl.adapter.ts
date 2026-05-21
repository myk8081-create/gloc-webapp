import { KOREA_POST_OVERLAY, type ShippingLabelOrder } from "./pdf.adapter";

export interface ZplLabelOptions {
  dpi?: 203 | 300;
  testMode?: boolean;
}

export interface ZplLabelDocument {
  mimeType: "text/plain";
  zpl: string;
}

export function createZplLabelDocument(order: ShippingLabelOrder, options: ZplLabelOptions = {}): ZplLabelDocument {
  const dpi = options.dpi || 203;
  const dotsPerMm = dpi / 25.4;
  const registrationNo = order.shipping_receipt_no || order.tracking_no || order.order_no;
  const paymentMethod = /선불|prepaid/i.test(order.fee || "") ? "PREPAID" : "COD";
  const deliveryMessage = order.shipping_memo || order.memo || "Call before delivery";
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
      `^FO${x(KOREA_POST_OVERLAY.CUSTOMER_ORDER_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.CUSTOMER_ORDER_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.CUSTOMER_ORDER_WIDTH_MM, dotsPerMm)},3,0,L^FDOrder: ${safeZpl(order.order_no)}\\&Customer: ${safeZpl(order.agency_name)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.PAYMENT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.PAYMENT_Y_MM, dotsPerMm)}^A0N,44,44^FD${paymentMethod}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.BARCODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.BARCODE_Y_MM, dotsPerMm)}^BY2^BCN,${mm(KOREA_POST_OVERLAY.BARCODE_HEIGHT_MM, dotsPerMm)},N,N,N^FD${safeZpl(registrationNo)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.MESSAGE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.MESSAGE_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.MESSAGE_WIDTH_MM, dotsPerMm)},2,0,L^FDMessage: ${safeZpl(deliveryMessage)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.CONTENT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.CONTENT_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.CONTENT_WIDTH_MM, dotsPerMm)},2,0,L^FDItem: ${safeZpl(order.product_name)} / ${Number(order.quantity || 0).toLocaleString("ko-KR")}roll^FS`,
      `^FO${x(KOREA_POST_OVERLAY.SENDER_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.SENDER_Y_MM, dotsPerMm)}^A0N,21,21^FB${mm(KOREA_POST_OVERLAY.SENDER_WIDTH_MM, dotsPerMm)},4,0,L^FD${safeZpl(order.sender_name)}\\&${safeZpl(order.sender_address)}\\&T: ${safeZpl(order.sender_phone)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.RECIPIENT_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.RECIPIENT_Y_MM, dotsPerMm)}^A0N,22,22^FB${mm(KOREA_POST_OVERLAY.RECIPIENT_WIDTH_MM, dotsPerMm)},6,0,L^FD${safeZpl(order.recipient_name || order.agency_name)}\\&T: ${safeZpl(order.recipient_phone)}\\&${safeZpl(order.recipient_zipcode || "")}\\&${safeZpl(order.recipient_address)}\\&${safeZpl(order.recipient_address_detail || "")}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_Y_MM, dotsPerMm)}^BY1^BCN,${mm(KOREA_POST_OVERLAY.RECIPIENT_BARCODE_HEIGHT_MM, dotsPerMm)},N,N,N^FD${safeZpl(order.tracking_no.slice(-10) || order.tracking_no)}^FS`,
      `^FO${x(KOREA_POST_OVERLAY.REGISTRATION_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.REGISTRATION_Y_MM, dotsPerMm)}^A0N,20,20^FB${mm(KOREA_POST_OVERLAY.REGISTRATION_WIDTH_MM, dotsPerMm)},2,0,L^FDRegistration: ${safeZpl(registrationNo)}\\&Qty: ${Number(order.quantity || 0).toLocaleString("ko-KR")}roll^FS`,
      `^FO${x(KOREA_POST_OVERLAY.BOTTOM_BARCODE_X_MM, dotsPerMm)},${y(KOREA_POST_OVERLAY.BOTTOM_BARCODE_Y_MM, dotsPerMm)}^BY2^BCN,${mm(KOREA_POST_OVERLAY.BOTTOM_BARCODE_HEIGHT_MM, dotsPerMm)},N,N,N^FD${safeZpl(registrationNo)}^FS`,
      testCopy,
      "^XZ"
    ].filter(Boolean).join("\n")
  };
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
