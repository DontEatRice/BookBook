import { Box, Grid, Typography, useTheme } from '@mui/material';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import AuthorInList from '../../components/AuthorInList';
import { searchAuthors } from '../../api/author';
import { useQuery } from '@tanstack/react-query';

function Authors({ data }: { data: AuthorViewModelType[] }) {
  return (
    <Grid container spacing={1}>
      {data.map((author) => (
        <Grid item xs={6} key={author.id}>
          <AuthorInList author={author} />
        </Grid>
      ))}
    </Grid>
  );
}

function AuthorsList() {
  const theme = useTheme();
  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: ['searchAuthors'],
    queryFn: searchAuthors,
  });

  return (
    <Box>
      {searchStatus == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {searchStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {searchStatus == 'success' && <Authors data={searchData} />}
    </Box>
  );
}

export default AuthorsList;
