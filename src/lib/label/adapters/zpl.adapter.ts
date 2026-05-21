import type { ShippingLabelOrder } from "./pdf.adapter";

export interface ZplLabelOptions {
  widthDots?: number;
  heightDots?: number;
  testMode?: boolean;
}

export interface ZplLabelDocument {
  mimeType: "text/plain";
  zpl: string;
}

export function createZplLabelDocument(order: ShippingLabelOrder, options: ZplLabelOptions = {}): ZplLabelDocument {
  const width = options.widthDots || 800;
  const height = options.heightDots || 1200;
  const testCopy = options.testMode === false ? "" : "^FO110,500^A0N,58,58^FR^FDTEST / ACTUAL ACCEPTANCE NO^FS";
  return {
    mimeType: "text/plain",
    zpl: [
      "^XA",
      `^PW${width}`,
      `^LL${height}`,
      "^CI28",
      "^FO40,35^A0N,54,54^FDGLOC^FS",
      `^FO40,105^A0N,30,30^FD${safeZpl(order.courier)}^FS`,
      `^FO40,150^BY3^BCN,120,Y,N,N^FD${safeZpl(order.tracking_no)}^FS`,
      `^FO40,310^A0N,34,34^FD${safeZpl(order.agency_name)} / ${safeZpl(order.recipient_name)}^FS`,
      `^FO40,360^A0N,30,30^FD${safeZpl(order.recipient_phone)}^FS`,
      `^FO40,405^A0N,28,28^FB720,3,0,L^FD${safeZpl(order.recipient_address)}^FS`,
      `^FO40,565^A0N,30,30^FB720,2,0,L^FD${safeZpl(order.product_name)} / ${Number(order.quantity || 0).toLocaleString("ko-KR")}roll^FS`,
      `^FO40,650^A0N,28,28^FB720,2,0,L^FDSender: ${safeZpl(order.sender_name)} / ${safeZpl(order.sender_phone)}^FS`,
      testCopy,
      "^XZ"
    ].filter(Boolean).join("\n")
  };
}

function safeZpl(value: unknown) {
  return String(value ?? "").replace(/[\^~]/g, " ").trim();
}
