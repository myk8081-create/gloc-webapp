import { createDataProvider, type DataProvider, type OrderRecord, type OrderStatus, type RepositoryContext } from "../providers";

export const ORDER_STATUSES: OrderStatus[] = ["접수", "승인", "shipping_registered_test", "출고", "완료", "반려", "취소"];

export interface OrderListFilters {
  status?: OrderStatus | "전체";
  agency_id?: string;
  from?: string;
  to?: string;
  q?: string;
}

export interface CreateOrderInput {
  agency_id: string;
  product_name: string;
  quantity: number;
  memo?: string;
}

export interface UpdateOrderStatusInput {
  order_no: string;
  status: OrderStatus;
  courier?: string;
  tracking_no?: string;
  shipping_receipt_no?: string;
}

function assertOrderStatus(status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`지원하지 않는 발주 상태입니다: ${status}`);
  }
}

function mapOrderStatusPayload(input: UpdateOrderStatusInput) {
  return {
    order_id: input.order_no,
    order_no: input.order_no,
    status: input.status,
    shipping_company: input.courier,
    courier: input.courier,
    tracking_number: input.tracking_no,
    tracking_no: input.tracking_no,
    shipping_receipt_no: input.shipping_receipt_no
  };
}

export function createOrdersRepository(provider: DataProvider = createDataProvider()) {
  return {
    list(filters: OrderListFilters = {}, context: RepositoryContext = {}) {
      return provider.request<{ orders: OrderRecord[] }>("getOrders", filters, context);
    },

    create(input: CreateOrderInput, context: RepositoryContext = {}) {
      return provider.request<{ order: OrderRecord }>(
        "createOrder",
        {
          agency_id: input.agency_id,
          product_name: input.product_name,
          quantity: input.quantity,
          qty: input.quantity,
          memo: input.memo || ""
        },
        context
      );
    },

    updateStatus(input: UpdateOrderStatusInput, context: RepositoryContext = {}) {
      assertOrderStatus(input.status);
      return provider.request<{ order: OrderRecord }>("updateOrderStatus", mapOrderStatusPayload(input), context);
    },

    markPrinted(orderNo: string, context: RepositoryContext = {}) {
      return provider.request<{ order: OrderRecord }>(
        "markOrderPrinted",
        { order_no: orderNo, order_id: orderNo },
        context
      );
    }
  };
}

export type OrdersRepository = ReturnType<typeof createOrdersRepository>;
