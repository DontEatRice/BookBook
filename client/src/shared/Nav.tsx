import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

function Nav() {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', bgcolor: theme.palette.secondary.main }} component="nav" m={1}>
      <Tabs aria-label="nav tabs example" centered>
        <NavItem label="Strona główna" link="/" />
        <NavItem label="Ranking" link="/ranking" />
        <NavItem label="Test" link="/" />
        <NavItem label="Testunio" link="/" />
      </Tabs>
    </Box>
  
    /*
    <Box component="nav" m={1}>
      <Grid
        container
        p={1}
        justifyContent="space-evenly"
        sx={{ backgroundColor: theme.palette.secondary.main}}>
        <Grid item>
          <NavItem label="Strona główna" link="/" />
        </Grid>
        <Grid item>
          <NavItem label="Ranking" link="/ranking" />
        </Grid>
        <Grid item>
          <NavItem label="test" link="" />
        </Grid>
        <Grid item>
          <NavItem label="test" link="" />
        </Grid>
        <Grid item>
          <NavItem label="test" link="" />
        </Grid>
      </Grid>
    </Box>
    */
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const theme = useTheme();
  return (
    <NavLink to={link} style={{ textDecoration: 'none' }}>
      <Box
        sx={{ backgroundColor: theme.palette.secondary.main, p: 1, '&:hover': { backgroundColor: 'orange' }, width: 200}}
        color={theme.palette.text.primary}>
        <Typography variant="h6" align="center">{label}</Typography>
      </Box>
    </NavLink>
  );
}

export default Nav;
