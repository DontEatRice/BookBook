import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { BookViewModelType } from '../../models/BookViewModel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '../../api/book';
import LoadingTypography from '../../components/common/LoadingTypography';

// przyklad z https://mui.com/material-ui/react-table/#sorting-amp-selecting

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// type Order = 'asc' | 'desc';

// function getComparator<Key extends keyof BookViewModelType>(
//   order: Order,
//   orderBy: Key
// ): (a: BookViewModelType, b: BookViewModelType) => number {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

function BooksTable({ data }: { data: BookViewModelType[] }) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ISBN</TableCell>
            <TableCell>Tytuł</TableCell>
            <TableCell>Rok publikacji</TableCell>
            <TableCell>Autorzy</TableCell>
            <TableCell>Kategorie</TableCell>
            <TableCell>Wydawca</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((book) => (
            <TableRow
              key={book.id}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/admin/books/${book.id}`)}>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.yearPublished}</TableCell>
              <TableCell>
                {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
              </TableCell>
              <TableCell>{book.bookCategories.map((category) => category.name).join(', ')}</TableCell>
              <TableCell>{book.publisher?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminBooks() {
  const { data, status } = useQuery({
    queryKey: ['books'],
    queryFn: () => searchBooks({ pageNumber: 0, pageSize: 50 }),
  });

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Książki</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj książkę</Button>
          </Link>
        </Grid>
      </Grid>
      {status == 'loading' && <LoadingTypography />}
      {status == 'success' && <BooksTable data={data.data} />}
    </Box>
  );
}

export default AdminBooks;
