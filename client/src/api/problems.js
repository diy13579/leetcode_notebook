const BASE = '/api/problems';

export async function fetchProblems({ search, difficulty } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (difficulty) params.set('difficulty', difficulty);
  const url = params.toString() ? `${BASE}?${params}` : BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch problems');
  return res.json();
}

export async function fetchProblem(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch problem');
  return res.json();
}

export async function createProblem(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create problem');
  return res.json();
}

export async function updateProblem(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update problem');
  return res.json();
}

export async function deleteProblem(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete problem');
}
