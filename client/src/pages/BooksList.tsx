import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from 'react-query';
import { BookViewModelType } from '../models/BookViewModel';
import { useTheme } from '@mui/material/styles';
import { getBooks } from '../api/book';
import { Grid, Stack } from '@mui/material';
import BookInList from '../components/BookInList';

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
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {data.map((book) => (
        <Grid xs={6}>
          <BookInList book={book} />
        </Grid>
      ))}
    </Grid>
  );
}

function BooksList() {
  const theme = useTheme();
  const { data, status } = useQuery({ queryKey: ['books'], queryFn: getBooks });

  return (
    <Box sx={{ width: '100%' }}>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <Books data={data} />}
    </Box>
  );
}

export default BooksList;
