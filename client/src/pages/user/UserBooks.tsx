import { BookViewModelType } from '../../models/BookViewModel';
import { useQuery } from '@tanstack/react-query';
import { getUserBooks } from '../../api/user';
import BookInUserList from '../../components/book/BookInUserList';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoadingTypography from '../../components/common/LoadingTypography';

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
