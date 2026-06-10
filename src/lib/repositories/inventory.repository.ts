import { createDataProvider, type DataProvider, type InventoryRecord, type ProductRecord, type RepositoryContext } from "../providers";

export interface InventoryListFilters {
  dealer_code?: string;
  category?: "PPF" | "TINTING" | "DETAILING" | "전체";
  q?: string;
}

export interface SaveInventoryInput {
  sku: string;
  stock_qty: number;
  safety_stock?: number;
  location?: string;
}

export function createInventoryRepository(provider: DataProvider = createDataProvider()) {
  return {
    list(filters: InventoryListFilters = {}, context: RepositoryContext = {}) {
      return provider.request<{ products: ProductRecord[]; inventory: InventoryRecord[] }>("getInventory", filters, context);
    },

    save(input: SaveInventoryInput, context: RepositoryContext = {}) {
      return provider.request<{ inventory: InventoryRecord }>("saveInventory", input, context);
    }
  };
}

export type InventoryRepository = ReturnType<typeof createInventoryRepository>;
