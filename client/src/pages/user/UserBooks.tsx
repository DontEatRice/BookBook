import { BookViewModelType } from '../../models/BookViewModel';
import { useQuery } from '@tanstack/react-query';
import { getUserBooks } from '../../api/user';
import BookInUserList from '../../components/book/BookInUserList';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoadingTypography from '../../components/common/LoadingTypography';
import { Button, Typography } from '@mui/material';

function UserBooks({ data }: { data: BookViewModelType[] }) {
  if (data.length == 0) {
    return (
      <Box alignContent={'center'} textAlign={'center'}>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Nie masz żadnych obserwowanych książek!
        </Typography>
        <Button href="/books" variant="contained">
          Przeglądaj książki
        </Button>
      </Box>
    );
  } else {
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
}

function UserBooksList() {
  const { data, status } = useQuery({
    queryKey: ['getUserBooks'],
    queryFn: getUserBooks,
  });
  return (
    <Box>
      {status == 'loading' && <LoadingTypography />}
      {status == 'success' && <UserBooks data={data} />}
    </Box>
  );
}

export default UserBooksList;
