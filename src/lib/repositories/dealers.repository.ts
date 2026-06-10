import { createDataProvider, type DataProvider, type DealerRecord, type RepositoryContext } from "../providers";

export function createDealersRepository(provider: DataProvider = createDataProvider()) {
  return {
    async list(baseUrl = "", context: RepositoryContext = {}) {
      const result = await provider.request<{ accounts: DealerRecord[] }>("getDealerLinks", { base_url: baseUrl }, context);
      return { dealers: result.accounts || [] };
    },

    create(input: Record<string, unknown>, context: RepositoryContext = {}) {
      return provider.request<{ account: DealerRecord }>("createDealerAccount", input, context);
    },

    updateCategoryPermissions(input: Record<string, unknown>, context: RepositoryContext = {}) {
      return provider.request<{ accounts: DealerRecord[] }>("updateDealerCategoryPermissions", input, context);
    },

    deactivate(loginId: string, context: RepositoryContext = {}) {
      return provider.request<{ account: DealerRecord }>("deactivateDealerAccount", { login_id: loginId }, context);
    }
  };
}

export type DealersRepository = ReturnType<typeof createDealersRepository>;
