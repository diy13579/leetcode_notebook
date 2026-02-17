import { useState } from 'react';
import { Stack, TextField, Button, CircularProgress, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useLeetcodeFetch } from '../hooks/useLeetcodeFetch';

export default function FetchButton({ onFetched }) {
  const [input, setInput] = useState('');
  const { fetchProblem, loading, error } = useLeetcodeFetch();

  const handleFetch = async () => {
    if (!input.trim()) return;
    const data = await fetchProblem(input.trim());
    if (data) onFetched?.(data);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          placeholder="Problem # or slug (e.g. 1 or two-sum)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFetch()}
          sx={{ minWidth: 280 }}
        />
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
          onClick={handleFetch}
          disabled={loading || !input.trim()}
        >
          Fetch
        </Button>
      </Stack>
      {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}
    </Stack>
  );
}
