import type { DataProvider, RepositoryContext, SheetSchema } from "./provider.types";

export const GOOGLE_SHEET_SCHEMAS: Record<string, SheetSchema> = {
  Orders: {
    sheetName: "Orders",
    columns: [
      "order_no",
      "agency_id",
      "product_name",
      "quantity",
      "status",
      "courier",
      "tracking_no",
      "shipping_receipt_no",
      "print_status",
      "printed_at",
      "print_count",
      "shipping_error",
      "approved_at",
      "created_at"
    ]
  },
  Agencies: {
    sheetName: "Agencies",
    columns: [
      "id",
      "dealer_id",
      "agency_name",
      "contact_name",
      "phone",
      "zipcode",
      "address",
      "address_detail",
      "default_courier",
      "shipping_memo",
      "is_active",
      "is_first_login",
      "password_changed_at",
      "profile_completed_at",
      "updated_at"
    ]
  },
  Settings: {
    sheetName: "Settings",
    columns: ["key", "value"]
  },
  Logs: {
    sheetName: "Logs",
    columns: ["created_at", "level", "message"]
  }
};

export interface GoogleSheetsProviderOptions {
  appsScriptUrl?: string;
  defaultCustomerId?: string;
}

function customerEnvKey(customerId?: string) {
  return `APPS_SCRIPT_API_URL_${String(customerId || "").toUpperCase().replace(/[^A-Z0-9_]/g, "_")}`;
}

function resolveAppsScriptUrl(options: GoogleSheetsProviderOptions, context?: RepositoryContext) {
  const customerId = context?.customerId || options.defaultCustomerId || process.env.GLOC_CUSTOMER_ID || "default";
  return process.env[customerEnvKey(customerId)] || options.appsScriptUrl || process.env.APPS_SCRIPT_API_URL || "";
}

export class GoogleSheetsProvider implements DataProvider {
  constructor(private readonly options: GoogleSheetsProviderOptions = {}) {}

  async request<T>(action: string, payload: unknown = {}, context: RepositoryContext = {}): Promise<T> {
    const appsScriptUrl = resolveAppsScriptUrl(this.options, context);
    if (!appsScriptUrl) {
      throw new Error("APPS_SCRIPT_API_URL 환경변수가 설정되지 않았습니다.");
    }

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action,
        token: context.token || "",
        payload
      })
    });

    const text = await response.text();
    let result: any = null;
    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("Google Sheets API 응답을 JSON으로 읽을 수 없습니다.");
    }

    if (!response.ok || result?.ok === false) {
      throw new Error(result?.error || response.statusText || "Google Sheets API 요청에 실패했습니다.");
    }

    return (result?.data ?? result) as T;
  }

  async ensureSchema(context: RepositoryContext = {}) {
    return this.request<{ sheets: string[] }>(
      "setupRepositorySheets",
      { schemas: GOOGLE_SHEET_SCHEMAS },
      context
    );
  }
}

export function createGoogleSheetsProvider(options?: GoogleSheetsProviderOptions) {
  return new GoogleSheetsProvider(options);
}
