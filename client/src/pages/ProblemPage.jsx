import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Tabs, Tab, Stack, Button, CircularProgress,
  Alert, IconButton, Chip, Tooltip, Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DOMPurify from 'dompurify';
import { useProblem } from '../hooks/useProblems';
import DifficultyChip from '../components/DifficultyChip';
import CodeBlock from '../components/CodeBlock';
import CodeEditor from '../components/CodeEditor';
import MarkdownEditor from '../components/MarkdownEditor';
import FetchButton from '../components/FetchButton';
import ConfirmDialog from '../components/ConfirmDialog';
import { deleteProblem } from '../api/problems';
import { generateSolution } from '../api/chat';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { problem, loading, error, update, reload } = useProblem(id);

  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snack, setSnack] = useState('');
  const [generating, setGenerating] = useState(false);

  if (loading) {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !problem) {
    return <Alert severity="error">{error || 'Problem not found'}</Alert>;
  }

  const startEdit = () => {
    setDraft({
      question: problem.question,
      mySolution: problem.mySolution,
      mySolutionLanguage: problem.mySolutionLanguage,
      bestSolution: problem.bestSolution,
      bestSolutionLanguage: problem.bestSolutionLanguage,
      comments: problem.comments,
    });
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await update(draft);
      setEditing(false);
      setSnack('Saved!');
    } catch {
      setSnack('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleFetched = async (data) => {
    await update({
      question: data.question,
      number: data.number || problem.number,
      title: data.title || problem.title,
      difficulty: data.difficulty || problem.difficulty,
      tags: data.tags || problem.tags,
    });
    setSnack('Fetched from LeetCode!');
  };

  const handleGenerateSolution = async () => {
    if (!problem.question) {
      setSnack('Fetch the question first');
      return;
    }
    setGenerating(true);
    try {
      const { code, language } = await generateSolution({
        question: problem.question,
        language: draft.bestSolutionLanguage || problem.bestSolutionLanguage || 'python',
      });
      if (editing) {
        setDraft(prev => ({ ...prev, bestSolution: code, bestSolutionLanguage: language }));
      } else {
        await update({ bestSolution: code, bestSolutionLanguage: language });
      }
      setSnack('Solution generated!');
    } catch (err) {
      setSnack(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    await deleteProblem(id);
    navigate('/');
  };

  const currentData = editing ? { ...problem, ...draft } : problem;

  return (
    <Box maxWidth={900} mx="auto">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Typography variant="body1" color="text.secondary" fontWeight={700}>
          #{problem.number}
        </Typography>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>{problem.title}</Typography>
        <DifficultyChip difficulty={problem.difficulty} />
        <Tooltip title={editing ? 'Save' : 'Edit'}>
          <IconButton
            color="primary"
            onClick={editing ? save : startEdit}
            disabled={saving}
          >
            {editing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => setDeleteOpen(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Tags */}
      {problem.tags?.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap mb={2}>
          {problem.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
      )}

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Question" />
        <Tab label="My Solution" />
        <Tab label="Best Solution" />
        <Tab label="Comments" />
      </Tabs>

      {/* Question Tab */}
      <TabPanel value={tab} index={0}>
        <Stack spacing={2}>
          <FetchButton onFetched={handleFetched} />
          {currentData.question ? (
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                '& img': { maxWidth: '100%' },
                '& pre': {
                  bgcolor: '#282c34',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                },
                '& code': { fontFamily: 'monospace' },
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(currentData.question),
              }}
            />
          ) : (
            <Typography color="text.secondary" fontStyle="italic">
              No question loaded. Use the fetch button above to import from LeetCode.
            </Typography>
          )}
        </Stack>
      </TabPanel>

      {/* My Solution Tab */}
      <TabPanel value={tab} index={1}>
        {editing ? (
          <CodeEditor
            code={draft.mySolution}
            language={draft.mySolutionLanguage}
            onCodeChange={v => setDraft(prev => ({ ...prev, mySolution: v }))}
            onLanguageChange={v => setDraft(prev => ({ ...prev, mySolutionLanguage: v }))}
          />
        ) : (
          <CodeBlock
            code={currentData.mySolution}
            language={currentData.mySolutionLanguage}
          />
        )}
      </TabPanel>

      {/* Best Solution Tab */}
      <TabPanel value={tab} index={2}>
        <Stack direction="row" justifyContent="flex-end" mb={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={generating ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
            onClick={handleGenerateSolution}
            disabled={generating}
          >
            Generate with AI
          </Button>
        </Stack>
        {editing ? (
          <CodeEditor
            code={draft.bestSolution}
            language={draft.bestSolutionLanguage}
            onCodeChange={v => setDraft(prev => ({ ...prev, bestSolution: v }))}
            onLanguageChange={v => setDraft(prev => ({ ...prev, bestSolutionLanguage: v }))}
          />
        ) : (
          <CodeBlock
            code={currentData.bestSolution}
            language={currentData.bestSolutionLanguage}
          />
        )}
      </TabPanel>

      {/* Comments Tab */}
      <TabPanel value={tab} index={3}>
        {editing ? (
          <MarkdownEditor
            value={draft.comments}
            onChange={v => setDraft(prev => ({ ...prev, comments: v }))}
          />
        ) : currentData.comments ? (
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& pre': { bgcolor: '#282c34', p: 2, borderRadius: 1, overflow: 'auto' },
              '& code': { fontFamily: 'monospace' },
              '& a': { color: 'primary.main' },
            }}
          >
            {/* Render markdown for view mode */}
            <MarkdownView content={currentData.comments} />
          </Box>
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            No comments yet. Click edit to add your thoughts.
          </Typography>
        )}
      </TabPanel>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Problem"
        message={`Delete "${problem.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
      />
    </Box>
  );
}

// Small helper to render markdown in view mode without the editor tabs
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownView({ content }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
