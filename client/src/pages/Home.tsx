import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BookTile from '../components/book/BookTile';
import AuthorizedView from '../components/auth/AuthorizedView';
import { useAuth } from '../utils/auth/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getMostReservedBooks } from '../api/book';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MostReservedBookViewModelType } from '../models/MostReseredBook';
import LoadingTypography from '../components/common/LoadingTypography';
import { LibrariesMap } from '../components/libraries/LibrariesMap';

function Home() {
  const theme = useTheme();
  const { data: books, status: searchStatus } = useQuery({
    queryKey: ['mostReservedBooks'],
    queryFn: () => getMostReservedBooks(),
  });

  const { user } = useAuth();
  return (
    <Container sx={{ '& > *': { marginBottom: 15 } }}>
      <Typography variant="h2">
        Witamy w BookBook<AuthorizedView roles={['User']}> {user?.name}</AuthorizedView>!
      </Typography>
      <Box>
        {searchStatus == 'loading' && <LoadingTypography />}
        {searchStatus == 'error' && (
          <Typography variant="h3" color={theme.palette.error.main}>
            Błąd!
          </Typography>
        )}
        {searchStatus == 'success' && <Books data={books} />}
      </Box>
      <LibrariesMap />
    </Container>
  );
}

function Books({ data }: { data: MostReservedBookViewModelType[] }) {
  return (
    <div>
      <Typography variant="h3" marginBottom={5}>
        Najpopularniejsze książki
      </Typography>
      <Grid container justifyContent="space-between" m={2}>
        {data?.map((book) => (
          <Grid item key={book.id}>
            <BookTile book={book} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;

