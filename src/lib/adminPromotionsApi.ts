import { callEdgeFunctionGet } from './edgeFunctions';

export type AdminPromotion = {
  id: number;
  code: string;
  name: string;
  description: string;
  duration_days: number;
  weekly_price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminPromotionsResponse = {
  ok: boolean;
  promotions: AdminPromotion[];
};

export type PromotionBoughtRow = {
  organization_id: string;
  /** Profile route uses organizer id (`/users/organizers/:id`). */
  organizer_id?: string;
  organization_name: string;
  organization_full_name: string;
  boost_price: number;
  boost_name: string;
  purchased_at: string;
};

export type AdminPromotionsBoughtResponse = {
  ok: boolean;
  promotions_bought: PromotionBoughtRow[];
};

export function fetchAdminPromotions() {
  return callEdgeFunctionGet<AdminPromotionsResponse>('admin_get_promotions', {});
}

export function fetchAdminPromotionsBought(params: { search?: string }) {
  return callEdgeFunctionGet<AdminPromotionsBoughtResponse>('admin_get_promotions_bought', {
    search: params.search,
  });
}
