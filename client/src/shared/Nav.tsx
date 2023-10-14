import * as React from 'react';
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
    <Box sx={{ width: '100%', bgcolor: theme.palette.secondary.main }} component="nav" m={0}>
      <Tabs aria-label="nav tabs example" centered>
        <NavItem label="Strona główna" link="/"/>
        <NavItem label="Ranking" link="/ranking" />
        <NavItem label="Test" link="/test1" />
        <NavItem label="Testunio" link="/test2" />
      </Tabs>
    </Box>
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const theme = useTheme();
  return (
    <NavLink to={link} style={{ textDecoration: 'none', color: theme.palette.secondary.dark}}>
      <Box
        sx={{ p: 1, '&:hover': { backgroundColor: 'darkOrange'}}}
        >
      <Typography variant="h6" align="center" fontFamily='Lato'>{label}</Typography>
      </Box>
    </NavLink>
  );
}

export default Nav;
