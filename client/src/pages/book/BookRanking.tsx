import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { bookRanking } from '../../api/book';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import BookInRanking from '../../components/ranking/BookInRanking';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { Order, PaginationRequest } from '../../utils/constants';
import { BookInRankingViewModelType } from '../../models/BookInRankingViewModel';
import { getCategories } from '../../api/category';

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 10,
};

export default function BookRanking() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [sortDirection, setSortDirection] = useState<Order>('desc');
  const [categoryId, setCategoryId] = useState<string>();
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });

  const handleSortDirectionChange = () => {
    setSortDirection((prevSortDirection) => (prevSortDirection === 'desc' ? 'asc' : 'desc'));
  };
  const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    setPaginationProps({
      ...paginationProps,
      pageNumber: newPage - 1,
    });
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(paginationDefaultRequest),
  });

  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: ['bookRanking', sortDirection, paginationProps.pageNumber, categoryId],
    queryFn: () =>
      bookRanking({
        pageSize: paginationProps.pageSize,
        pageNumber: paginationProps.pageNumber,
        orderByField: 'AverageRating',
        orderDirection: sortDirection,
        categoryId: categoryId,
      }),
  });

  return (
    <Box marginTop={2}>
      {searchStatus == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {searchStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {searchStatus == 'success' && (
        <Box>
          <Books
            data={searchData.data}
            pageNumber={paginationProps.pageNumber}
            pageSize={paginationProps.pageSize}
          />
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
        </Box>
      )}
    </Box>
  );

  function Books({
    data,
    pageNumber,
    pageSize,
  }: {
    data: BookInRankingViewModelType[];
    pageNumber: number;
    pageSize: number;
  }) {
    return (
      <Box key={sortDirection} marginTop={2}>
        <Box margin={3} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h3">Ranking książek</Typography>
          <Box display={'flex'} flexDirection={'row'}>
            <Box marginBottom={1} marginRight={2} flexGrow={1} minWidth={120}>
              <Autocomplete
                fullWidth
                options={categories?.data || []}
                getOptionLabel={(category) => `${category.name}`}
                value={categories?.data.find((category) => category.id === categoryId) || null}
                onChange={(_, newValue) => {
                  console.log(newValue);
                  setCategoryId(newValue?.id);
                  queryClient.refetchQueries([
                    'bookRanking',
                    sortDirection,
                    paginationProps.pageNumber,
                    categoryId,
                  ]);
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
            <Box marginBottom={1} marginRight={1} flexGrow={1}>
              <FormControl>
                <InputLabel id="ranking-direction-label">Sortuj</InputLabel>
                <Select
                  value={sortDirection}
                  label="Sortuj"
                  onChange={handleSortDirectionChange}
                  labelId="ranking-direction-label">
                  <MenuItem value={'asc'}>Najgorsze</MenuItem>
                  <MenuItem value={'desc'}>Najlepsze</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={1}>
          {data.map((book, index) => (
            <Grid item xs={12} key={book.id}>
              <BookInRanking book={book} position={pageNumber * pageSize + index + 1} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}
