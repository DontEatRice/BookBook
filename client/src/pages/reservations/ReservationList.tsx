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
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import LoadingTypography from '../../components/common/LoadingTypography';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import Reservation from './Reservation';
import { PaginationRequest } from '../../utils/constants';

export default function ReservationList() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();
  const theme = useTheme();
  const [onlyPending, setOnlyPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [reservationId, setReservationId] = useState<string>('');
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
    orderDirection: 'desc',
    orderByField: 'createdAt',
  });

  const {
    data: reservations,
    status,
    refetch,
  } = useQuery({
    queryKey: [
      'reservationsForUser',
      paginationProps.pageNumber,
      paginationProps.pageSize,
      paginationProps.orderByField,
      paginationProps.orderDirection,
    ],
    keepPreviousData: true,
    queryFn: () =>
      getReservationsForUser({
        pageNumber: paginationProps.pageNumber,
        pageSize: paginationProps.pageSize,
        orderByField: paginationProps.orderByField,
        orderDirection: paginationProps.orderDirection,
      }),
  });

  const cancelThisReservation = async (reservationId: string) => {
    await cancelReservation(reservationId);
    await refetch();
    queryClient.refetchQueries(['reservation', reservationId]);
  };

  const handleChangePage = (_: React.MouseEvent | null, newPage: number) => {
    setPaginationProps({ ...paginationProps, pageNumber: newPage });
  };
  const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaginationProps({ ...paginationProps, pageSize: parseInt(event.target.value, 10) });
  };
  const handleRequestSort = (property: keyof ReservationViewModelType) => {
    const isAsc = paginationProps.orderByField === property && paginationProps.orderDirection === 'asc';
    setPaginationProps({
      ...paginationProps,
      orderByField: property,
      orderDirection: isAsc ? 'desc' : 'asc',
    });
  };

  const handleClickOpen = (reservationId: string) => {
    setReservationId(reservationId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReservationId('');
  };

  const handleConfirm = () => {
    setOpen(false);
    cancelThisReservation(reservationId);
  };

  return (
    <Box sx={{ padding: '16px' }}>
      {status == 'loading' && <LoadingTypography />}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && (
        <Box>
          <Reservations data={reservations.data} />
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component={'div'}
            rowsPerPage={paginationProps.pageSize}
            count={reservations.count}
            page={paginationProps.pageNumber}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsChange}
            labelRowsPerPage={'Ilość na stronie'}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`;
            }}
          />
        </Box>
      )}
    </Box>
  );

  function Reservations({ data }: { data: ReservationViewModelType[] }) {
    return (
      <div>
        <Typography variant="h6">Filtry: </Typography>
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
                <TableCell
                  sortDirection={
                    paginationProps.orderByField === 'createdAd' ? paginationProps.orderDirection : 'desc'
                  }>
                  <TableSortLabel
                    active={paginationProps.orderByField === 'createdAt'}
                    direction={
                      paginationProps.orderByField === 'createdAt' ? paginationProps.orderDirection : 'desc'
                    }
                    onClick={() => handleRequestSort('createdAt')}>
                    Data rezerwacji
                  </TableSortLabel>
                </TableCell>
                <TableCell>Data końca rezerwacji</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((reservation) =>
                onlyPending && reservation.status != 'Pending' ? null : (
                  <TableRow
                    key={reservation.id}
                    onClick={() => cartStore.setSelectedReservation(reservation)}
                    title={'Szczegóły rezerwacji'}
                    sx={{
                      '&:hover': { backgroundColor: theme.palette.action.hover, cursor: 'pointer' },
                    }}>
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>{reservation.library.name}</TableCell>
                    <TableCell>{translateStatus(reservation.status)}</TableCell>
                    <TableCell>{new Date(reservation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(reservation.reservationEndDate).toLocaleDateString()}</TableCell>
                    {reservation.status == 'Pending' ? (
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClickOpen(reservation.id);
                          }}>
                          Anuluj
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell>Brak</TableCell>
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
            {cartStore.selectedReservation && (
              <Dialog
                key={cartStore.selectedReservation.id}
                open
                onClose={() => {
                  cartStore.setSelectedReservation(null);
                  queryClient.invalidateQueries({ queryKey: ['reservation', 'reservationsForUser'] });
                }}>
                <DialogTitle>Szczegóły Rezerwacji</DialogTitle>
                <DialogContent>
                  <Reservation
                    reservationId={cartStore.selectedReservation.id}
                    cancelThisReservation={cancelThisReservation}
                  />
                </DialogContent>
              </Dialog>
            )}
          </Table>
        </TableContainer>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'Potwierdzenie anulowania'}</DialogTitle>
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
              }}
              color="primary"
              autoFocus>
              Potwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
