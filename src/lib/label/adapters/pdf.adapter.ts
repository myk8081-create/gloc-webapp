export type LabelSize = "post-100x150" | "a6" | "four-by-six";

export interface ShippingLabelOrder {
  order_no: string;
  courier: string;
  tracking_no: string;
  shipping_receipt_no?: string;
  agency_name: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  product_name: string;
  quantity: number;
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

export function createPdfLabelDocument(order: ShippingLabelOrder, options: PdfLabelOptions): PdfLabelDocument {
  const watermark = options.testMode === false ? "" : "TEST / 실제 접수 아님";
  return {
    mimeType: "text/html",
    html: [
      "<!doctype html>",
      '<html lang="ko">',
      "<head>",
      '<meta charset="UTF-8" />',
      `<title>송장출력 ${escapeHtml(order.tracking_no)}</title>`,
      "</head>",
      "<body>",
      `<main data-label-size="${escapeHtml(options.labelSize)}">`,
      watermark ? `<strong>${watermark}</strong>` : "",
      `<p>${escapeHtml(order.courier)} / ${escapeHtml(order.tracking_no)}</p>`,
      `<p>${escapeHtml(order.agency_name)} · ${escapeHtml(order.recipient_name)} · ${escapeHtml(order.recipient_phone)}</p>`,
      `<p>${escapeHtml(order.recipient_address)}</p>`,
      `<p>${escapeHtml(order.product_name)} / ${Number(order.quantity || 0).toLocaleString("ko-KR")}롤</p>`,
      `<p>발송인: ${escapeHtml(order.sender_name)} / ${escapeHtml(order.sender_phone)} / ${escapeHtml(order.sender_address)}</p>`,
      "</main>",
      "</body>",
      "</html>"
    ].join("")
  };
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
