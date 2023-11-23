import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Nav from './Nav';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import CartTab from '../components/reservations/CartTab';
import { useCartStore } from '../../src/store';
import AuthorizedView from '../components/auth/AuthorizedView';
import NotAuthorizedView from '../components/auth/NotAuthorizedView';
import LoginIcon from '@mui/icons-material/Login';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../utils/auth/useAuth';
import ProfileHeaderIcon from '../components/profile/ProfileHeaderIcon';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

function Header() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('xs'));
  const cartStore = useCartStore();
  const { logout } = useAuth();

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        backgroundColor: theme.palette.secondary.main,
        zIndex: 100,
      }}>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={0}>
          {matches && (
            <Grid item sm={3} xs={0} container justifyContent="center">
              <HeaderLogo />
            </Grid>
          )}
          <Grid item sm={6} xs={12}>
            <SearchBar />
          </Grid>
          <AuthorizedView>
            {matches && (
              <Grid
                item
                sm={1}
                sx={{
                  paddingLeft: 3,
                  paddingY: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {cartStore.isOpen && <CartTab />}
                <Tooltip title="Koszyk">
                  <Box
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={() => cartStore.toggleCart()}>
                    <LocalMallIcon />
                  </Box>
                </Tooltip>
              </Grid>
            )}
            <Grid
              item
              sm={1}
              xs={3}
              paddingY={2}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}>
              <ProfileHeaderIcon />
            </Grid>
            <Grid
              item
              sm={1}
              xs={3}
              onClick={() => logout()}
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
            <Grid
              item
              sm={3}
              xs={3}
              paddingY={2}
              sx={{
                textAlign: 'center',
              }}>
              <Tooltip title="Logowanie">
                <Link to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <LoginIcon sx={{ fontSize: '2rem' }} />
                </Link>
              </Tooltip>
            </Grid>
          </NotAuthorizedView>
        </Grid>
      </Box>
      <Nav />
    </Box>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setQuery(value);
      setParams({ q: value });
      if (location.pathname != '/books' && value != '') {
        navigate('/books?q=' + value);
      }
    },
    [navigate, setParams]
  );
  useEffect(() => {
    if (!params.has('q')) {
      setQuery('');
    }
  }, [params]);

  return (
    <Box m={1}>
      <TextField fullWidth value={query} onChange={handleChange} placeholder="Gotowy na przygodę?" />
    </Box>
  );
}

function HeaderLogo() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Grid item m={1}>
      <Box
        p={1}
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

