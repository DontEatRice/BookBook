import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getBooksInLibrary } from '../../api/library';
import { BookInLibraryViewModelType } from '../../models/BookInLibraryViewModel';

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
  const libraryId = 'dd4222c7-b915-4efe-b613-8cb92651f636';
  const { data: booksInLibrary, status: booksInLibraryStatus } = useQuery({
    queryKey: ['booksInLibrary', libraryId],
    queryFn: ({ queryKey }) => getBooksInLibrary(queryKey[1]),
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
      {booksInLibraryStatus == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {booksInLibraryStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {booksInLibraryStatus == 'success' && <BooksInLibraryTable data={booksInLibrary} />}
    </Box>
  );
}

export default AdminBooksInLibrary;
