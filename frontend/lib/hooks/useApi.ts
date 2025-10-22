/**
 * API Hooks
 * React hooks for API calls with loading, error, and data state management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '../api';

// ============================================================================
// Types
// ============================================================================

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

export interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  loading: boolean;
  error: string | null;
  data: T | null;
  reset: () => void;
}

// ============================================================================
// useApi Hook
// ============================================================================

/**
 * Generic hook for fetching data from API
 *
 * @example
 * const { data, loading, error, refetch } = useApi(
 *   () => api.knowledge.stats.get()
 * );
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState({ data: null, loading: false, error: errorMessage });
      console.error('[useApi] Error:', errorMessage, err);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
}

// ============================================================================
// useMutation Hook
// ============================================================================

/**
 * Hook for mutating data (POST, PUT, DELETE)
 *
 * @example
 * const { mutate, loading, error } = useMutation(
 *   (data) => api.knowledge.knowledge.create(data)
 * );
 *
 * await mutate({ title: '...', content: '...' });
 */
export function useMutation<T, V = void>(
  mutator: (variables: V) => Promise<T>
): UseMutationReturn<T, V> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(
    async (variables: V): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutator(variables);
        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
        console.error('[useMutation] Error:', errorMessage, err);
        return null;
      }
    },
    [mutator]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
}

// ============================================================================
// usePagination Hook
// ============================================================================

export interface UsePaginationOptions<T> {
  initialPage?: number;
  initialPageSize?: number;
  fetcher: (page: number, pageSize: number) => Promise<{
    items: T[];
    total: number;
    total_pages: number;
  }>;
}

export interface UsePaginationReturn<T> extends UseApiState<T[]> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook for paginated data
 *
 * @example
 * const { data, page, totalPages, goToPage, nextPage, prevPage } = usePagination({
 *   fetcher: (page, pageSize) => api.knowledge.knowledge.list({ page, page_size: pageSize })
 * });
 */
export function usePagination<T>(
  options: UsePaginationOptions<T>
): UsePaginationReturn<T> {
  const { initialPage = 1, initialPageSize = 20, fetcher } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [state, setState] = useState<UseApiState<T[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetcher(page, pageSize);
      setState({
        data: response.items,
        loading: false,
        error: null,
      });
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState({ data: null, loading: false, error: errorMessage });
      console.error('[usePagination] Error:', errorMessage, err);
    }
  }, [page, pageSize, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    ...state,
    data: state.data || [],
    page,
    pageSize,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchData,
  };
}
