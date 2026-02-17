import { useState, useCallback } from 'react';
import { fetchFromLeetCode } from '../api/leetcode';

export function useLeetcodeFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProblem = useCallback(async (input) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromLeetCode(input);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchProblem, loading, error };
}
