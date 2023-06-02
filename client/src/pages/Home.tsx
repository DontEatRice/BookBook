import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BookType } from '../models';
import BookTile from '../components/BookTile';

function Home() {
  const book: BookType = {
    name: 'Wiedźmin',
    price: 123.56,
    id: 'abcde',
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
