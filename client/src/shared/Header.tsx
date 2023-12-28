import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Nav from './Nav';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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
            <AuthorizedView roles={['User']}>
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
            </AuthorizedView>
            <AuthorizedView roles={['Admin', 'Employee']}>
              <Grid
                item
                sm={1}
                xs={2}
                paddingY={2}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Link to={'/admin'} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Tooltip title="Panel administracyjny">
                    <AdminPanelSettingsIcon sx={{ fontSize: '2rem' }} />
                  </Tooltip>
                </Link>
              </Grid>
            </AuthorizedView>
            <Grid
              item
              sm={1}
              xs={2}
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
              <Link to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Tooltip title="Logowanie">
                  <LoginIcon sx={{ fontSize: '2rem' }} />
                </Tooltip>
              </Link>
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
  /* eslint-disable */
  const [_, setSearchParams] = useSearchParams();
  /* eslint-enable */
  const navigate = useNavigate();

  const handleSearchType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setQuery(value);
  };
  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == 'Enter') {
      if (query != '') {
        navigate('/books?q=' + query);
      }
    }
  };

  const handleSearch = () => {
    if (query != '') {
      navigate('/books?q=' + query);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({ ['q']: '' });
  };

  return (
    <Box m={1}>
      <TextField
        fullWidth
        value={query}
        onChange={handleSearchType}
        onKeyDown={handleSearchOnEnter}
        placeholder="Gotowy na przygodę?"
        InputProps={{
          endAdornment: (
            <Box>
              <InputAdornment position="end">
                {query.length > 0 && (
                  <Button onClick={clearQuery}>
                    <ClearIcon></ClearIcon>
                  </Button>
                )}
                <Button variant="contained" endIcon={<SearchIcon />} onClick={handleSearch}>
                  Szukaj
                </Button>
              </InputAdornment>
            </Box>
          ),
        }}
      />
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
