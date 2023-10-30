import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Button } from '@mui/material';

import { useQuery } from '@tanstack/react-query';
import { ReservationViewModelType } from '../../models/ReservationViewModel';
import {
  cancelReservationByAdmin,
  getReservations,
  giveOutReservation,
  returnReservation,
} from '../../api/reservation';
import { translateStatus } from '../../utils/functions/utilFunctions';

export default function AdminReservationList() {
  const {
    data: reservation,
    status,
    refetch,
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  });

  const giveOutThisReservation = async (reservationId: string) => {
    await giveOutReservation(reservationId);
    await refetch();
  };

  const cancelThisReservation = async (reservationId: string) => {
    await cancelReservationByAdmin(reservationId);
    await refetch();
  };

  const returnThisReservation = async (reservationId: string) => {
    await returnReservation(reservationId);
    await refetch();
  };

  return (
    <Box>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <AdminReservations data={reservation} />}
    </Box>
  );

  function AdminReservations({ data }: { data: ReservationViewModelType[] }) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Id uzytkownika</TableCell>
              <TableCell>Nazwa Biblioteki</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data Końca rezerwacji</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.userId}</TableCell>
                <TableCell>{reservation.library.name}</TableCell>
                <TableCell>{translateStatus(reservation.status)}</TableCell>
                <TableCell>{new Date(reservation.reservationEndDate).toLocaleDateString()}</TableCell>
                {reservation.status == 'Pending' && (
                  <TableCell>
                    <Button onClick={() => giveOutThisReservation(reservation.id)}>Wyporzycz</Button>
                  </TableCell>
                )}
                {reservation.status == 'Pending' && (
                  <TableCell>
                    <Button onClick={() => cancelThisReservation(reservation.id)}>Anuluj</Button>
                  </TableCell>
                )}
                {reservation.status == 'GivenOut' && (
                  <TableCell>
                    <Button onClick={() => returnThisReservation(reservation.id)}>Zwróć</Button>
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

