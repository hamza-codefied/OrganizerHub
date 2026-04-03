import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminHomeOwnerById,
  type AdminHomeOwnerDetailsResponse,
} from '../lib/adminHomeOwnersApi';

export function useAdminHomeOwnerDetails(homeOwnerId: string | undefined) {
  const [data, setData] = useState<AdminHomeOwnerDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(homeOwnerId));

  const load = useCallback(async () => {
    if (!homeOwnerId) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminHomeOwnerById(homeOwnerId);
      if (!res.ok) {
        setData(null);
        setError('Could not load home owner details.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load home owner details.');
    } finally {
      setIsLoading(false);
    }
  }, [homeOwnerId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
