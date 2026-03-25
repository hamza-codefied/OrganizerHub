import { supabase } from './supabase';

const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}`;

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

async function callEdgeFunction<TResponse>(
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

  // Supabase Edge Functions are served under `/functions/v1/<function-name>`
  const response = await fetch(`${baseUrl}/functions/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (body && (body.error || body.message)) ||
      `Edge function call failed: ${response.status}`;
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
