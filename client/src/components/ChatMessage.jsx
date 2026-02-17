import { Box, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 2,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>
      <Box
        sx={{
          maxWidth: '85%',
          p: 1.5,
          borderRadius: 2,
          bgcolor: isUser ? 'rgba(255, 161, 22, 0.12)' : 'rgba(44, 187, 93, 0.08)',
          '& pre': {
            bgcolor: '#282c34',
            p: 1.5,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: 13,
          },
          '& code': {
            fontFamily: 'monospace',
            fontSize: 13,
          },
          '& p': { m: 0, mb: 0.5 },
          '& p:last-child': { mb: 0 },
        }}
      >
        {isUser ? (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        ) : (
          <Box sx={{ fontSize: 14 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || '...'}
            </ReactMarkdown>
          </Box>
        )}
      </Box>
    </Box>
  );
}
