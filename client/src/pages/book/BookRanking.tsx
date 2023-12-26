import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { bookRanking } from '../../api/book';
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import BookInRanking from '../../components/ranking/BookInRanking';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { PaginationRequest } from '../../utils/constants';
import { BookInRankingViewModelType } from '../../models/BookInRankingViewModel';
import { getCategories } from '../../api/category';
import Loading from '../../components/common/Loading';

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 100,
};

export default function BookRanking() {
  const theme = useTheme();
  const [categoryId, setCategoryId] = useState<string>();
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
    orderByField: 'averageRating',
    orderDirection: 'desc',
  });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;

  const handleSortDirectionChange = (e: SelectChangeEvent<string>) => {
    switch (e.target.value) {
      case 'desc':
        setPaginationProps({
          ...paginationProps,
          orderByField: 'averageRating',
          orderDirection: 'desc',
        });
        break;
      case 'asc':
        setPaginationProps({
          ...paginationProps,
          orderByField: 'averageRating',
          orderDirection: 'asc',
        });
        break;
      case 'descCritic':
        setPaginationProps({
          ...paginationProps,
          orderByField: 'averageCriticRating',
          orderDirection: 'desc',
        });
        break;
      case 'ascCritic':
        setPaginationProps({
          ...paginationProps,
          orderByField: 'averageCriticRating',
          orderDirection: 'asc',
        });
        break;
      default:
        setPaginationProps({
          ...paginationProps,
          orderByField: 'averageRating',
          orderDirection: 'desc',
        });
    }
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
    queryKey: ['bookRanking', categoryId, pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () =>
      bookRanking({
        pageSize: pageSize,
        pageNumber: pageNumber,
        orderByField: orderByField,
        orderDirection: orderDirection,
        categoryId: categoryId,
      }),
    keepPreviousData: true,
  });

  return (
    <Box marginTop={2}>
      {searchStatus == 'loading' && <Loading />}
      {searchStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {searchStatus == 'success' && (
        <Box>
          <Books
            data={searchData.data}
            pageNumber={pageNumber}
            pageSize={pageSize}
            orderByField={orderByField!}
            orderDirection={orderDirection!}
          />
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
  );

  function Books({
    data,
    pageNumber,
    pageSize,
  }: {
    data: BookInRankingViewModelType[];
    pageNumber: number;
    pageSize: number;
    orderByField: string;
    orderDirection: string;
  }) {
    const [sortValue, setSortValue] = useState<string>('desc');
    return (
      <Box marginTop={2}>
        <Box margin={3} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h3">Ranking książek</Typography>
          <Box display={'flex'} flexDirection={'row'}>
            <Box marginBottom={1} marginRight={2} flexGrow={1} minWidth={150}>
              <Autocomplete
                fullWidth
                options={categories?.data || []}
                getOptionLabel={(category) => `${category.name}`}
                value={categories?.data.find((category) => category.id === categoryId) || null}
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
            <Box marginBottom={1} marginRight={1} flexGrow={1}>
              <FormControl>
                <InputLabel id="ranking-direction-label">Sortuj</InputLabel>
                <Select
                  fullWidth
                  value={sortValue}
                  label="Sortuj"
                  onChange={(e: SelectChangeEvent<string>) => {
                    setSortValue(e.target.value);
                    handleSortDirectionChange(e);
                  }}
                  labelId="ranking-direction-label">
                  <MenuItem value={'asc'}>Najgorsze</MenuItem>
                  <MenuItem value={'desc'}>Najlepsze</MenuItem>
                  <MenuItem value={'ascCritic'}>Najgorsze według krytyków</MenuItem>
                  <MenuItem value={'descCritic'}>Najlepsze według krytyków</MenuItem>
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
