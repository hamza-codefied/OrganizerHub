import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminHomeOwners,
  type AdminHomeOwnersListResponse,
  type HomeOwnersRange,
} from '../lib/adminHomeOwnersApi';

export function useAdminHomeOwners(range: HomeOwnersRange) {
  const [data, setData] = useState<AdminHomeOwnersListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminHomeOwners(range);
      if (!res.ok) {
        setData(null);
        setError('Home owners request failed.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load home owners.');
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
