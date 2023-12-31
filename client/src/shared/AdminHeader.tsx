import { Box, Drawer, Grid, List, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthorizedView from '../components/auth/AuthorizedView';
import { useAuth } from '../utils/auth/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import NotAuthorizedView from '../components/auth/NotAuthorizedView';
import AdminProfileHeaderIcon from '../components/profile/AdminProfileHeaderIcon';
import MenuIcon from '@mui/icons-material/Menu';

function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();
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
        <Grid item xs={10}>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Typography
              sx={{ display: 'inline', backgroundColor: theme.palette.primary.main, p: 1, borderRadius: 2 }}
              variant="h5">
              BookBook Admin
            </Typography>
          </Link>
          {/* <AuthorizedView>
            <NavItem label="Autorzy" link="/admin/authors" />
            <NavItem label="Książki" link="/admin/books" />
            <NavItem label="Kategorie" link="/admin/categories" />
            <NavItem label="Wydawcy" link="/admin/publishers" />
            <NavItem label="Biblioteki" link="/admin/libraries" />
            <NavItem label="Oferta" link="/admin/booksInLibrary" />
            <NavItem label="Rezerwacje" link="/admin/reservations" />
            <NavItem label="Użytkownicy" link="/admin/users" />
            <NavItem label="Dodaj pracownika" link="/admin/add-employee" />
          </AuthorizedView> */}
        </Grid>
        <AuthorizedView>
          <Grid item paddingY={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <AdminHeaderMenu />
          </Grid>
          <Grid item paddingY={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <AdminProfileHeaderIcon />
          </Grid>
          <Grid
            item
            onClick={() => {
              logout();
              navigate('/admin');
            }}
            paddingY={2}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}>
            <Tooltip title="Wyloguj się">
              <Box
                sx={{
                  cursor: 'pointer',
                }}>
                <LogoutIcon sx={{ fontSize: '2rem' }} />
              </Box>
            </Tooltip>
          </Grid>
        </AuthorizedView>
        <NotAuthorizedView>
          <Link to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Tooltip title="Logowanie">
              <LoginIcon sx={{ fontSize: '2rem' }} />
            </Tooltip>
          </Link>
        </NotAuthorizedView>
      </Grid>
    </header>
  );
}

function AdminHeaderMenu() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <Box onClick={() => toggle()}>
      <Tooltip title="Menu">
        <MenuIcon sx={{ fontSize: '2rem', cursor: 'pointer' }} />
      </Tooltip>
      <Drawer anchor="right" open={open} onClose={() => toggle()}>
        <Box sx={{ width: '300px', p: 4 }} role="presentation">
          <Typography variant="h5" fontWeight={'bold'}>
            Menu
          </Typography>
          <Typography variant="body1" component="div">
            <List>
              <AuthorizedView roles={['Admin']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/authors'}>
                    <ListItemText disableTypography>Autorzy</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Admin']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/books'}>
                    <ListItemText disableTypography>Książki</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Admin']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/categories'}>
                    <ListItemText disableTypography>Kategorie</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Admin']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/libraries'}>
                    <ListItemText disableTypography>Biblioteki</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Employee']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/booksInLibrary'}>
                    <ListItemText disableTypography>Oferta</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Employee']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/reservations'}>
                    <ListItemText disableTypography>Rezerwacje</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Admin']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/users'}>
                    <ListItemText disableTypography>Użytkownicy</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
              <AuthorizedView roles={['Admin']}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={'/admin/add-employee'}>
                    <ListItemText disableTypography>Dodaj pracownika</ListItemText>
                  </ListItemButton>
                </ListItem>
              </AuthorizedView>
            </List>
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}

// function NavItem({ label, link }: { label: string; link: string }) {
//   const [hover, setHover] = useState(false);
//   const theme = useTheme();
//   if (!link.startsWith('/admin')) {
//     link = link.startsWith('/') ? '/admin' + link : '/admin/' + link;
//   }
//   return (
//     <NavLink
//       to={link}
//       style={({ isActive }) => {
//         return {
//           textDecoration: 'none',
//           display: 'inline',
//           marginLeft: theme.spacing(3),
//           padding: theme.spacing(1),
//           backgroundColor: theme.palette.grey[400],
//           border: isActive || hover ? '2px solid black' : '2px solid transparent',
//         };
//       }}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}>
//       <div style={{ display: 'inline-block', fontFamily: theme.typography.fontFamily }}>{label}</div>
//     </NavLink>
//   );
// }

export default AdminHeader;
