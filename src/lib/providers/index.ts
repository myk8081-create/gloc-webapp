import type { DataProvider } from "./provider.types";
import { createGoogleSheetsProvider } from "./googleSheets.provider";
import { createSupabaseProvider } from "./supabase.provider";

export function createDataProvider(): DataProvider {
  const provider = process.env.DATA_PROVIDER || "googleSheets";
  if (provider === "supabase") return createSupabaseProvider();
  return createGoogleSheetsProvider();
}

export * from "./provider.types";
export * from "./googleSheets.provider";
export * from "./supabase.provider";
