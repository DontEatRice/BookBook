import { Link, useNavigate } from 'react-router-dom';
import { BookInLibrarySearchResponse, getBooksInLibrary } from '../../api/library';
import { BookInLibraryViewModelType } from '../../models/BookInLibraryViewModel';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../utils/auth/useAuth';
import LoadingTypography from '../../components/common/LoadingTypography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { loginWithReturnToPath } from '../../utils/utils';
import { z } from 'zod';
import { PaginatedTableProps, PaginationRequest } from '../../utils/constants';
import { TablePagination, TableSortLabel } from '@mui/material';
import { useState } from 'react';

type ResponseType = z.infer<typeof BookInLibrarySearchResponse>;

function BooksInLibraryTable({
  data,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: PaginatedTableProps<ResponseType, BookInLibraryViewModelType>) {
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
              <TableCell>ISBN</TableCell>
              <TableCell sortDirection={orderByField === 'bookTitle' ? orderDirection : 'desc'}>
                <TableSortLabel
                  active={orderByField === 'book'}
                  direction={orderByField === 'book' ? orderDirection : 'asc'}
                  onClick={() => onRequestSort('book')}>
                  Tytuł
                </TableSortLabel>
              </TableCell>
              <TableCell>Autorzy</TableCell>
              <TableCell sortDirection={orderByField === 'amount' ? orderDirection : 'desc'}>
                <TableSortLabel
                  active={orderByField === 'amount'}
                  direction={orderByField === 'amount' ? orderDirection : 'asc'}
                  onClick={() => onRequestSort('amount')}>
                  Ilość
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderByField === 'available' ? orderDirection : 'desc'}>
                <TableSortLabel
                  active={orderByField === 'available'}
                  direction={orderByField === 'available' ? orderDirection : 'asc'}
                  onClick={() => onRequestSort('available')}>
                  Dostępne
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((bookInLibrary) => (
              <TableRow
                key={bookInLibrary.book.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}>
                <TableCell>{bookInLibrary.book.isbn}</TableCell>
                <TableCell>{bookInLibrary.book.title}</TableCell>
                <TableCell>
                  {bookInLibrary.book.authors
                    .map((author) => author.firstName + ' ' + author.lastName)
                    .join(', ')}
                </TableCell>
                <TableCell>{bookInLibrary.amount}</TableCell>
                <TableCell>{bookInLibrary.available}</TableCell>
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

function AdminBooksInLibrary() {
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);
  const handleRequestSort = (property: keyof BookInLibraryViewModelType) => {
    const isAsc = orderByField === property && orderDirection === 'asc';
    setPaginationProps({
      ...paginationProps,
      orderByField: property,
      orderDirection: isAsc ? 'desc' : 'asc',
    });
  };

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.libraryId) {
    navigate(loginWithReturnToPath(window.location.pathname));
  }

  const {
    data: booksInLibrary,
    status: booksInLibraryStatus,
    isLoading,
  } = useQuery({
    queryKey: ['booksInLibrary', user!.libraryId!, pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () =>
      getBooksInLibrary({
        pageNumber: pageNumber,
        pageSize: pageSize,
        orderByField: orderByField,
        orderDirection: orderDirection,
        libraryId: user!.libraryId!,
      }),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
  });

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Oferta książek</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj książkę do oferty</Button>
          </Link>
        </Grid>
      </Grid>
      {isInitLoading && isLoading && <LoadingTypography />}
      {booksInLibraryStatus == 'success' && (
        <BooksInLibraryTable
          data={booksInLibrary}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminBooksInLibrary;
