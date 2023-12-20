import { BookViewModelType } from '../../models/BookViewModel';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookInUserList } from '../../api/user';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { imgUrl } from '../../utils/utils';
import { useState } from 'react';
import { BookCoverImg } from '../common/Img';
import { Link } from 'react-router-dom';

function BookInUserList({ book }: { book: BookViewModelType }) {
  const [elevation, setElevation] = useState(1);

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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserBooks'] });
      queryClient.invalidateQueries({ queryKey: ['books', book.id] });
    },
  });
  const onClick: SubmitHandler<ToggleBookInUserListType> = (toggleData) => {
    mutation.mutate(toggleData);
  };

  return (
    <Paper
      elevation={elevation}
      onMouseOver={() => setElevation(3)}
      onMouseOut={() => setElevation(1)}
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Grid container spacing={2}>
        <Grid item container justifyContent={'center'} xs={2}>
          <Link to={`/books/${book.id}`}>
            <Box
              sx={{
                width: 128,
                height: 200,
              }}>
              <BookCoverImg
                alt={book.title}
                src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
              />
            </Box>
          </Link>
        </Grid>
        <Grid item xs={10} sm container>
          <Grid item xs={10} container direction="column" spacing={3}>
            <Grid item xs>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                sx={{ '&:hover': { textDecorationLine: 'underline' } }}>
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {book.bookCategories.map((category) => category.name).join(', ')}
              </Typography>
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
