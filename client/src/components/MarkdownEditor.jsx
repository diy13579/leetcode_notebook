import { useState } from 'react';
import { Box, TextField, Tabs, Tab } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownEditor({ value, onChange }) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
        <Tab label="Edit" />
        <Tab label="Preview" />
      </Tabs>
      {tab === 0 ? (
        <TextField
          multiline
          minRows={10}
          maxRows={30}
          fullWidth
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your thoughts in Markdown..."
        />
      ) : (
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            minHeight: 200,
            '& pre': {
              bgcolor: '#282c34',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
            },
            '& code': {
              fontFamily: 'monospace',
              fontSize: 14,
            },
            '& a': { color: 'primary.main' },
          }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <Box color="text.secondary" fontStyle="italic">Nothing to preview</Box>
          )}
        </Box>
      )}
    </Box>
  );
}
