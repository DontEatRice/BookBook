import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BookViewModelType } from '../../models/BookViewModel';
import { useTheme } from '@mui/material/styles';
import { searchBooks } from '../../api/book';
import { Grid } from '@mui/material';
import BookInList from '../../components/BookInList';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

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

function Books({ data }: { data: BookViewModelType[] }) {
  return (
    <Grid container spacing={1}>
      {data.map((book) => (
        <Grid item xs={6} key={book.id}>
          <BookInList book={book} />
        </Grid>
      ))}
    </Grid>
  );
}

function BooksList() {
  const theme = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q');
  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: ['searchBooks', q],
    queryFn: () => searchBooks(q == null ? '' : q),
  });

  return (
    <Box>
      {searchStatus == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {searchStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {searchStatus == 'success' && <Books data={searchData} />}
    </Box>
  );
}

export default BooksList;

