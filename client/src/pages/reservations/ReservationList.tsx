import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReservationViewModelType } from '../../models/ReservationViewModel';
import { cancelReservation, getReservationsForUser } from '../../api/reservation';
import { translateStatus } from '../../utils/functions/utilFunctions';
import { useCartStore } from '../../store';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import LoadingTypography from '../../components/common/LoadingTypography';
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import Reservation from './Reservation';

export default function ReservationList() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();
  const theme = useTheme();
  const [onlyPending, setOnlyPending] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationViewModelType | null>(null);

  const {
    data: reservation,
    status,
    refetch,
  } = useQuery({
    queryKey: ['reservationsForUser'],
    queryFn: () => getReservationsForUser({ pageNumber: 0, pageSize: 50 }),
  });

  useEffect(() => {
    refetch();
  }, [cartStore.isChanged, refetch]);

  const cancelThisReservation = async (reservationId: string) => {
    await cancelReservation(reservationId);
    await refetch();
    queryClient.refetchQueries(['reservation', reservationId]);
  };

  return (
    <Box sx={{ padding: '16px' }}>
      {status == 'loading' && <LoadingTypography />}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <Reservations data={reservation.data} />}
    </Box>
  );

  function Reservations({ data }: { data: ReservationViewModelType[] }) {
    return (
      <div>
        <Box sx={{ padding: '16px' }}>
          <FormControlLabel
            control={<Checkbox checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} />}
            label="Trwające"
          />
        </Box>
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
              {data.map((reservation) =>
                onlyPending && reservation.status != 'Pending' ? null : (
                  <TableRow
                    key={reservation.id}
                    onClick={() => setSelectedReservation(reservation)}
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
                          onClick={(event) => {
                            event.stopPropagation();
                            cancelThisReservation(reservation.id);
                          }}>
                          Anuluj
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
            {selectedReservation && (
              <Dialog
                key={selectedReservation.id}
                open
                onClose={() => {
                  setSelectedReservation(null);
                  queryClient.invalidateQueries({ queryKey: ['reservation', 'reservationsForUser'] });
                }}>
                <DialogTitle>Szczegóły Rezerwacji</DialogTitle>
                <DialogContent>
                  <Reservation
                    reservationId={selectedReservation.id}
                    cancelThisReservation={cancelThisReservation}
                  />
                </DialogContent>
              </Dialog>
            )}
          </Table>
        </TableContainer>
      </div>
    );
  }
}

