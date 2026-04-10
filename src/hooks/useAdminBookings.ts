import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { fetchAdminBookings, type AdminBookingsResponse } from '../lib/adminBookingsApi';

function dateRangeToQuery(range: DateRange | undefined) {
  if (!range?.from) {
    return { start_date: undefined as string | undefined, end_date: undefined as string | undefined };
  }
  const start_date = format(range.from, 'yyyy-MM-dd');
  const end = range.to ?? range.from;
  const end_date = format(end, 'yyyy-MM-dd');
  return { start_date, end_date };
}

export function useAdminBookings(params: {
  search: string;
  dateRange: DateRange | undefined;
}) {
  const [debouncedSearch, setDebouncedSearch] = useState(params.search.trim());

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(params.search.trim()), 400);
    return () => clearTimeout(t);
  }, [params.search]);

  const [data, setData] = useState<AdminBookingsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { start_date, end_date } = dateRangeToQuery(params.dateRange);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminBookings({
        search: debouncedSearch || undefined,
        start_date,
        end_date,
      });
      if (!res.ok) {
        setData(null);
        setError('Bookings request failed.');
        return;
      }
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, start_date, end_date]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
