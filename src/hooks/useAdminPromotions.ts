import { useCallback, useEffect, useState } from 'react';
import { fetchAdminPromotions, type AdminPromotionsResponse } from '../lib/adminPromotionsApi';

export function useAdminPromotions() {
  const [data, setData] = useState<AdminPromotionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminPromotions();
      if (!res.ok) {
        setData(null);
        setError('Promotions request failed.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load promotions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
