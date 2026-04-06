import { callEdgeFunction, callEdgeFunctionGet } from './edgeFunctions';

export type OrganizersRange = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';

export type OrganizerCategory = {
  id: number;
  slug: string;
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
};

export type AdminOrganizerListItem = {
  organizer_id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  business_name: string;
  location: string;
  isVerified: string;
  date_of_birth: string | null;
  status: boolean;
  categories: OrganizerCategory[];
};

export type AdminOrganizersListResponse = {
  ok: boolean;
  range: string;
  total_organizers: number;
  organizers: AdminOrganizerListItem[];
};

/**
 * GET admin_get_total_organizers
 * Query: range (required), optional search (name), category_id (filter).
 */
export function fetchAdminOrganizers(params: {
  range: OrganizersRange;
  /** Search organizers by name (query param `search`). */
  search?: string;
  /** Filter by category id (query param `category_id`). */
  category_id?: string;
}) {
  return callEdgeFunctionGet<AdminOrganizersListResponse>('admin_get_total_organizers', {
    range: params.range,
    search: params.search,
    category_id: params.category_id,
  });
}

export type AdminOrganizerDetailRecord = {
  organizer_id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  business_name: string;
  /** API may use capital D */
  Description?: string;
  description?: string;
  location: string;
  isVerified: string;
  status: boolean;
  company_banner: string | null;
  address: string | null;
  website: string | null;
  business_license: string | null;
  trade_reg: string | null;
};

export type AdminOrganizerServiceOffered = {
  category_id: number;
  category_name: string;
  service_id: number;
  service_name: string;
  distance_sq_miles: number;
  completed_count: number;
  price: number;
  earnings_estimated: number;
};

export type AdminOrganizerTeamMemberService = {
  service_id: number;
  category_id: number;
  service_name: string;
  category_name: string;
};

export type AdminOrganizerTeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dial_code?: string;
  nationality_iso?: string;
  profile_image_url?: string | null;
  created_at?: string;
  permissions?: unknown[];
  services?: AdminOrganizerTeamMemberService[];
};

export type AdminOrganizerGalleryItem = {
  key: string;
  url: string;
};

export type AdminOrganizerDetailsResponse = {
  ok: boolean;
  organizer: AdminOrganizerDetailRecord;
  organization_id: string;
  completed_services_count: number;
  total_earnings_estimated: number;
  services_offered: AdminOrganizerServiceOffered[];
  team_members?: AdminOrganizerTeamMember[];
  gallery?: AdminOrganizerGalleryItem[];
};

export function fetchAdminOrganizerDetailsById(organizerId: string) {
  return callEdgeFunctionGet<AdminOrganizerDetailsResponse>('admin_get_organizer_detailsbyId', {
    organizer_id: organizerId,
  });
}

export type AdminVerifyOrganizationResponse = {
  ok: boolean;
  organizer_id: string;
  /** API may return string e.g. `"true"` */
  isVerified: string;
};

/**
 * POST admin_verify_organization — approve (`isVerified: true`) or reject (`false`) pending verification.
 */
export async function adminVerifyOrganization(params: {
  organizer_id: string;
  isVerified: boolean;
}): Promise<AdminVerifyOrganizationResponse> {
  const res = await callEdgeFunction<AdminVerifyOrganizationResponse>('admin_verify_organization', {
    organizer_id: params.organizer_id,
    isVerified: params.isVerified,
  });
  if (!res.ok) {
    throw new Error('Could not update verification status.');
  }
  return res;
}

export type AdminChangeSuspensionStatusResponse = {
  ok: boolean;
};

/**
 * POST admin_change_suspension_status — suspend (`isActive: false` + `message`) or activate (`isActive: true`).
 */
export async function adminChangeSuspensionStatus(params: {
  organizer_id: string;
  isActive: boolean;
  /** Shown when suspending; defaults if omitted. */
  message?: string;
}): Promise<AdminChangeSuspensionStatusResponse> {
  if (params.isActive) {
    const res = await callEdgeFunction<AdminChangeSuspensionStatusResponse>(
      'admin_change_suspension_status',
      {
        organizer_id: params.organizer_id,
        isActive: true,
      },
    );
    if (!res.ok) {
      throw new Error('Could not activate organization.');
    }
    return res;
  }

  const message = params.message?.trim() || 'Admin action';
  const res = await callEdgeFunction<AdminChangeSuspensionStatusResponse>(
    'admin_change_suspension_status',
    {
      organizer_id: params.organizer_id,
      isActive: false,
      message,
    },
  );
  if (!res.ok) {
    throw new Error('Could not suspend organization.');
  }
  return res;
}
