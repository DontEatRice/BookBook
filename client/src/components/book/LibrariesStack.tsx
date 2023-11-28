import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { addToCart } from '../../api/cart';
import useAlert from '../../utils/alerts/useAlert';
import { useCartStore } from '../../store';
import AuthorizedView from '../auth/AuthorizedView';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { getLibrariesWithBook } from '../../api/book';
import LoadingTypography from '../common/LoadingTypography';

function LibrariesStack({ bookId }: { bookId: string }) {
  const { showError, showSuccess } = useAlert();
  const cartStore = useCartStore();

  const { data: libraries, status: librariesStatus } = useQuery(
    ['booksInLibrary', bookId],
    async (context) => {
      if (context.queryKey[1] != '') {
        const bookId = context.queryKey[1] as string;
        return await getLibrariesWithBook(bookId);
      }
      return [];
    }
  );

  const handleAddToCart = async (bookId: string, libraryId: string) => {
    try {
      await addToCart({ bookId, libraryId });
      showSuccess({ message: 'Dodano do koszyka!' });
      cartStore.toggleIsChanged();
    } catch (error) {
      const err = error as Error;
      switch (err.message) {
        case 'BOOK_ALREADY_IN_CART':
          showError({ message: 'Książka została już dodana do koszyka' });
          break;
        case 'BOOK_NOT_FOUND':
          showError({ message: 'Książka nie została znaleziona' });
          break;
        case 'LIBRARY_NOT_FOUND':
          showError({ message: 'Biblioteka nie została znaleziona' });
          break;
        default:
          showError({ message: `Wystąpił nieznany błąd: ${err.message}` });
          break;
      }
    }
  };
  return (
    <div>
      {librariesStatus == 'loading' && <LoadingTypography />}
      {librariesStatus == 'error' && 'Błąd!'}
      {librariesStatus == 'success' && libraries.length > 0 && (
        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={5}>
            <Stack direction={'column'} spacing={1} style={{ overflow: 'auto', height: 500 }}>
              {libraries.map((library) => (
                <Paper
                  key={library.id}
                  elevation={2}
                  sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Link to={`/libraries/${library.id}`}>
                      <Typography variant="h6">{library.name}</Typography>
                    </Link>
                    <Typography>
                      {library.address.street + ' ' + library.address.number}
                      {library.address.apartment == '' ?? '/'}
                      {library.address.apartment ?? ''}
                    </Typography>
                    <Typography>{library.address.postalCode + ' ' + library.address.city}</Typography>
                  </div>
                  <AuthorizedView>
                    <Button onClick={() => handleAddToCart(bookId, library.id)}>Do koszyka</Button>
                  </AuthorizedView>
                </Paper>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={7}>
            <MapContainer
              id="map"
              style={{ height: 500, zIndex: 0 }}
              bounds={[
                [54, 23],
                [49, 14],
              ]}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {libraries.map((library) => (
                <Marker position={[library.latitude, library.longitude]} key={library.id}>
                  <Popup>
                    <Link to={`/libraries/${library.id}`}>{library.name}</Link>
                    <br />
                    {library.address.street + ' ' + library.address.number}
                    {library.address.apartment == '' ?? '/'}
                    {library.address.apartment ?? ''}
                    <br /> {library.address.city}
                    <br />
                    <AuthorizedView>
                      <Button onClick={() => handleAddToCart(bookId, library.id)}>Do koszyka</Button>
                    </AuthorizedView>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Grid>
        </Grid>
      )}
      {librariesStatus == 'success' && libraries.length == 0 && (
        <Box
          display="flex"
          flexDirection={'column'}
          alignItems="center"
          justifyContent="center"
          sx={{ marginBottom: 3 }}>
          <Typography variant="h4">Książka nie jest dostępna w żadnej bibliotece</Typography>
        </Box>
      )}
    </div>
  );
}

export default LibrariesStack;
