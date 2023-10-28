import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAuthor } from '../../api/author';
import { Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';

function AuthorDetails() {
  const params = useParams();

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
          <Typography variant="h4" padding={2} marginTop={8} marginBottom={4}>
            {authorData.firstName + ' ' + authorData.lastName}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <img
                srcSet={`${
                  authorData.profilePictureUrl == null
                    ? '../../../public/autor-szablon.jpg'
                    : authorData.profilePictureUrl
                }`}
                src={`${
                  authorData.profilePictureUrl == null
                    ? '../../../public/autor-szablon.jpg'
                    : authorData.profilePictureUrl
                }`}
                alt={authorData.firstName + ' ' + authorData.lastName}
                width="300px"
                height="400px"
                loading="lazy"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                <TextField sx={{ marginBottom: 3 }} label="Rok urodzenia" value={authorData.birthYear} />
              </Box>
            </Grid>
            <Grid></Grid>
          </Grid>
        </div>
      )}
    </Box>
  );
}
export default AuthorDetails;
