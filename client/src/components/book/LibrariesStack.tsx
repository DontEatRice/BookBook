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
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { useAuth } from '../../utils/auth/useAuth';

function LibrariesStack({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const { showError, showSuccess } = useAlert();
  const cartStore = useCartStore();

  const { data: libraries, status: librariesStatus } = useQuery(
    ['booksInLibrary', bookId],
    async (context) => {
      if (context.queryKey[1] != '') {
        const bookId = context.queryKey[1] as string;
        const res = await getLibrariesWithBook(bookId);
        if (user?.lat != undefined) {
          return res.sort((a, b) => {
            if (
              getDistanceFromLatLonInKm(a.latitude, a.longitude, user?.lat!, user?.lon!) >
              getDistanceFromLatLonInKm(b.latitude, b.longitude, user?.lat!, user?.lon!)
            )
              return 1;
            else return -1;
          });
        } else {
          return res;
        }
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

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    console.log(user);
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
  return (
    <div>
      {librariesStatus == 'loading' && <LoadingTypography />}
      {librariesStatus == 'error' && 'Błąd!'}
      {librariesStatus == 'success' && libraries.length > 0 && (
        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={5}>
            <Stack
              direction={'column'}
              spacing={1}
              style={{ overflow: 'auto', height: 500 }}
              sx={{ backgroundColor: '#eeeeee' }}>
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
                      {library.address.apartment == '' ? '' : '/'}
                      {library.address.apartment ?? ''}
                    </Typography>
                    <Typography>{library.address.postalCode + ' ' + library.address.city}</Typography>
                  </div>
                  <AuthorizedView>
                    <Stack direction={'column'}>
                      <Button onClick={() => handleAddToCart(bookId, library.id)}>Do koszyka</Button>
                      {user?.lat != undefined && (
                        <Typography>
                          {getDistanceFromLatLonInKm(
                            library.latitude,
                            library.longitude,
                            user.lat!,
                            user.lon!
                          )
                            .toFixed(1)
                            .toString() + ' km od Ciebie!'}
                        </Typography>
                      )}
                    </Stack>
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
                    {library.address.apartment == '' ? '' : '/'}
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
          <Typography variant="h5">
            Książka nie jest dostępna w żadnej bibliotece...<MoodBadIcon></MoodBadIcon>
          </Typography>
          <Typography variant="h5">Zajrzyj tu później</Typography>
        </Box>
      )}
    </div>
  );
}

export default LibrariesStack;
