import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { getBooksInLibrary } from '../../api/library';
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

function BooksInLibraryTable({ data }: { data: BookInLibraryViewModelType[] }) {
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
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((bookInLibrary) => (
            <TableRow key={bookInLibrary.book.id}>
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
  );
}

function AdminBooksInLibrary() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.libraryId) {
    navigate(loginWithReturnToPath(window.location.pathname));
  }

  const { data: booksInLibrary, status: booksInLibraryStatus } = useQuery({
    queryKey: ['booksInLibrary', user!.libraryId!],
    queryFn: ({ queryKey }) => getBooksInLibrary({ libraryId: queryKey[1]!, pageNumber: 0, pageSize: 50 }),
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
      {booksInLibraryStatus == 'loading' && <LoadingTypography />}
      {booksInLibraryStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {booksInLibraryStatus == 'success' && <BooksInLibraryTable data={booksInLibrary.data} />}
    </Box>
  );
}

export default AdminBooksInLibrary;
