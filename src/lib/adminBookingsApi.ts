import { callEdgeFunctionGet } from './edgeFunctions';

export type AdminBookingRow = {
  booking_id: string;
  home_owner_name: string;
  organizer_name: string;
  email: string;
  organization: string;
  service: string;
  price: number;
  revenue: number;
  created_at: string;
  status: string;
};

export type AdminBookingsResponse = {
  ok: boolean;
  pending_services_count: number;
  completed_services_count: number;
  gross_volume: number;
  total_revenue: number;
  bookings: AdminBookingRow[];
};

export function fetchAdminBookings(params: {
  search?: string;
  start_date?: string;
  end_date?: string;
}) {
  return callEdgeFunctionGet<AdminBookingsResponse>('admin_get_bookings', {
    search: params.search,
    start_date: params.start_date,
    end_date: params.end_date,
  });
}
