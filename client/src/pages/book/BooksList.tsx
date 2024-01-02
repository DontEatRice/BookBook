import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BookViewModelType } from '../../models/BookViewModel';
import { searchBooks } from '../../api/book';
import BookInList from '../../components/book/BookInList';
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import { Autocomplete, Button, InputAdornment, Pagination, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { getAuthors } from '../../api/author';
import { getCategories } from '../../api/category';
import { PaginationRequest } from '../../utils/constants';
import { getLibraries } from '../../api/library';
import { useSearchParams } from 'react-router-dom';
import LoadingTypography from '../../components/common/LoadingTypography';
import ClearIcon from '@mui/icons-material/Clear';

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
    <Grid container spacing={2}>
      {data.map((book) => (
        <Grid item xs={12} key={book.id}>
          <BookInList book={book} />
        </Grid>
      ))}
    </Grid>
  );
}

function BooksList() {
  const [searchParams] = useSearchParams();
  const [authorId, setAuthorId] = useState<string>();
  const [categoryId, setCategoryId] = useState<string>();
  const [libraryId, setLibraryId] = useState<string>();
  const [year, setYear] = useState<number>();
  const [yearFilter, setYearFilter] = useState<number>();
  const clearYearQuery = () => {
    setYear(undefined);
    setYearFilter(undefined);
  };

  const { data: authorsData } = useQuery({
    queryKey: ['authors'],
    queryFn: () => getAuthors(paginationDefaultRequest),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(paginationDefaultRequest),
  });

  const { data: librariesData } = useQuery({
    queryKey: ['libraries'],
    queryFn: () => getLibraries(paginationDefaultRequest),
  });

  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });
  const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    setPaginationProps({
      ...paginationProps,
      pageNumber: newPage - 1,
    });
  };

  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: [
      'searchBooks',
      searchParams.get('q') ?? '',
      authorId,
      categoryId,
      yearFilter,
      libraryId,
      paginationProps.pageNumber,
      paginationProps.pageSize,
    ],
    queryFn: () =>
      searchBooks({
        pageSize: paginationProps.pageSize,
        pageNumber: paginationProps.pageNumber,
        query: searchParams.get('q') ?? '',
        authorId: authorId,
        categoryId: categoryId,
        yearPublished: yearFilter,
        libraryId: libraryId,
      }),
    keepPreviousData: true,
  });

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
              }
            }}
            InputProps={{
              endAdornment: (
                <Box>
                  <InputAdornment position="end">
                    {year != undefined && year.toString().length > 0 && (
                      <Button onClick={clearYearQuery}>
                        <ClearIcon></ClearIcon>
                      </Button>
                    )}
                  </InputAdornment>
                </Box>
              ),
            }}
          />
        </Box>
        <Box marginBottom={1} marginRight={1} flexGrow={1}>
          <Autocomplete
            fullWidth
            options={librariesData?.data || []}
            getOptionLabel={(library) => `${library.name}`}
            value={librariesData?.data.find((library) => library.id === libraryId) || null}
            onChange={(_, newValue) => {
              setLibraryId(newValue?.id);
            }}
            renderInput={(params) => <TextField {...params} label="Biblioteka" placeholder="Biblioteka" />}
          />
        </Box>
      </Box>
      <Box marginTop={2}>
        {searchStatus == 'loading' && <LoadingTypography />}
        {searchStatus == 'success' && (
          <Box>
            <Books data={searchData.data} />
            {searchData.data.length > 0 ? (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginTop={3}>
                <Pagination
                  onChange={handlePageChange}
                  page={paginationProps.pageNumber + 1}
                  count={Math.ceil(searchData.count / paginationProps.pageSize)}
                  sx={{ justifySelf: 'center' }}
                  size="large"
                  color="primary"
                />
              </Box>
            ) : (
              <Typography variant="h5" textAlign={'center'}>
                Brak wyników
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
}

export default BooksList;
