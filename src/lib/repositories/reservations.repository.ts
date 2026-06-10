import { createDataProvider, type DataProvider, type RepositoryContext, type ReservationRecord } from "../providers";

export interface ReservationListFilters {
  dealer_code?: string;
  status?: string;
  from?: string;
  to?: string;
  q?: string;
}

export function createReservationsRepository(provider: DataProvider = createDataProvider()) {
  return {
    list(filters: ReservationListFilters = {}, context: RepositoryContext = {}) {
      return provider.request<{ reservations: ReservationRecord[] }>("getReservations", filters, context);
    },

    create(input: Record<string, unknown>, context: RepositoryContext = {}) {
      return provider.request<{ reservation: ReservationRecord }>("createReservation", input, context);
    },

    complete(reservationId: string, context: RepositoryContext = {}) {
      return provider.request<{ reservation: ReservationRecord }>(
        "completeReservation",
        { reservation_id: reservationId },
        context
      );
    }
  };
}

export type ReservationsRepository = ReturnType<typeof createReservationsRepository>;
