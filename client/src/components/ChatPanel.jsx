import { useState, useRef, useEffect } from 'react';
import {
  Drawer, Box, Typography, TextField, IconButton, Stack, Button, Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ChatMessage from './ChatMessage';
import { useChat } from '../hooks/useChat';

const DRAWER_WIDTH = 400;

export default function ChatPanel({ open, onClose, problemContext }) {
  const { messages, streaming, send, clear } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');
    send(text, problemContext);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" p={2}>
          <Typography variant="h6">AI Assistant</Typography>
          <Button
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={clear}
            disabled={streaming}
          >
            New Chat
          </Button>
        </Stack>
        <Divider />

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 && (
            <Box color="text.secondary" textAlign="center" mt={4}>
              <Typography variant="body2">
                Ask me anything about the current problem!
              </Typography>
              <Typography variant="caption" display="block" mt={1}>
                I can explain approaches, optimize solutions, or discuss time/space complexity.
              </Typography>
            </Box>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          <div ref={bottomRef} />
        </Box>

        {/* Input */}
        <Divider />
        <Stack direction="row" spacing={1} p={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask about this problem..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            multiline
            maxRows={3}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={streaming || !input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </Drawer>
  );
}
