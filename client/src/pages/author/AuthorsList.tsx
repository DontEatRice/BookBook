import { Box, Button, Grid, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import AuthorInList from '../../components/AuthorInList';
import { getAuthors } from '../../api/author';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

function Authors({ data }: { data: AuthorViewModelType[] }) {
  return (
    <Grid container spacing={1}>
      {data.map((author) => (
        <Grid item xs={12} key={author.id}>
          <AuthorInList author={author} />
        </Grid>
      ))}
    </Grid>
  );
}

function AuthorsList() {
  const theme = useTheme();
  const [query, setQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const handleSearchType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSearchInput(value);
  };
  const handleSearch = () => {
    setQuery(searchInput);
  };
  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == 'Enter') {
      setQuery(searchInput);
    }
  };
  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: ['searchAuthors', query],
    queryFn: () => getAuthors({ pageSize: 50, pageNumber: 0, query: query == null ? '' : query }),
  });

  return (
    <div>
      <Box marginBottom={2} marginTop={2} display={'flex'} flexDirection={'row'}>
        <TextField
          fullWidth
          placeholder="Szukaj autorów"
          value={searchInput}
          onChange={handleSearchType}
          onKeyDown={handleSearchOnEnter}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" endIcon={<SearchIcon />} onClick={handleSearch}>
                  Szukaj
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box>
        {searchStatus == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
        {searchStatus == 'error' && (
          <Typography variant="h3" color={theme.palette.error.main}>
            Błąd!
          </Typography>
        )}
        {searchStatus == 'success' && <Authors data={searchData.data} />}
      </Box>
    </div>
  );
}

export default AuthorsList;
