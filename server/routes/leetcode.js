import { Router } from 'express';
import { fetchLeetCodeProblem } from '../utils/leetcodeApi.js';

const router = Router();

// POST /api/leetcode/fetch
// Body: { input: "1" | "two-sum" }
router.post('/fetch', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'Missing input (problem number or slug)' });
    }
    const problem = await fetchLeetCodeProblem(input);
    res.json(problem);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
