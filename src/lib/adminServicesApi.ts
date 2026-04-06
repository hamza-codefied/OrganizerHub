import { callEdgeFunction, callEdgeFunctionGet } from './edgeFunctions';

export type AdminServiceCatalogItem = {
  id: number;
  category_id: number;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export type AdminServiceCategory = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  services: AdminServiceCatalogItem[];
};

export type AdminServicesResponse = {
  ok: boolean;
  categories: AdminServiceCategory[];
};

export type AdminCreateCategoryPayload = {
  name: string;
};

export type AdminCreateCategoryResponse = {
  name: string;
  cat_id: number;
  ok?: boolean;
  error?: string;
  message?: string;
};

export type AdminCreateServicePayload = {
  cat_id: number;
  service_name: string;
  service_description: string;
};

export type AdminCreateServiceResponse = {
  cat_id: number;
  service_id: number;
  service_name: string;
  service_description: string;
  cat_name: string;
  ok?: boolean;
  error?: string;
  message?: string;
};

export type AdminDeleteServicePayload = {
  service_id: number;
  category_id: number;
};

export type AdminDeleteServiceResponse = {
  ok: boolean;
  deleted_service_id: number;
  category_id: number;
  active_usage_count: number;
  error?: string;
  message?: string;
};

export type AdminDeleteCategoryPayload = {
  category_id: number;
};

export type AdminDeleteCategoryResponse = {
  ok: boolean;
  deleted_category_id: number;
  services_count: number;
  error?: string;
  message?: string;
};

function throwIfBodyOkFalse<T extends { ok?: boolean; error?: string; message?: string }>(body: T): T {
  if (body && typeof body === 'object' && body.ok === false) {
    throw new Error(body.error ?? body.message ?? 'Request failed.');
  }
  return body;
}

/**
 * GET admin_get_services — all categories and nested services.
 */
export function fetchAdminServices() {
  return callEdgeFunctionGet<AdminServicesResponse>('admin_get_services', {});
}

/**
 * POST admin_create_category — create a category (payload: `{ name }`).
 */
export async function adminCreateCategory(payload: AdminCreateCategoryPayload) {
  const body = await callEdgeFunction<AdminCreateCategoryResponse>('admin_create_category', {
    name: payload.name,
  });
  return throwIfBodyOkFalse(body);
}

/**
 * POST admin_create_services — create a service under a category.
 */
export async function adminCreateService(payload: AdminCreateServicePayload) {
  const body = await callEdgeFunction<AdminCreateServiceResponse>('admin_create_services', {
    cat_id: payload.cat_id,
    service_name: payload.service_name,
    service_description: payload.service_description,
  });
  return throwIfBodyOkFalse(body);
}

/**
 * POST admin_delete_service — remove a service from a category.
 */
export async function adminDeleteService(payload: AdminDeleteServicePayload) {
  const body = await callEdgeFunction<AdminDeleteServiceResponse>('admin_delete_service', {
    service_id: payload.service_id,
    category_id: payload.category_id,
  });
  return throwIfBodyOkFalse(body);
}

/**
 * POST admin_delete_category — remove an empty category (no services).
 */
export async function adminDeleteCategory(payload: AdminDeleteCategoryPayload) {
  const body = await callEdgeFunction<AdminDeleteCategoryResponse>('admin_delete_category', {
    category_id: payload.category_id,
  });
  return throwIfBodyOkFalse(body);
}
