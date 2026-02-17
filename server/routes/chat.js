import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// POST /api/chat  (SSE streaming)
// Body: { messages: [{role, content}], problemContext?: {title, question, mySolution} }
router.post('/', async (req, res) => {
  const { messages, problemContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  let systemPrompt = 'You are a helpful coding assistant specialized in LeetCode problems and algorithm challenges. Provide clear, concise explanations. Use markdown for formatting and code blocks with language tags.';

  if (problemContext) {
    systemPrompt += `\n\nThe user is currently working on the following LeetCode problem:\n`;
    if (problemContext.title) systemPrompt += `Title: ${problemContext.title}\n`;
    if (problemContext.question) {
      // Strip HTML tags for the system prompt
      const plainText = problemContext.question.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      systemPrompt += `Description: ${plainText.slice(0, 3000)}\n`;
    }
    if (problemContext.mySolution) {
      systemPrompt += `\nUser's current solution:\n\`\`\`\n${problemContext.mySolution.slice(0, 3000)}\n\`\`\`\n`;
    }
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  try {
    const client = getClient();
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// POST /api/chat/generate-solution (non-streaming)
// Body: { question, language }
router.post('/generate-solution', async (req, res) => {
  const { question, language = 'python' } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: 'You are a LeetCode expert. Given a problem, provide the optimal solution. Return ONLY the code without any explanation, markdown formatting, or code block delimiters.',
      messages: [
        {
          role: 'user',
          content: `Solve this LeetCode problem in ${language}. Return only the code.\n\nProblem:\n${question.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000)}`,
        },
      ],
    });

    const code = response.content[0]?.text || '';
    res.json({ code, language });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
