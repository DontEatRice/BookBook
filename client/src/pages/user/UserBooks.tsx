import { Box, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { BookViewModelType } from '../../models/BookViewModel';
import { useQuery } from '@tanstack/react-query';
import { getUserBooks } from '../../api/user';
import BookInUserList from '../../components/BookInUserList';

function UserBooks({ data }: { data: BookViewModelType[] }) {
  return (
    <Grid container spacing={3}>
      {data.map((book) => (
        <Grid item xs={12} key={book.id}>
          <BookInUserList book={book} />
        </Grid>
      ))}
    </Grid>
  );
}

function UserBooksList() {
  const theme = useTheme();

  const { data, status } = useQuery({
    queryKey: ['getUserBooks'],
    queryFn: getUserBooks,
  });
  return (
    <Box>
      {status == 'loading' && <CircularProgress />}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <UserBooks data={data} />}
    </Box>
  );
}

export default UserBooksList;

