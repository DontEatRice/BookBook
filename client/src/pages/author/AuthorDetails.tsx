import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAuthor, getAuthorBookCards } from '../../api/author';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import AuthorBookCard from '../../components/author/AuthorBookCard';
import LoadingTypography from '../../components/common/LoadingTypography';
import { imgUrl } from '../../utils/utils';
import { BookViewModelType } from '../../models/BookViewModel';

function AuthorDetails() {
  const params = useParams();
  const { data: authorData, status: authorDataStatus } = useQuery({
    queryKey: ['authors', params.authorId],
    queryFn: () => getAuthor(params.authorId + ''),
  });
  const { data: booksData, isLoading: isBooksLoading } = useQuery({
    queryKey: ['author-book-cards', params.authorId],
    queryFn: () => getAuthorBookCards(params.authorId + ''),
  });

  return (
    <Box mt={2}>
      {authorDataStatus == 'loading' && <LoadingTypography />}
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
                src={imgUrl(authorData.profilePictureUrl, '/public/autor-szablon.jpg')}
                sx={{ width: 300, height: 300 }}
              />
            </Grid>
            <Grid item md={6} xs={12} container spacing={2}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', padding: 1 }} container>
                <Grid item xs>
                  <Typography variant="subtitle1">Rok urodzenia:</Typography>
                  <Typography variant="h6" width="100%">
                    {authorData.birthYear.toString()}
                  </Typography>
                </Grid>
                <Grid item xs>
                  {authorData.description ? (
                    <>
                      <Typography variant="subtitle1">Życiorys</Typography>
                      <Typography variant="h6">{authorData.description}</Typography>
                    </>
                  ) : (
                    <Typography>Brak informacji o życiorysie tego autora.</Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
      <div>{<AuthorBookCards isBooksLoading={isBooksLoading} booksData={booksData} />}</div>
    </Box>
  );
}

function AuthorBookCards({
  booksData,
  isBooksLoading,
}: {
  booksData?: BookViewModelType[];
  isBooksLoading: boolean;
}) {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
      {(isBooksLoading || !booksData || (booksData && booksData.length > 0)) && (
        <Typography variant="h5" gutterBottom>
          Poznaj autora bliżej
        </Typography>
      )}
      {isBooksLoading && <LoadingTypography />}
      {booksData && booksData.length === 0 && (
        <Typography variant="h5" gutterBottom>
          Obecnie w naszej ofercie nie znajdują się jeszcze książki tego autora.
        </Typography>
      )}
      {booksData && booksData.length > 0 && (
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
