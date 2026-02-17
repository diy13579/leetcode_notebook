import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Stack, Chip, Box, Typography,
} from '@mui/material';
import FetchButton from './FetchButton';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function ProblemForm({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    number: '',
    title: '',
    difficulty: 'Easy',
    tags: [],
    question: '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleFetched = (data) => {
    setForm(prev => ({
      ...prev,
      number: data.number || prev.number,
      title: data.title || prev.title,
      difficulty: data.difficulty || prev.difficulty,
      tags: data.tags || prev.tags,
      question: data.question || prev.question,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      number: form.number ? parseInt(form.number, 10) : null,
    });
    setForm({ number: '', title: '', difficulty: 'Easy', tags: [], question: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Problem</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Auto-fetch from LeetCode
          </Typography>
          <FetchButton onFetched={handleFetched} />

          <TextField
            label="Problem Number"
            type="number"
            value={form.number}
            onChange={handleChange('number')}
            size="small"
          />
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            size="small"
            required
          />
          <TextField
            label="Difficulty"
            select
            value={form.difficulty}
            onChange={handleChange('difficulty')}
            size="small"
          >
            {DIFFICULTIES.map(d => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </TextField>

          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Add Tag"
                size="small"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button onClick={addTag} size="small" variant="outlined">Add</Button>
            </Stack>
            {form.tags.length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {form.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => removeTag(tag)} />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.title}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
