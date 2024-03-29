import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import AuthorizedView from '../components/auth/AuthorizedView';
import Flex from '@mui/material/Grid';

function Nav() {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', bgcolor: theme.palette.secondary.main, marginBottom: 3 }} component="nav">
      <Flex justifyContent="center" display={'flex'}>
        <NavItem label="Strona główna" link="/" />
        <NavItem label="Książki" link="/books" />
        <NavItem label="Autorzy" link="/authors" />
        <AuthorizedView roles={['User']}>
          <NavItem label="Rezerwacje" link="/reservations" />
          <NavItem label="Do przeczytania" link="/user-books" />
          <NavItem label="Feed" link="/feed" />
        </AuthorizedView>
        <NavItem label="Ranking" link="/ranking" />
      </Flex>
    </Box>
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const theme = useTheme();
  return (
    <NavLink
      to={link}
      style={({ isActive }) => ({
        marginRight: 10,
        textDecoration: 'none',
        color: theme.palette.secondary.dark,
        backgroundColor: isActive ? 'darkOrange' : 'transparent',
        borderRadius: isActive ? 4 : 0,
      })}>
      <Box sx={{ p: 1, '&:hover': { backgroundColor: 'darkOrange', borderRadius: 1 } }}>
        <Typography variant="h6" align="center">
          {label}
        </Typography>
      </Box>
    </NavLink>
  );
}

export default Nav;
