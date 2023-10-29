import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import AuthorizedView from '../components/auth/AuthorizedView';
import Flex from '@mui/material/Grid';

function Nav() {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', bgcolor: theme.palette.secondary.main }} component="nav">
      <Flex justifyContent="center" display={'flex'}>
        <NavItem label="Strona główna" link="/" />
        <NavItem label="Książki" link="/books" />
        <AuthorizedView>
          <NavItem label="Rezerwacje" link="/reservations" />
        </AuthorizedView>
        <NavItem label="Ranking" link="/ranking" />
      </Flex>
    </Box>
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const theme = useTheme();
  return (
    <NavLink to={link} style={{ textDecoration: 'none', color: theme.palette.secondary.dark }}>
      <Box sx={{ p: 1, '&:hover': { backgroundColor: 'darkOrange' } }}>
        <Typography variant="h6" align="center" fontFamily="Lato">
          {label}
        </Typography>
      </Box>
    </NavLink>
  );
}

export default Nav;

