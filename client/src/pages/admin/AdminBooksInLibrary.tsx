import { Link, useNavigate } from 'react-router-dom';
import {
  BookInLibrarySearchResponse,
  deleteBookFromLibrary,
  getBooksInLibrary,
  updateBookInLibrary,
} from '../../api/library';
import { BookInLibraryViewModelType } from '../../models/BookInLibraryViewModel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import Dialog from '@mui/material/Dialog';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import UpdateBookInLibrary, { UpdateBookInLibraryType } from '../../models/UpdateBookInLibrary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumberInputField2 } from '../../components/common/NumberInputField';
import DialogActions from '@mui/material/DialogActions';
import useAlert from '../../utils/alerts/useAlert';

function UpdateBookInLibraryDialog({
  bookInLibrary,
  onClose,
  onSubmit,
  open,
}: {
  bookInLibrary?: BookInLibraryViewModelType;
  onClose: () => void;
  open: boolean;
  onSubmit: (data: UpdateBookInLibraryType) => void;
}) {
  const { reset, handleSubmit, control } = useForm<UpdateBookInLibraryType>({
    resolver: zodResolver(UpdateBookInLibrary),
  });

  useEffect(() => {
    if (bookInLibrary != null) {
      reset({ amount: bookInLibrary.amount, available: bookInLibrary.available });
    }
  }, [bookInLibrary, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{bookInLibrary?.book.title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <NumberInputField2 control={control} field="amount" label="Ilość" />
          <NumberInputField2 control={control} field="available" label="Dostępne" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Anuluj</Button>
          <Button type="submit" variant="contained">
            Zapisz
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DeleteBookFromLibraryDialog({
  bookInLibrary,
  onClose,
  onConfirm,
  open,
}: {
  bookInLibrary: BookInLibraryViewModelType;
  onClose: () => void;
  open: boolean;
  onConfirm: (data: BookInLibraryViewModelType) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{bookInLibrary.book.title}</DialogTitle>
      <DialogContent>Czy na pewno chcesz usunąć tę książkę z oferty biblioteki?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button color="error" variant="contained" onClick={() => onConfirm(bookInLibrary)}>
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type ResponseType = z.infer<typeof BookInLibrarySearchResponse>;
function BooksInLibraryTable({
  data,
  libraryId,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: PaginatedTableProps<ResponseType, BookInLibraryViewModelType> & { libraryId: string }) {
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { showSuccess } = useAlert();
  const queryClient = useQueryClient();
  const [chosenOffer, setChosenOffer] = useState<BookInLibraryViewModelType | undefined>(undefined);
  const updateMutation = useMutation({
    mutationFn: updateBookInLibrary,
    onSuccess: (_, { libraryId }) => {
      showSuccess({ title: 'Sukces!', message: `Zaktualizowano ofertę` });
      queryClient.invalidateQueries(['booksInLibrary', libraryId]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBookFromLibrary,
    onSuccess: (_, { libraryId }) => {
      showSuccess({ title: 'Sukces!', message: `Pomyślnie usunięto książkę z oferty.` });
      queryClient.invalidateQueries(['booksInLibrary', libraryId]);
      queryClient.invalidateQueries(['booksToAdd', libraryId]);
    },
  });

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
              <TableCell>Akcje</TableCell>
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
                }}
                onClick={() => {
                  setUpdateDialogOpen(true);
                  setChosenOffer({ ...bookInLibrary });
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
                <TableCell>
                  <Button
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setChosenOffer(bookInLibrary);
                      setDeleteDialogOpen(true);
                    }}>
                    Usuń
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <UpdateBookInLibraryDialog
          onClose={() => setUpdateDialogOpen(false)}
          open={updateDialogOpen}
          bookInLibrary={chosenOffer}
          onSubmit={(data) => {
            updateMutation.mutate({ body: data, libraryId, bookId: chosenOffer?.book.id ?? '' });
            setUpdateDialogOpen(false);
          }}
        />
        {chosenOffer && (
          <DeleteBookFromLibraryDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            bookInLibrary={chosenOffer}
            onConfirm={(bookInLibrary) => {
              deleteMutation.mutate({ bookId: bookInLibrary.book.id, libraryId });
              setDeleteDialogOpen(false);
            }}
          />
        )}
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

  useEffect(() => {
    if (!user || !user.libraryId) {
      navigate(loginWithReturnToPath(window.location.pathname));
    }
  }, [navigate, user]);

  const {
    data: booksInLibrary,
    status: booksInLibraryStatus,
    isLoading,
  } = useQuery({
    queryKey: ['booksInLibrary', user?.libraryId, pageNumber, pageSize, orderByField, orderDirection],
    queryFn: ({ queryKey }) =>
      getBooksInLibrary({
        libraryId: queryKey[1]!.toString(),
        pageNumber: pageNumber,
        pageSize: pageSize,
        orderByField: orderByField,
        orderDirection: orderDirection,
      }),
    enabled: !!user?.libraryId,
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
  });

  if (!user?.libraryId) {
    return (
      <Box textAlign={'center'} flexDirection={'column'}>
        <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
          Zaloguj się na konto pracownika
        </Typography>
        <Button variant="contained" component={Link} to={loginWithReturnToPath(window.location.pathname)}>
          Logowanie
        </Button>
      </Box>
    );
  }

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
          libraryId={user.libraryId!}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminBooksInLibrary;
