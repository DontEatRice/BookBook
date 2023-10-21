import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Nav from './Nav';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import CartTab from '../components/CartTab';
import { useCartStore } from '../../src/store';
import { Button } from '@mui/material';

function Header() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const cartStore = useCartStore();

  return (
    <Box
      component="header"
      sx={{ position: 'sticky', top: 0, left: 0, backgroundColor: theme.palette.background.default }}>
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
          {matches && (
            <Grid item sm={3} xs={0}>
              Profile itp
            </Grid>
          )}
          <Grid item sm={3} xs={0}>
            {cartStore.isOpen && <CartTab />}
            <Button onClick={() => cartStore.toggleCart()}>KOSZYK</Button>
          </Grid>
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
