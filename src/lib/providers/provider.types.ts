export type OrderStatus = "접수" | "승인" | "shipping_registered_test" | "출고" | "완료" | "반려" | "취소";

export type PrintStatus = "대기" | "완료" | "오류" | "printed" | "failed";

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

export type ProductCategory = "PPF" | "TINTING" | "DETAILING";

export interface ProductRecord {
  sku: string;
  product_name: string;
  category: ProductCategory;
  brand?: string;
  product_code?: string;
  unit?: string;
  retail_price?: number;
  purchase_price?: number;
  is_active: boolean;
}

export interface InventoryRecord {
  dealer_code: string;
  dealer_name?: string;
  product_name: string;
  sku: string;
  category: ProductCategory;
  stock_qty: number;
  safety_stock: number;
  location?: string;
  updated_at?: string;
}

export interface ReservationRecord {
  reservation_id: string;
  dealer_code: string;
  dealer_name?: string;
  customer_name?: string;
  reservation_date?: string;
  reservation_items?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DealerRecord {
  login_id: string;
  dealer_code: string;
  dealer_name: string;
  role: "admin" | "dealer";
  can_access_ppf: boolean;
  can_access_tinting: boolean;
  can_access_detailing: boolean;
  is_active: boolean;
  updated_at?: string;
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
