import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import AuthorizedView from '../auth/AuthorizedView';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import LoadingTypography from '../common/LoadingTypography';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { useAuth } from '../../utils/auth/useAuth';
import LibraryInBookDetails from '../../models/LibraryInBookDetails';
import RoomIcon from '@mui/icons-material/Room';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getLibraries } from '../../api/library';

export function LibrariesMap() {
  const { user } = useAuth();

  const { data: libraries, status: librariesStatus } = useQuery({
    queryKey: ['libraries'],
    queryFn: () => getLibraries({ pageNumber: 0, pageSize: 1000 }),
  });

  function getLibrariesWithDistanceFromUser(): LibraryInBookDetails[] {
    let result: LibraryInBookDetails[] = [];
    if (user != undefined && user!.lat != undefined) {
      libraries?.data.map((library) => {
        const tmp: LibraryInBookDetails = {
          library: {
            ...library,
            isBookCurrentlyAvailable: false,
          },
          distanceFromUser: getDistanceFromLatLonInKm(
            user!.lat!,
            user!.lon!,
            library.latitude,
            library.longitude
          ),
          userLibrary: false,
          isBookCurrentlyAvailable: false,
        };
        result.push(tmp);
      });
      result = result.sort((a, b) => {
        if (a.distanceFromUser! > b.distanceFromUser!) return 1;
        else return -1;
      });
    } else {
      libraries?.data.map((library) => {
        const tmp: LibraryInBookDetails = {
          library: {
            ...library,
            isBookCurrentlyAvailable: false,
          },
          userLibrary: false,
          isBookCurrentlyAvailable: false,
        };
        result.push(tmp);
      });
    }
    // dodanie ulubionej biblioteki na początek
    if (user != undefined && user!.libraryId != undefined) {
      const userLibrary = result?.find((library) => library.library.id == user!.libraryId);
      if (userLibrary != undefined) {
        const index = result.indexOf(userLibrary);
        result.splice(index, 1);
        userLibrary.userLibrary = true;
        result.unshift(userLibrary);
      }
    }
    return result;
  }

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  return (
    <div>
      <Typography variant="h3" marginBottom={5}>
        Nasze biblioteki
      </Typography>

      {librariesStatus == 'loading' && <LoadingTypography />}
      {librariesStatus == 'error' && 'Błąd!'}
      {librariesStatus == 'success' && libraries.data.length > 0 && (
        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={5}>
            <Stack
              direction={'column'}
              spacing={1}
              style={{ overflow: 'auto', height: 500 }}
              sx={{ backgroundColor: '#eeeeee' }}>
              {getLibrariesWithDistanceFromUser().map((library) => (
                <Paper
                  key={library.library.id}
                  elevation={2}
                  sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Link to={`/libraries/${library.library.id}`}>
                      <Typography variant="h6">
                        {library.library.name}
                        {library.userLibrary && <FavoriteBorderIcon></FavoriteBorderIcon>}
                      </Typography>
                    </Link>
                    <Typography>
                      {library.library.address.street + ' ' + library.library.address.number}
                      {library.library.address.apartment == '' ? '' : '/'}
                      {library.library.address.apartment ?? ''}
                    </Typography>
                    <Typography>
                      {library.library.address.postalCode + ' ' + library.library.address.city}
                    </Typography>
                  </div>
                  <AuthorizedView>
                    <Stack direction={'column'}>
                      {user?.lat != undefined && (
                        <Typography>
                          <RoomIcon></RoomIcon>
                          {library.distanceFromUser!.toFixed(1).toString() + ' km'}
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
              {libraries.data.map((library) => (
                <Marker position={[library.latitude, library.longitude]} key={library.id}>
                  <Popup>
                    <Link to={`/libraries/${library.id}`}>{library.name}</Link>
                    <br />
                    {library.address.street + ' ' + library.address.number}
                    {library.address.apartment == '' ? '' : '/'}
                    {library.address.apartment ?? ''}
                    <br /> {library.address.city}
                    <br />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Grid>
        </Grid>
      )}
      {librariesStatus == 'success' && libraries.data.length == 0 && (
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
