import { useTheme } from '@mui/material/styles';
import { BookViewModelType } from '../models/BookViewModel';
import { useNavigate } from 'react-router-dom';
import { ButtonBase, Grid, Paper, Rating, Typography, styled } from '@mui/material';

function BookInList({ book }: { book: BookViewModelType }) {
  const theme = useTheme();
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
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src="/krew-elfow-wiedzmin-tom-3-w-iext133112616.jpg" />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
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
          <Grid item>
            <Rating
              name="half-rating-read"
              value={book.averageRating == null ? 2.5 : book.averageRating}
              precision={0.25}
              readOnly
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BookInList;
