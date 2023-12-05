import { Box, Button, Typography } from '@mui/material';
import { translateStatus } from '../../utils/functions/utilFunctions';
import { ReservationViewModelType } from '../../models/ReservationViewModel';
import { useQuery } from '@tanstack/react-query';
import { getReservation } from '../../api/reservation';
import LoadingTypography from '../../components/common/LoadingTypography';

export default function Reservation({
  reservationId,
  cancelThisReservation,
}: {
  reservationId: string;
  cancelThisReservation: (reservationId: string) => void;
}) {
  const { data: reservation, status } = useQuery(['reservation', reservationId], () =>
    getReservation(reservationId)
  );

  return (
    <Box sx={{ padding: '16px' }}>
      {status == 'loading' && <LoadingTypography />}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <Reservation data={reservation} />}
    </Box>
  );

  function Reservation({ data }: { data: ReservationViewModelType }) {
    return (
      <Box>
        {status == 'loading' && <Typography variant="h3">Loading...</Typography>}
        <Typography variant="h6">ID: {data.id}</Typography>
        <Typography variant="body1">Nazwa Biblioteki: {data.library?.name}</Typography>
        <Typography variant="body1">Status: {translateStatus(data.status)}</Typography>
        <Typography variant="body1">
          Data Końca Rezerwacji: {new Date(data.reservationEndDate).toLocaleDateString()}
        </Typography>
        <Typography variant="h6">Książki:</Typography>
        {data.books?.map((book) => (
          <Typography variant="body2" key={book.id}>
            {book.title}
          </Typography>
        ))}
        {data.status == 'Pending' && (
          <Button
            variant="contained"
            color="error"
            onClick={() => cancelThisReservation(reservation?.id || '')}>
            Cancel
          </Button>
        )}
      </Box>
    );
  }
}

