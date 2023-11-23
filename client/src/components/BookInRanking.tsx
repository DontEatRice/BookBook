import { BookViewModelType } from '../models/BookViewModel';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Rating, styled } from '@mui/material';

export default function BookInRanking({ book, position }: { book: BookViewModelType; position: number }) {
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
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <Typography variant="h5" component="div" color="white">
              {position}
            </Typography>
          </Avatar>
        </Grid>
        <Grid item>
          <Button sx={{ width: 180, height: 180 }} onClick={() => navigate(`/books/${book.id}`)}>
            <Img alt="complex" src={book.coverPictureUrl ?? '/public/podstawowa-ksiazka-otwarta.jpg'} />
          </Button>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                {book.title}
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
            <Grid item display={'flex'} flexDirection={'column'}>
              <Rating name="half-rating-read" value={book.averageRating} precision={0.25} readOnly />
              <Typography variant="body1" gutterBottom marginY={2}>
                {book.reviews.length} {getRatingText(book.reviews.length)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                średnia: {book.averageRating}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

function getRatingText(count: number) {
  if (count === 1) {
    return 'ocena';
  } else if (count > 1 && count < 5) {
    return 'oceny';
  } else {
    return 'ocen';
  }
}
