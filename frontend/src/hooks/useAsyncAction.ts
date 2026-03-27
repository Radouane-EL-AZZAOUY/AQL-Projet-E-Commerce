import { useState } from 'react';

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function run<T>(action: () => Promise<T>, mapError: (err: unknown) => string = (err) => (err instanceof Error ? err.message : 'Erreur')): Promise<T | undefined> {
    setError('');
    setLoading(true);
    try {
      return await action();
    } catch (err) {
      setError(mapError(err));
      return undefined;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, setError, run };
}
