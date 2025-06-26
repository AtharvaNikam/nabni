import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

export default function AppProfileCompletionBar({ percent = 0 }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2">Profile Completion</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {percent}%
        </Typography>
        <Button size="small" onClick={() => navigate(paths.dashboard.user.profile)}>
          Complete Profile
        </Button>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 10,
          borderRadius: 5,
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: 'primary.main',
          },
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.grey[800],
        }}
      />
    </Box>
  );
}

AppProfileCompletionBar.propTypes = {
  percent: PropTypes.number.isRequired,
};
