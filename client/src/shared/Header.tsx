import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

function Header() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <header style={{ position: 'sticky', top: 0, left: 0 }}>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={1}>
          {matches && (
            <Grid item sm={3} xs={0} container justifyContent="center">
              <HeaderLogo />
            </Grid>
          )}
          <Grid item sm={6} xs={12}>
            <Box>Wyszukiwanie</Box>
          </Grid>
          {matches && (
            <Grid item sm={3} xs={0}>
              Profile itp
            </Grid>
          )}
        </Grid>
      </Box>
      <Nav />
    </header>
  );
}

function HeaderLogo() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Grid item m={1}>
      <Box
        p={2}
        textAlign="center"
        borderRadius={6}
        sx={{ backgroundColor: theme.palette.primary.main, display: 'inline-block', cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        <Typography variant="h4">
          <AutoStoriesIcon /> BookBook
        </Typography>
      </Box>
    </Grid>
  );
}

export default Header;
