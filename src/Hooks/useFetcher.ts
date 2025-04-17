import {useState, useCallback} from 'react';

type FetcherResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
};

function useFetcher<T>(): FetcherResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    try {
      setIsLoading(true);
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      setData(json);
      setIsLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
  };
}

export default useFetcher;
