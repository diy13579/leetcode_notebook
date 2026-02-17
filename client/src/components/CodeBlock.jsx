import { useState } from 'react';
import { Box, MenuItem, TextField, Stack } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'sql',
];

export default function CodeBlock({ code, language = 'python', onLanguageChange, showLanguageSelector = true }) {
  return (
    <Box>
      {showLanguageSelector && onLanguageChange && (
        <Stack direction="row" justifyContent="flex-end" mb={1}>
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
      )}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          borderRadius: 8,
          fontSize: 14,
          margin: 0,
        }}
        showLineNumbers
      >
        {code || '// No code yet'}
      </SyntaxHighlighter>
    </Box>
  );
}
