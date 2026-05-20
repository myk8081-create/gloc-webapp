import { createDataProvider, type DataProvider, type LogRecord, type RepositoryContext, type SettingRecord } from "../providers";

export function createSettingsRepository(provider: DataProvider = createDataProvider()) {
  return {
    list(context: RepositoryContext = {}) {
      return provider.request<{ settings: SettingRecord[] }>("settings.list", {}, context);
    },

    get(key: string, context: RepositoryContext = {}) {
      return provider.request<{ setting: SettingRecord | null }>("settings.get", { key }, context);
    },

    set(key: string, value: string, context: RepositoryContext = {}) {
      return provider.request<{ setting: SettingRecord }>("settings.set", { key, value }, context);
    },

    appendLog(level: LogRecord["level"], message: string, context: RepositoryContext = {}) {
      return provider.request<{ log: LogRecord }>("logs.append", { level, message }, context);
    }
  };
}

export type SettingsRepository = ReturnType<typeof createSettingsRepository>;
