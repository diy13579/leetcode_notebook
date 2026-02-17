import { useState } from 'react';
import { Box, TextField, Tabs, Tab, MenuItem, Stack } from '@mui/material';
import CodeBlock from './CodeBlock';

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'sql',
];

export default function CodeEditor({ code, language, onCodeChange, onLanguageChange }) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} size="small">
          <Tab label="Edit" />
          <Tab label="Preview" />
        </Tabs>
        <TextField
          select
          size="small"
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {LANGUAGES.map(l => (
            <MenuItem key={l} value={l}>{l}</MenuItem>
          ))}
        </TextField>
      </Stack>
      {tab === 0 ? (
        <TextField
          multiline
          minRows={12}
          maxRows={30}
          fullWidth
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          placeholder="Paste your code here..."
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: 14,
            },
          }}
        />
      ) : (
        <CodeBlock code={code} language={language} showLanguageSelector={false} />
      )}
    </Box>
  );
}
