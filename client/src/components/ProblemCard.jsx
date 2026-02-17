import { Card, CardActionArea, CardContent, Typography, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DifficultyChip from './DifficultyChip';

export default function ProblemCard({ problem }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.2s' }}>
      <CardActionArea onClick={() => navigate(`/problem/${problem.id}`)}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              #{problem.number}
            </Typography>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {problem.title}
            </Typography>
            <DifficultyChip difficulty={problem.difficulty} />
          </Stack>
          {problem.tags?.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {problem.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
