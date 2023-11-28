import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { bookRanking } from '../../api/book';

import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import BookInRanking from '../../components/ranking/BookInRanking';
import { Button } from '@mui/material';
import { useState } from 'react';
import { Order } from '../../utils/constants';
import { BookInRankingViewModelType } from '../../models/BookInRankingViewModel';

export default function BookRanking() {
  const theme = useTheme();
  const [sortDirection, setSortDirection] = useState<Order>('desc');

  const { data: searchData, status: searchStatus } = useQuery({
    queryKey: ['searchBooks', sortDirection],
    queryFn: () =>
      bookRanking({
        pageSize: 20,
        pageNumber: 0,
        orderByField: 'AverageRating',
        orderDirection: sortDirection,
      }),
  });

  const handleSortDirectionChange = () => {
    setSortDirection((prevSortDirection) => (prevSortDirection === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <Box marginTop={2}>
      {searchStatus == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {searchStatus == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {searchStatus == 'success' && (
        <Books data={searchData.data.filter((book) => book.averageRating !== null)} />
      )}
    </Box>
  );

  function Books({ data }: { data: BookInRankingViewModelType[] }) {
    return (
      <Box key={sortDirection} marginTop={2}>
        <Box margin={3}>
          <Typography variant="h3">Ranking książek</Typography>
          <Typography variant="h4">
            {sortDirection === 'desc' ? 'Najlepiej' : 'Najgorzej'} oceniane
          </Typography>
          <Button onClick={handleSortDirectionChange}>Zmień kolejność</Button>
        </Box>

        <Grid container spacing={1}>
          {data.map(
            (book, index) =>
              book.averageRating !== null && (
                <Grid item xs={12} key={book.id}>
                  <BookInRanking book={book} position={index + 1} />
                </Grid>
              )
          )}
        </Grid>
      </Box>
    );
  }
}

