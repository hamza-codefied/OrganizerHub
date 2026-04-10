import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminPromotionsBought,
  type AdminPromotionsBoughtResponse,
} from '../lib/adminPromotionsApi';

export function useAdminPromotionsBought(search: string) {
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const [data, setData] = useState<AdminPromotionsBoughtResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminPromotionsBought({
        search: debouncedSearch || undefined,
      });
      if (!res.ok) {
        setData(null);
        setError('Active promotions request failed.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load active promotions.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
