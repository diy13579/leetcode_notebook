import { Chip } from '@mui/material';

const colors = {
  Easy: '#2cbb5d',
  Medium: '#ffa116',
  Hard: '#ef4743',
};

export default function DifficultyChip({ difficulty, ...props }) {
  return (
    <Chip
      label={difficulty}
      size="small"
      sx={{
        bgcolor: colors[difficulty] || '#888',
        color: '#fff',
        fontWeight: 600,
      }}
      {...props}
    />
  );
}
