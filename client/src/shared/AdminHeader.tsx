import { Box, Grid, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthorizedView from '../components/auth/AuthorizedView';
import { useAuth } from '../utils/auth/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import NotAuthorizedView from '../components/auth/NotAuthorizedView';

function AdminHeader() {
  const { logout } = useAuth();
  const theme = useTheme();
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        fontSize: '1.5rem',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(2),
        zIndex: 10,
      }}>
      <Grid container justifyContent={'space-between'}>
        <Grid item>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Typography
              sx={{ display: 'inline', backgroundColor: theme.palette.primary.light, p: 1 }}
              variant="h5">
              BookBook Admin
            </Typography>
          </Link>
          <AuthorizedView>
            <NavItem label="Autorzy" link="/admin/authors" />
            <NavItem label="Książki" link="/admin/books" />
            <NavItem label="Kategorie" link="/admin/categories" />
            <NavItem label="Wydawcy" link="/admin/publishers" />
            <NavItem label="Biblioteki" link="/admin/libraries" />
            <NavItem label="Oferta" link="/admin/booksInLibrary" />
            <NavItem label="Rezerwacje" link="/admin/reservations" />
            <NavItem label="Dodaj pracownika" link="/admin/add-employee" />
          </AuthorizedView>
        </Grid>
        <Grid item onClick={() => logout()}>
          <AuthorizedView>
            <Tooltip title="Wyloguj się">
              <Box
                sx={{
                  cursor: 'pointer',
                }}>
                <LogoutIcon sx={{ fontSize: '2rem' }} />
              </Box>
            </Tooltip>
          </AuthorizedView>
          <NotAuthorizedView>
            <Link to={'login'} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Tooltip title="Logowanie">
                <LoginIcon sx={{ fontSize: '2rem' }} />
              </Tooltip>
            </Link>
          </NotAuthorizedView>
        </Grid>
      </Grid>
    </header>
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  if (!link.startsWith('/admin')) {
    link = link.startsWith('/') ? '/admin' + link : '/admin/' + link;
  }
  return (
    <NavLink
      to={link}
      style={({ isActive }) => {
        return {
          textDecoration: 'none',
          display: 'inline',
          marginLeft: theme.spacing(3),
          padding: theme.spacing(1),
          backgroundColor: theme.palette.grey[400],
          border: isActive || hover ? '2px solid black' : '2px solid transparent',
        };
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div style={{ display: 'inline-block', fontFamily: theme.typography.fontFamily }}>{label}</div>
    </NavLink>
  );
}

export default AdminHeader;
