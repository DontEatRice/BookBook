import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Button, TablePagination, TableSortLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ReservationViewModelType } from '../../models/ReservationViewModel';
import {
  ReservationSearchResponse,
  cancelReservationByAdmin,
  getReservations,
  giveOutReservation,
  returnReservation,
} from '../../api/reservation';
import { translateStatus } from '../../utils/functions/utilFunctions';
import { useAuth } from '../../utils/auth/useAuth';
import LoadingTypography from '../../components/common/LoadingTypography';
import { z } from 'zod';
import { PaginatedTableHeadCell, PaginatedTableProps, PaginationRequest } from '../../utils/constants';
import { useState } from 'react';

type ResponseType = z.infer<typeof ReservationSearchResponse>;
const headCells: readonly PaginatedTableHeadCell<ReservationViewModelType>[] = [
  { field: 'id', label: 'Id rezerwacji', numeric: false, sortable: false },
  { field: 'userId', label: 'Id użytkownika', numeric: false, sortable: false },
  { field: 'status', label: 'Status', numeric: false, sortable: true },
  { field: 'createdAt', label: 'Data rezerwacji', numeric: false, sortable: true },
  { field: 'reservationEndDate', label: 'Data końca rezerwacji', numeric: false, sortable: true },
];

export default function AdminReservationList() {
  const { user } = useAuth();
  user?.libraryId;

  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);

  const handleRequestSort = (property: keyof ReservationViewModelType) => {
    const isAsc = orderByField === property && orderDirection === 'asc';
    setPaginationProps({
      ...paginationProps,
      orderByField: property,
      orderDirection: isAsc ? 'desc' : 'asc',
    });
  };

  const {
    data: reservations,
    status,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['reservations', user!.libraryId!, pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () => getReservations({ ...paginationProps }, user!.libraryId!),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
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
      {isInitLoading && isLoading && <LoadingTypography />}
      {status == 'success' && (
        <AdminReservations
          data={reservations}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );

  function AdminReservations({
    data,
    paginationProps,
    onPaginationPropsChange,
    onRequestSort,
    sx,
  }: PaginatedTableProps<ResponseType, ReservationViewModelType>) {
    const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
    const handleChangePage = (_: React.MouseEvent | null, newPage: number) => {
      onPaginationPropsChange({ ...paginationProps, pageNumber: newPage });
    };
    const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onPaginationPropsChange({ ...paginationProps, pageSize: parseInt(event.target.value, 10) });
    };

    return (
      <Box sx={sx}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((cell) => (
                  <TableCell
                    key={cell.field}
                    sortDirection={orderByField === cell.field ? orderDirection : 'desc'}>
                    {cell.sortable ? (
                      <TableSortLabel
                        active={orderByField === cell.field}
                        direction={orderByField === cell.field ? orderDirection : 'asc'}
                        onClick={() => onRequestSort(cell.field)}>
                        {cell.label}
                      </TableSortLabel>
                    ) : (
                      cell.label
                    )}
                  </TableCell>
                ))}
                <TableCell>Zarządzaj</TableCell>
                <TableCell>Anuluj</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.id}</TableCell>
                  <TableCell>{reservation.userId}</TableCell>
                  <TableCell>{translateStatus(reservation.status)}</TableCell>
                  <TableCell>{new Date(reservation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(reservation.reservationEndDate).toLocaleDateString()}</TableCell>
                  {reservation.status == 'Pending' && (
                    <TableCell>
                      <Button onClick={() => giveOutThisReservation(reservation.id)}>Wypożycz</Button>
                    </TableCell>
                  )}
                  {reservation.status == 'Pending' && (
                    <TableCell>
                      <Button onClick={() => cancelThisReservation(reservation.id)}>Anuluj</Button>
                    </TableCell>
                  )}
                  {reservation.status == 'GivenOut' ? (
                    <TableCell>
                      <Button onClick={() => returnThisReservation(reservation.id)}>Zwróć</Button>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component={'div'}
          rowsPerPage={pageSize}
          count={data.count}
          page={pageNumber}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleRowsChange}
          labelRowsPerPage={'Ilość na stronie'}
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`;
          }}
        />
      </Box>
    );
  }
}
