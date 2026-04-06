import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminOrganizers,
  type AdminOrganizersListResponse,
  type OrganizersRange,
} from '../lib/adminOrganizersApi';

export function useAdminOrganizers(params: {
  range: OrganizersRange;
  /** Raw search input; debounced inside the hook before requesting. */
  search: string;
  /** Selected category id as string, or undefined for all. */
  categoryId: string | undefined;
}) {
  const [debouncedSearch, setDebouncedSearch] = useState(params.search.trim());

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(params.search.trim()), 400);
    return () => clearTimeout(t);
  }, [params.search]);

  const [data, setData] = useState<AdminOrganizersListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminOrganizers({
        range: params.range,
        search: debouncedSearch || undefined,
        category_id: params.categoryId,
      });
      if (!res.ok) {
        setData(null);
        setError('Organizers request failed.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load organizers.');
    } finally {
      setIsLoading(false);
    }
  }, [params.range, debouncedSearch, params.categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
