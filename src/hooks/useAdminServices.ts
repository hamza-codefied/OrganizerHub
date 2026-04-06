import { useCallback, useEffect, useState } from 'react';
import { fetchAdminServices, type AdminServicesResponse } from '../lib/adminServicesApi';

export function useAdminServices() {
  const [data, setData] = useState<AdminServicesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminServices();
      if (!res.ok) {
        setData(null);
        setError('Could not load services catalog.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load services.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
