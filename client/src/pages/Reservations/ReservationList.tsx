import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { useQuery } from '@tanstack/react-query';
import { ReservationViewModelType } from '../../models/ReservationViewModel';
import { cancelReservation, getReservationsForUser } from '../../api/reservation';
import { translateStatus } from '../../utils/functions/utilFunctions';
import { Button, useTheme } from '@mui/material';
import { useCartStore } from '../../store';
import { useEffect } from 'react';

export default function ReservationList() {
  const cartStore = useCartStore();
  const theme = useTheme();
  const {
    data: reservation,
    status,
    refetch,
  } = useQuery({
    queryKey: ['reservationsForUser'],
    queryFn: getReservationsForUser,
  });

  useEffect(() => {
    refetch();
  }, [cartStore.isChanged, refetch]);

  const cancelThisReservation = async (reservationId: string) => {
    await cancelReservation(reservationId);
    await refetch();
  };

  return (
    <Box sx={{ padding: '16px' }}>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <Reservations data={reservation} />}
    </Box>
  );

  function Reservations({ data }: { data: ReservationViewModelType[] }) {
    return (
      <TableContainer sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '10px' }}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nazwa Biblioteki</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data Końca Rezerwacji</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((reservation) => (
              <TableRow
                key={reservation.id}
                sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.library.name}</TableCell>
                <TableCell>{translateStatus(reservation.status)}</TableCell>
                <TableCell>{new Date(reservation.reservationEndDate).toLocaleDateString()}</TableCell>
                {reservation.status == 'Pending' && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => cancelThisReservation(reservation.id)}>
                      Anuluj
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

