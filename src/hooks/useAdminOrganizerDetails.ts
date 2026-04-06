import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminOrganizerDetailsById,
  type AdminOrganizerDetailsResponse,
} from '../lib/adminOrganizersApi';

export function useAdminOrganizerDetails(organizerId: string | undefined) {
  const [data, setData] = useState<AdminOrganizerDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!organizerId);

  const load = useCallback(async () => {
    if (!organizerId?.trim()) {
      setData(null);
      setError('Missing organizer id.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminOrganizerDetailsById(organizerId.trim());
      if (!res.ok || !res.organizer) {
        setData(null);
        setError('Organizer not found.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load organizer.');
    } finally {
      setIsLoading(false);
    }
  }, [organizerId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
