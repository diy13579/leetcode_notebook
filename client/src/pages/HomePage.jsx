import { useState } from 'react';
import {
  Box, TextField, MenuItem, Stack, Button, Typography,
  CircularProgress, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useProblems } from '../hooks/useProblems';
import ProblemCard from '../components/ProblemCard';
import ProblemForm from '../components/ProblemForm';
import ConfirmDialog from '../components/ConfirmDialog';

const DIFFICULTIES = ['', 'Easy', 'Medium', 'Hard'];

export default function HomePage() {
  const { problems, loading, error, filters, setFilters, create, remove } = useProblems();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleCreate = async (data) => {
    await create(data);
  };

  return (
    <Box maxWidth={800} mx="auto">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Problems</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Add Problem
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          size="small"
          placeholder="Search by title, number, or tag..."
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          size="small"
          value={filters.difficulty}
          onChange={e => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
          sx={{ minWidth: 130 }}
          label="Difficulty"
        >
          {DIFFICULTIES.map(d => (
            <MenuItem key={d} value={d}>{d || 'All'}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      ) : problems.length === 0 ? (
        <Box textAlign="center" py={6} color="text.secondary">
          <Typography variant="h6">No problems yet</Typography>
          <Typography variant="body2" mt={1}>
            Click "Add Problem" to get started!
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {problems.map(p => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </Stack>
      )}

      <ProblemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Problem"
        message="Are you sure you want to delete this problem? This cannot be undone."
        onConfirm={async () => {
          await remove(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
