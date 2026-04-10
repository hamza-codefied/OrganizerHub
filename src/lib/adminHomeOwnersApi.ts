import { callEdgeFunction, callEdgeFunctionGet } from './edgeFunctions';

export type HomeOwnersRange = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';

export type HomeOwnerListItem = {
  home_owner_id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  location: string | null;
  status: string;
};

export type AdminHomeOwnersListResponse = {
  ok: boolean;
  range: string;
  total_home_owners: number;
  total_active: number;
  total_suspended: number;
  total_new: number;
  home_owners: HomeOwnerListItem[];
};

export type HomeOwnerDetail = {
  home_owner_id: string;
  name: string;
  status: boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  location: string | null;
  date_of_birth: string;
  gender: string;
  created_at: string;
  deactivation_reason?: string | null;
  deactivated_at?: string | null;
  favorites?: unknown[];
};

/** Booking row from `admin_get_home_owner_detailsbyId`. */
export type HomeOwnerBooking = {
  booking_id: string;
  service_id?: number;
  category_id?: number;
  user_id: string;
  organizer_id: string;
  assignee: string | null;
  assignee_name?: string | null;
  organization_name?: string | null;
  status: string;
  service_name: string;
  scheduled_at: string;
  start_time: string;
  end_time: string;
  lat: number | null;
  lng: number | null;
  booking_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminHomeOwnerDetailsResponse = {
  ok: boolean;
  range: string;
  home_owner: HomeOwnerDetail;
  bookings: HomeOwnerBooking[];
};

export function fetchAdminHomeOwners(range: HomeOwnersRange) {
  return callEdgeFunctionGet<AdminHomeOwnersListResponse>('admin_get_total_home_owners', {
    range,
  });
}

export function fetchAdminHomeOwnerById(homeOwnerId: string) {
  return callEdgeFunctionGet<AdminHomeOwnerDetailsResponse>('admin_get_home_owner_detailsbyId', {
    home_owner_id: homeOwnerId,
  });
}

export type AdminSuspendHomeOwnerResponse = {
  ok: boolean;
  home_owner_id: string;
  suspended: boolean;
  message: string;
};

/**
 * Suspend: `{ home_owner_id, suspend: true, message }` — message is required.
 * Activate: `{ home_owner_id, suspend: false }` — no message field.
 */
export async function adminSuspendHomeOwner(params: {
  home_owner_id: string;
  suspend: boolean;
  message?: string;
}): Promise<AdminSuspendHomeOwnerResponse> {
  if (params.suspend) {
    const msg = params.message?.trim();
    if (!msg) {
      throw new Error('Please enter a reason for suspension.');
    }
    const res = await callEdgeFunction<AdminSuspendHomeOwnerResponse>('admin_suspend_home_owner', {
      home_owner_id: params.home_owner_id,
      suspend: true,
      message: msg,
    });
    if (!res.ok) {
      throw new Error(res.message || 'Could not suspend home owner.');
    }
    return res;
  }

  const res = await callEdgeFunction<AdminSuspendHomeOwnerResponse>('admin_suspend_home_owner', {
    home_owner_id: params.home_owner_id,
    suspend: false,
  });
  if (!res.ok) {
    throw new Error(res.message || 'Could not restore home owner.');
  }
  return res;
}
