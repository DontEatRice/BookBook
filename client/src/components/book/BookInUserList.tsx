import { BookViewModelType } from '../../models/BookViewModel';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Typography, styled } from '@mui/material';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookInUserList } from '../../api/user';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

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
    onError: (e: Error) => {
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
    aspectRatio: 11 / 16,
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
        <Grid item xs={2}>
          <Button
            // sx={{
            //   width: 128,
            //   height: 200,
            // }}
            onClick={() => navigate(`/books/${book.id}`)}>
            <Img alt={book.title} src={`${book.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`} />
          </Button>
        </Grid>
        <Grid item xs={10} sm container>
          <Grid item xs={10} container direction="column" spacing={3}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                {book.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {book.bookCategories.map((category) => category.name).join(', ')}
              </Typography>
              {/* <Rating
                name="half-rating-read"
                value={book.averageRating == null ? 2.25 : book.averageRating}
                precision={0.25}
                readOnly
              /> */}
            </Grid>
          </Grid>
          <Grid item xs>
            <input type="hidden" {...register('bookId')} value={book.id} />
            <Button
              onClick={handleSubmit(onClick)}
              variant="contained"
              color="error"
              endIcon={<DeleteOutlineRoundedIcon />}>
              Przeczytane
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BookInUserList;
