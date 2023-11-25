import { CircularProgress, Typography } from '@mui/material';

function LoadingTypography() {
  return (
    <Typography variant="h3" textAlign={'center'}>
      Ładowanie... <CircularProgress></CircularProgress>
    </Typography>
  );
}

export default LoadingTypography;
