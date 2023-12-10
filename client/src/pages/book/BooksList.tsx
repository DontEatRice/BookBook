import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BookViewModelType } from '../../models/BookViewModel';
import { useTheme } from '@mui/material/styles';
import { searchBooks } from '../../api/book';
import BookInList from '../../components/book/BookInList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import { Autocomplete, Button, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { getAuthors } from '../../api/author';
import { getCategories } from '../../api/category';
import LoadingTypography from '../../components/common/LoadingTypography';

// przyklad z https://mui.com/material-ui/react-table/#sorting-amp-selecting

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// type Order = 'asc' | 'desc';

// function getComparator<Key extends keyof BookViewModelType>(
//   order: Order,
//   orderBy: Key
// ): (a: BookViewModelType, b: BookViewModelType) => number {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 10,
};

function Books({ data }: { data: BookViewModelType[] }) {
  return (
    <Grid container spacing={1}>
      {data.map((book) => (
        <Grid item xs={12} key={book.id}>
          <BookInList book={book} />
        </Grid>
      ))}
    </Grid>
  );
}

function BooksList() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [searchInput, setSearchInput] = useState<string>('');
  const [authorId, setAuthorId] = useState<string>();
  const [categoryId, setCategoryId] = useState<string>();
  const [year, setYear] = useState<number>();
  const [yearFilter, setYearFilter] = useState<number>();

  const { data: authorsData } = useQuery({
    queryKey: ['authors'],
    queryFn: () => getAuthors(paginationDefaultRequest),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(paginationDefaultRequest),
  });

  const [query, setQuery] = useState<string>('');

  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: ['searchBooks', query, authorId, categoryId, yearFilter],
    queryFn: () =>
      searchBooks({
        pageSize: 50,
        pageNumber: 0,
        query: query == null ? '' : query,
        authorId: authorId,
        categoryId: categoryId,
        yearPublished: yearFilter,
      }),
  });

  const handleSearchType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const handleSearch = () => {
    setYearFilter(year);
    setQuery(searchInput);
  };
  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == 'Enter') {
      setYearFilter(year);
      setQuery(searchInput);
    }
  };

  return (
    <div>
      <Box
        marginBottom={2}
        marginTop={2}
        display={'flex'}
        flexDirection={'row'}
        flexWrap={'wrap'}
        sx={{ zIndex: 5 }}>
        <Box marginBottom={1} marginRight={1} flexGrow={1}>
          <Autocomplete
            fullWidth
            disablePortal={true}
            options={authorsData?.data || []}
            getOptionLabel={(author) => `${author.firstName} ${author.lastName}`}
            value={authorsData?.data.find((author) => author.id === authorId) || null}
            onChange={(_, newValue) => {
              setAuthorId(newValue?.id);
              setYearFilter(year);
              queryClient.refetchQueries(['searchBooks', query, authorId, year]);
            }}
            renderInput={(params) => <TextField {...params} label="Autor" placeholder="Autor" />}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 1,
                },
              },
            }}
          />
        </Box>
        <Box marginBottom={1} marginRight={1} flexGrow={1}>
          <Autocomplete
            fullWidth
            options={categoriesData?.data || []}
            getOptionLabel={(category) => `${category.name}`}
            value={categoriesData?.data.find((category) => category.id === categoryId) || null}
            onChange={(_, newValue) => {
              setCategoryId(newValue?.id);
              setYearFilter(year);
              queryClient.refetchQueries(['searchBooks', query, authorId, yearFilter]);
            }}
            renderInput={(params) => <TextField {...params} label="Kategoria" placeholder="Kategoria" />}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 1,
                },
              },
            }}
          />
        </Box>
        <Box marginBottom={1} marginRight={1} flexGrow={1} width={10}>
          <TextField
            fullWidth
            type="number"
            placeholder="Rok wydania"
            value={year == undefined ? '' : year}
            onChange={(e) => {
              const { value } = e.target;
              setYear(value == '' ? undefined : parseInt(value));
            }}
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                setYearFilter(year);
                queryClient.refetchQueries(['searchBooks', query, authorId, yearFilter]);
              }
            }}
          />
        </Box>
        <Box marginBottom={1} marginRight={1} flexGrow={1}>
          <TextField
            fullWidth
            placeholder="Szukaj książek"
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
      </Box>
      <Box marginTop={2}>
        {searchStatus == 'loading' && <LoadingTypography />}
        {searchStatus == 'error' && (
          <Typography variant="h3" color={theme.palette.error.main}>
            Błąd!
          </Typography>
        )}
        {searchStatus == 'success' && <Books data={searchData.data} />}
      </Box>
    </div>
  );
}

export default BooksList;
