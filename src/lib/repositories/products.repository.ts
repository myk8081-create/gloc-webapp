import { createDataProvider, type DataProvider, type ProductRecord, type RepositoryContext } from "../providers";

export interface ProductListFilters {
  category?: "PPF" | "TINTING" | "DETAILING" | "전체";
  activeOnly?: boolean;
  q?: string;
}

export interface SaveProductInput extends Partial<ProductRecord> {
  sku: string;
  product_name: string;
}

export function createProductsRepository(provider: DataProvider = createDataProvider()) {
  return {
    async list(filters: ProductListFilters = {}, context: RepositoryContext = {}) {
      const result = await provider.request<{ products: ProductRecord[] }>("getInventory", filters, context);
      return { products: result.products || [] };
    },

    save(input: SaveProductInput, context: RepositoryContext = {}) {
      return provider.request<{ product: ProductRecord }>("saveProduct", input, context);
    },

    remove(sku: string, context: RepositoryContext = {}) {
      return provider.request<{ deleted_sku: string }>("deleteProduct", { sku }, context);
    }
  };
}

export type ProductsRepository = ReturnType<typeof createProductsRepository>;
