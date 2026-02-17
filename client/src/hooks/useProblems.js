import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/problems';

export function useProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', difficulty: '' });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchProblems(filters);
      setProblems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const create = async (data) => {
    const created = await api.createProblem(data);
    await load();
    return created;
  };

  const remove = async (id) => {
    await api.deleteProblem(id);
    await load();
  };

  return { problems, loading, error, filters, setFilters, reload: load, create, remove };
}

export function useProblem(id) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchProblem(id);
      setProblem(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const update = async (data) => {
    const updated = await api.updateProblem(id, data);
    setProblem(updated);
    return updated;
  };

  return { problem, loading, error, update, reload: load };
}
