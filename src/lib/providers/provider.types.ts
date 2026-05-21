export type OrderStatus = "접수" | "승인" | "shipping_registered_test" | "출고" | "완료" | "반려" | "취소";

export type PrintStatus = "대기" | "완료" | "오류";

export interface RepositoryContext {
  token?: string;
  customerId?: string;
}

export interface OrderRecord {
  order_no: string;
  agency_id: string;
  product_name: string;
  quantity: number;
  status: OrderStatus;
  courier?: string;
  tracking_no?: string;
  shipping_receipt_no?: string;
  print_status?: PrintStatus | string;
  printed_at?: string;
  print_count?: number;
  shipping_error?: string;
  approved_at?: string;
  created_at?: string;
}

export interface AgencyRecord {
  id: string;
  dealer_id: string;
  agency_name: string;
  contact_name?: string;
  phone?: string;
  zipcode?: string;
  address?: string;
  address_detail?: string;
  default_courier?: string;
  shipping_memo?: string;
  is_active: boolean;
  is_first_login: boolean;
  password_changed_at?: string;
  profile_completed_at?: string;
  updated_at?: string;
}

export interface SettingRecord {
  key: string;
  value: string;
}

export interface LogRecord {
  created_at: string;
  level: "debug" | "info" | "warn" | "error" | string;
  message: string;
}

export interface SheetSchema {
  sheetName: string;
  columns: string[];
}

export interface DataProvider {
  request<T>(action: string, payload?: unknown, context?: RepositoryContext): Promise<T>;
  ensureSchema?(context?: RepositoryContext): Promise<{ sheets: string[] }>;
}
