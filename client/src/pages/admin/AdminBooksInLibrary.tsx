import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { getBooksInLibrary, updateBookInLibrary } from '../../api/library';
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

function BooksInLibraryTable({ data, libraryId }: { data: BookInLibraryViewModelType[]; libraryId: string }) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
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

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ISBN</TableCell>
            <TableCell>Tytuł</TableCell>
            <TableCell>Autorzy</TableCell>
            <TableCell>Ilość</TableCell>
            <TableCell>Dostępne</TableCell>
            <TableCell>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((bookInLibrary) => (
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
                <Button color="error" onClick={(e) => e.stopPropagation()}>
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
        }}
      />
    </TableContainer>
  );
}

function AdminBooksInLibrary() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.libraryId) {
      navigate(loginWithReturnToPath(window.location.pathname));
    }
  }, [navigate, user]);

  const { data: booksInLibrary, status: booksInLibraryStatus } = useQuery({
    queryKey: ['booksInLibrary', user?.libraryId],
    queryFn: ({ queryKey }) => getBooksInLibrary({ libraryId: queryKey[1]!, pageNumber: 0, pageSize: 50 }),
    enabled: !!user?.libraryId,
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
      {booksInLibraryStatus == 'loading' && <LoadingTypography />}
      {booksInLibraryStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {booksInLibraryStatus == 'success' && (
        <BooksInLibraryTable data={booksInLibrary.data} libraryId={user.libraryId!} />
      )}
    </Box>
  );
}

export default AdminBooksInLibrary;
