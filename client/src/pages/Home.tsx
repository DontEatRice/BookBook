import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BookTile from '../components/BookTile';
import { BookViewModelType } from '../models/BookViewModel';

function Home() {
  const book: BookViewModelType = {
    title: 'Wiedźmin',
    yearPublished: 12,
    id: 'abcde',
    authors: [],
    isbn: 'commit',
    publisher: {
      id: 'guid-guid',
      name: 'Be Do Gie',
    },
    bookCategories: [],
    averageRating: 4,
    averageCriticRating: 5
  };
  return (
    <Container>
      <Typography variant="h3">Witamy w BookBook!</Typography>
      <Grid container justifyContent="space-between">
        <Grid item>
          <BookTile book={book} />
        </Grid>
        <Grid item>
          <BookTile book={book} />
        </Grid>
        <Grid item>
          <BookTile book={book} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
