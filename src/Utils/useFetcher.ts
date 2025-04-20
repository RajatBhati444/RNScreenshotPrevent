import {useState, useCallback} from 'react';

type FetcherResponse<T> = {
  data: T | null;
  error: string | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
  isLoading: boolean;
};

function useFetcher<T>(): FetcherResponse<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    try {
      setIsLoading(true);
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
      setIsLoading(false);
      if (!res.ok) {
        const errMsg = `Request failed with status ${res.status}`;
        throw new Error(errMsg);
      }

      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setData(null);
      setError(err?.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    error,
    fetchData,
    isLoading,
  };
}

export default useFetcher;
