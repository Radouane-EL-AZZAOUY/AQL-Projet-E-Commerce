import { useEffect, useState, type DependencyList, type Dispatch, type SetStateAction } from 'react';

interface AsyncDataState<T> {
  data: T;
  loading: boolean;
  error: string;
  setData: Dispatch<SetStateAction<T>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useAsyncData<T>(
  initialData: T,
  loader: () => Promise<T>,
  deps: DependencyList,
  mapError: (err: unknown) => string = (err) => (err instanceof Error ? err.message : 'Erreur')
): AsyncDataState<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    loader()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(mapError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, setData, setError };
}
