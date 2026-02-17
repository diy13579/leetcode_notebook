import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readProblems, writeProblems } from '../utils/fileStore.js';

const router = Router();

// GET /api/problems - list all (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    let problems = await readProblems();
    const { search, difficulty } = req.query;

    if (difficulty) {
      problems = problems.filter(p => p.difficulty === difficulty);
    }
    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(q) ||
        String(p.number).includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by number ascending
    problems.sort((a, b) => (a.number || 0) - (b.number || 0));
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/problems/:id
router.get('/:id', async (req, res) => {
  try {
    const problems = await readProblems();
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) return res.status(404).json({ error: 'Not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/problems
router.post('/', async (req, res) => {
  try {
    const problems = await readProblems();
    const now = new Date().toISOString();
    const problem = {
      id: uuidv4(),
      number: req.body.number || null,
      title: req.body.title || 'Untitled',
      difficulty: req.body.difficulty || 'Easy',
      tags: req.body.tags || [],
      question: req.body.question || '',
      mySolution: req.body.mySolution || '',
      mySolutionLanguage: req.body.mySolutionLanguage || 'python',
      bestSolution: req.body.bestSolution || '',
      bestSolutionLanguage: req.body.bestSolutionLanguage || 'python',
      comments: req.body.comments || '',
      createdAt: now,
      updatedAt: now,
    };
    problems.push(problem);
    await writeProblems(problems);
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/problems/:id
router.put('/:id', async (req, res) => {
  try {
    const problems = await readProblems();
    const idx = problems.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const updatable = [
      'number', 'title', 'difficulty', 'tags', 'question',
      'mySolution', 'mySolutionLanguage', 'bestSolution',
      'bestSolutionLanguage', 'comments',
    ];
    for (const key of updatable) {
      if (req.body[key] !== undefined) {
        problems[idx][key] = req.body[key];
      }
    }
    problems[idx].updatedAt = new Date().toISOString();
    await writeProblems(problems);
    res.json(problems[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/problems/:id
router.delete('/:id', async (req, res) => {
  try {
    let problems = await readProblems();
    const idx = problems.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    problems.splice(idx, 1);
    await writeProblems(problems);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
