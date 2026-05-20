import type { DataProvider, RepositoryContext } from "./provider.types";

export interface SupabaseProviderOptions {
  url?: string;
  serviceRoleKey?: string;
}

export class SupabaseProvider implements DataProvider {
  constructor(private readonly options: SupabaseProviderOptions = {}) {}

  async request<T>(_action: string, _payload: unknown = {}, _context: RepositoryContext = {}): Promise<T> {
    const url = this.options.url || process.env.SUPABASE_URL || "";
    const serviceRoleKey = this.options.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!url || !serviceRoleKey) {
      throw new Error("Supabase provider는 아직 설정되지 않았습니다. SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 설정해 주세요.");
    }

    throw new Error("Supabase provider 구현은 전환 시점에 연결합니다. Repository 인터페이스는 이미 분리되어 있습니다.");
  }
}

export function createSupabaseProvider(options?: SupabaseProviderOptions) {
  return new SupabaseProvider(options);
}
