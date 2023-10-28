import { BookViewModelType } from '../models/BookViewModel';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Rating, Typography, styled } from '@mui/material';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookInUserList } from '../api/user';

function BookInUserList({ book }: { book: BookViewModelType }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<ToggleBookInUserListType>({
    resolver: zodResolver(ToggleBookInUserList),
  });

  const mutation = useMutation({
    mutationFn: toggleBookInUserList,
    onMutate: async (toggleBook) => {
      await queryClient.cancelQueries({ queryKey: ['getUserBooks'] });
      const previousUserBooks = queryClient.getQueryData<BookViewModelType[]>(['getUserBooks']);
      if (previousUserBooks) {
        queryClient.setQueryData<BookViewModelType[]>(
          ['getUserBooks'],
          (old) => (old = old?.filter((book) => book.id !== toggleBook.bookId))
        );
      }
      return { previousUserBooks };
    },
    onError: (e: Error, context) => {
      console.log(e);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserBooks'] });
    },
  });
  const onClick: SubmitHandler<ToggleBookInUserListType> = (toggleData) => {
    mutation.mutate(toggleData);
  };
  const navigate = useNavigate();

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Grid container spacing={2}>
        <Grid item>
          <Button sx={{ width: 128, height: 128 }} onClick={() => navigate(`/books/${book.id}`)}>
            <Img alt="complex" src="" />
          </Button>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {book.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {book.bookCategories.map((category) => category.name).join(', ')}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Rating
                name="half-rating-read"
                value={book.averageRating == null ? 2.25 : book.averageRating}
                precision={0.25}
                readOnly
              />
            </Grid>
            <Grid item xs>
              <input type="hidden" {...register('bookId')} value={book.id} />
              <Button onClick={handleSubmit(onClick)}>Usuń z listy</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BookInUserList;
