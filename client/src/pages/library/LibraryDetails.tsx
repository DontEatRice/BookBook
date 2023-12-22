import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getLibrary } from '../../api/library';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingTypography from '../../components/common/LoadingTypography';
import useAlert from '../../utils/alerts/useAlert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { MarkerIcon } from '../../utils/utils';

function formatOpenHours(openHours: string | null) {
  if (openHours == null) {
    return '';
  }
  //format w bazie to np 08:00.0000
  const splitTime = openHours.split(':');
  return `${splitTime[0]}:${splitTime[1].split('.')[0]}`;
}

function LibraryDetails() {
  const { handleError } = useAlert();
  const params = useParams();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['library', params.libraryId],
    queryFn: () => getLibrary(params.libraryId + ''),
    onError: (e: unknown) => handleError(e),
  });

  return (
    <Box mt={2}>
      {isLoading && <LoadingTypography />}
      {isSuccess && (
        <div>
          <Typography variant="h3" marginTop={8} marginBottom={4}>
            {data.name}
          </Typography>
          <Grid container spacing={1} marginBottom={7} direction={'row'}>
            <Grid item container xs={7} direction={'column'}>
              <Grid item marginBottom={1}>
                <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                  Adres
                </Typography>
                <Typography variant="h6">
                  ul. {data.address.street + ' ' + data.address.number}
                  {data.address.apartment == '' ? '' : '/'}
                  {data.address.apartment ?? ''}
                </Typography>
                <Typography variant="h6">{data.address.postalCode + ' ' + data.address.city}</Typography>
                {data.address.additionalInfo != null && data.address.additionalInfo != '' && (
                  <Typography variant="h6">Wskazówki: {data.address.additionalInfo}</Typography>
                )}
              </Grid>
              <Grid item marginBottom={1}>
                <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                  Kontakt
                </Typography>
                <Typography variant="h6">E-mail: {data.emailAddress}</Typography>
                <Typography variant="h6">Telefon: {data.phoneNumber}</Typography>
              </Grid>
              <Grid item marginBottom={1}>
                <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                  Godziny otwarcia
                </Typography>
                <Typography variant="h6">
                  Poniedziałek:{' '}
                  {data.openHours.mondayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.mondayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.mondayCloseTime)}
                </Typography>
                <Typography variant="h6">
                  Wtorek:{' '}
                  {data.openHours.tuesdayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.tuesdayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.tuesdayCloseTime)}
                </Typography>
                <Typography variant="h6">
                  Środa:{' '}
                  {data.openHours.wednesdayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.wednesdayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.wednesdayCloseTime)}
                </Typography>
                <Typography variant="h6">
                  Czwartek:{' '}
                  {data.openHours.thursdayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.thursdayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.thursdayCloseTime)}
                </Typography>
                <Typography variant="h6">
                  Piątek:{' '}
                  {data.openHours.fridayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.fridayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.fridayCloseTime)}
                </Typography>
                <Typography variant="h6">
                  Sobota:{' '}
                  {data.openHours.saturdayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.saturdayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.saturdayCloseTime)}
                </Typography>
                <Typography variant="h6">
                  Niedziela:{' '}
                  {data.openHours.sundayOpenTime == null
                    ? 'Zamknięte'
                    : formatOpenHours(data.openHours.sundayOpenTime) +
                      ' - ' +
                      formatOpenHours(data.openHours.sundayCloseTime)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={5}>
              <MapContainer
                id="map"
                style={{ height: 500 }}
                bounds={[
                  [54, 23],
                  [49.5, 14.5],
                ]}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker icon={MarkerIcon} position={[data.latitude, data.longitude]} key={data.id}>
                  <Popup>Tutaj nas znajdziesz!</Popup>
                </Marker>
              </MapContainer>
            </Grid>
          </Grid>
        </div>
      )}
    </Box>
  );
}

export default LibraryDetails;
