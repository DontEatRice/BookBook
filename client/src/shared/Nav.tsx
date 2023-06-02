import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

function Nav() {
  const theme = useTheme();
  return (
    <Box component="nav" m={2}>
      <Grid
        container
        p={1}
        justifyContent="space-evenly"
        sx={{ backgroundColor: theme.palette.secondary.main, borderRadius: 10 }}>
        <Grid item spacing={1}>
          <NavItem label="Strona główna" link="/" />
        </Grid>
        <Grid item spacing={1}>
          <NavItem label="Ranking" link="/ranking" />
        </Grid>
      </Grid>
    </Box>
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const theme = useTheme();
  return (
    <NavLink to={link} style={{ textDecoration: 'none' }}>
      <Box
        borderRadius={2}
        sx={{ backgroundColor: theme.palette.secondary.dark, p: 1, '&:hover': { backgroundColor: 'orange' } }}
        color={theme.palette.text.primary}>
        <Typography variant="h6">{label}</Typography>
      </Box>
    </NavLink>
  );
}

export default Nav;
