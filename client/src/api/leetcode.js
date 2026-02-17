export async function fetchFromLeetCode(input) {
  const res = await fetch('/api/leetcode/fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch from LeetCode');
  }
  return res.json();
}
