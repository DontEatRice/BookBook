import { BookViewModelType } from '../../models/BookViewModel';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Rating, Typography, styled } from '@mui/material';
import { imgUrl } from '../../utils/utils';

function BookInList({ book }: { book: BookViewModelType }) {
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
        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Grid container spacing={2}>
        <Grid item>
          <Button sx={{ width: 180, height: 180 }} onClick={() => navigate(`/books/${book.id}`)}>
            <Img
              alt="complex"
              loading="lazy"
              src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {book.bookCategories.map((category) => category.name).join(', ')}
              </Typography>
            </Grid>
          </Grid>
          {book.averageRating && (
            <Grid item>
              <Rating name="half-rating-read" value={book.averageRating} precision={0.25} readOnly />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BookInList;
