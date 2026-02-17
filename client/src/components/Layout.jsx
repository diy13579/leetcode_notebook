import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import ChatPanel from './ChatPanel';

export default function Layout({ children }) {
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1, transition: 'margin 0.3s', mr: chatOpen ? '400px' : 0 }}>
        <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }} elevation={1}>
          <Toolbar>
            <Tooltip title="Home">
              <IconButton edge="start" color="primary" onClick={() => navigate('/')} sx={{ mr: 1 }}>
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, cursor: 'pointer', color: 'primary.main', fontWeight: 700 }}
              onClick={() => navigate('/')}
            >
              LeetCode Notebook
            </Typography>
            <Tooltip title="AI Chat">
              <IconButton color="primary" onClick={() => setChatOpen(prev => !prev)}>
                <SmartToyIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  );
}
