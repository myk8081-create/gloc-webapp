import { createDataProvider, type AgencyRecord, type DataProvider, type RepositoryContext } from "../providers";

export interface AgencyListFilters {
  dealer_id?: string;
  is_active?: boolean;
  q?: string;
}

export interface UpsertAgencyInput {
  id?: string;
  dealer_id: string;
  agency_name: string;
  contact_name?: string;
  phone?: string;
  zipcode?: string;
  address?: string;
  address_detail?: string;
  default_courier?: string;
  shipping_memo?: string;
  is_active?: boolean;
}

export function createAgenciesRepository(provider: DataProvider = createDataProvider()) {
  return {
    list(filters: AgencyListFilters = {}, context: RepositoryContext = {}) {
      return provider.request<{ agencies: AgencyRecord[] }>("agencies.list", filters, context);
    },

    upsert(input: UpsertAgencyInput, context: RepositoryContext = {}) {
      return provider.request<{ agency: AgencyRecord }>("agencies.upsert", input, context);
    },

    deactivate(id: string, context: RepositoryContext = {}) {
      return provider.request<{ agency: AgencyRecord }>("agencies.deactivate", { id }, context);
    }
  };
}

export type AgenciesRepository = ReturnType<typeof createAgenciesRepository>;
