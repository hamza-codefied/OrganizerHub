import { supabase } from './supabase';

const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}`;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function callEdgeFunctionGet<TResponse>(
  functionName: string,
  searchParams: Record<string, string | undefined>,
): Promise<TResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) {
    throw new Error('No access token found. Please login again.');
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== '') {
      params.set(key, value);
    }
  }

  const query = params.toString();
  const url = `${baseUrl}/functions/v1/${functionName}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    if (body && typeof body === 'object') {
      const err = body as { error?: string; message?: string };
      if (err.error) message = err.error;
      else if (err.message) message = err.message;
    }
    throw new Error(message);
  }

  return body as TResponse;
}

type MemberPermissionsPayload = {
  organization_member_id: string;
  can_view_earnings: boolean;
  can_manage_services: boolean;
  can_manage_business_info: boolean;
  can_manage_team: boolean;
};

type AssignMemberServicesPayload = {
  organization_member_id: string;
  organizer_service_ids: string[];
};

type DeactivateProfilePayload = {
  target_profile_id: string;
  reason: string;
};

type ActivateSubscriptionPayload = {
  organization_id: string;
  plan_slug: 'standard' | 'premium';
  billing_cycle: 'monthly' | 'yearly';
  provider: string;
  provider_subscription_id: string;
};

type ActivateBoostPayload = {
  organization_id: string;
  boost_code: string;
  source: string;
};

export async function callEdgeFunction<TResponse>(
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<TResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) {
    throw new Error('No access token found. Please login again.');
  }

  const response = await fetch(`${baseUrl}/functions/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      apikey: anonKey,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    let message = `Edge function call failed: ${response.status}`;
    if (body && typeof body === 'object') {
      const err = body as { error?: string; message?: string };
      if (err.error) message = err.error;
      else if (err.message) message = err.message;
    }
    throw new Error(message);
  }

  return body as TResponse;
}

export function adminSetMemberPermissions(payload: MemberPermissionsPayload) {
  return callEdgeFunction('admin_set_member_permissions', payload);
}

export function adminAssignMemberServices(payload: AssignMemberServicesPayload) {
  return callEdgeFunction('admin_assign_member_services', payload);
}

export function adminDeactivateProfile(payload: DeactivateProfilePayload) {
  return callEdgeFunction('admin_deactivate_profile', payload);
}

export function organizerActivateSubscription(payload: ActivateSubscriptionPayload) {
  return callEdgeFunction('organizer_activate_subscription', payload);
}

export function organizerActivateBoost(payload: ActivateBoostPayload) {
  return callEdgeFunction('organizer_activate_boost', payload);
}
