import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAuthor } from '../../api/author';
import { Avatar, Box, CircularProgress, Grid, Typography } from '@mui/material';
import FilledField from '../../components/FilledField';

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
            <Grid item md={6} xs={12}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                <Grid item xs={12}>
                  <FilledField label="Rok urodzenia" value={authorData.birthYear.toString()} />
                </Grid>
                <Grid>
                  {authorData.description != null && <Typography>{authorData.description}</Typography>}
                </Grid>
              </Grid>
            </Grid>
            <Grid></Grid>
          </Grid>
        </div>
      )}
    </Box>
  );
}
export default AuthorDetails;
