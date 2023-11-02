import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAuthor, getAuthorBookCards } from '../../api/author';
import { Avatar, Box, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import AuthorBookCard from '../../components/author/AuthorBookCard';

function AuthorDetails() {
  const params = useParams();
  const theme = useTheme();
  const { data: authorData, status: authorDataStatus } = useQuery({
    queryKey: ['authors', params.authorId],
    queryFn: () => getAuthor(params.authorId + ''),
  });

  return (
    <Box mt={2}>
      {authorDataStatus == 'loading' && <CircularProgress />}
      {authorDataStatus == 'error' && 'Błąd!'}
      {authorDataStatus == 'success' && (
        <div>
          <Typography variant="h3" padding={2} marginTop={8} marginBottom={4}>
            {authorData.firstName + ' ' + authorData.lastName}
          </Typography>
          <Grid container spacing={1} marginBottom={7}>
            <Grid item xs={12} md={5}>
              <Avatar
                alt={authorData.firstName + ' ' + authorData.lastName}
                src={
                  authorData.profilePictureUrl == null
                    ? '../../../public/autor-szablon.jpg'
                    : authorData.profilePictureUrl
                }
                sx={{ width: 300, height: 300 }}
              />
            </Grid>
            <Grid item md={6} xs={12} container spacing={2}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', padding: 1 }} container spacing={2}>
                <Grid item xs>
                  <Typography variant="subtitle1">Rok urodzenia:</Typography>
                  <Typography variant="h6" width="100%">
                    {authorData.birthYear.toString()}
                  </Typography>
                </Grid>
                <Grid item xs>
                  {authorData.description != null && <Typography variant="subtitle1">Życiorys</Typography>}
                  {authorData.description != null && (
                    <Typography variant="h6">{authorData.description}</Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
      <div>{<AuthorBookCards />}</div>
    </Box>
  );
}

function AuthorBookCards() {
  const params = useParams();
  const { data: booksData, status: booksStatus } = useQuery({
    queryKey: ['author-book-cards', params.authorId],
    queryFn: () => getAuthorBookCards(params.authorId + ''),
  });

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
      <Typography variant="h5" gutterBottom>
        Poznaj autora bliżej
      </Typography>
      {booksStatus == 'loading' && <CircularProgress />}
      {booksStatus == 'error' && 'Błąd!'}
      {booksStatus == 'success' && booksData.length != 0 && (
        <Box display={'flex'} flexDirection={'row'}>
          <Grid container flexDirection={'row'} spacing={3}>
            {booksData.map((book) => (
              <Grid item xs key={book.id}>
                <AuthorBookCard book={book} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
export default AuthorDetails;
