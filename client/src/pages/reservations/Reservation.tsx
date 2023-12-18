import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { translateStatus } from '../../utils/functions/utilFunctions';
import { ReservationViewModelType } from '../../models/ReservationViewModel';
import { useQuery } from '@tanstack/react-query';
import { getReservation } from '../../api/reservation';
import LoadingTypography from '../../components/common/LoadingTypography';
import { useState } from 'react';
import { useCartStore } from '../../store';

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
  const cartStore = useCartStore();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    cancelThisReservation(reservation?.id || '');
    cartStore.setSelectedReservation(null);
  };

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
          <Button variant="contained" color="error" onClick={handleClickOpen}>
            Anuluj
          </Button>
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'Potwierdzenie rezerwacji'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Czy na pewno chcesz anulować rezerwację?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Anuluj
            </Button>
            <Button
              onClick={() => {
                handleConfirm();
                data.status = 'Returned';
              }}
              color="primary"
              autoFocus>
              Potwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

