import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BookTile from '../components/BookTile';
import { BookViewModelType } from '../models/BookViewModel';
import AuthorizedView from '../components/auth/AuthorizedView';
import { useAuth } from '../utils/auth/useAuth';

function Home() {
  const { user } = useAuth();
  const book: BookViewModelType = {
    title: 'Wiedźmin',
    yearPublished: 12,
    id: 'abcde',
    authors: [],
    isbn: 'commit',
    publisher: {
      id: 'guid-guid',
      name: 'Be Do Gie',
      description: null,
    },
    bookCategories: [],
    averageRating: 4,
    averageCriticRating: 5,
  };
  return (
    <Container>
      <Typography variant="h3">
        Witamy w BookBook<AuthorizedView roles={['User']}> {user?.email}</AuthorizedView>!
      </Typography>
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
