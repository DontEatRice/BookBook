import { BookViewModelType } from '../../models/BookViewModel';
import { useQuery } from '@tanstack/react-query';
import { getUserBooks } from '../../api/user';
import BookInUserList from '../../components/book/BookInUserList';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, Pagination, Typography } from '@mui/material';
import { PaginationRequest } from '../../utils/constants';
import { ChangeEvent, useState } from 'react';
import Loading from '../../components/common/Loading';

function UserBooks({ data }: { data: BookViewModelType[] }) {
  if (data.length == 0) {
    return (
      <Box alignContent={'center'} textAlign={'center'}>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Nie masz żadnych obserwowanych książek!
        </Typography>
        <Button href="/books" variant="contained">
          Przeglądaj książki
        </Button>
      </Box>
    );
  } else {
    return (
      <Grid container spacing={1}>
        {data.map((book) => (
          <Grid item xs={12} key={book.id}>
            <BookInUserList book={book} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

function UserBooksList() {
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

  const { data, status } = useQuery({
    queryKey: ['getUserBooks', paginationProps.pageNumber],
    queryFn: () => getUserBooks({ pageNumber: 0, pageSize: 10 }),
  });
  return (
    <Box>
      {status == 'loading' && <Loading />}
      {status == 'success' && (
        <Box>
          <UserBooks data={data.data} />
          {data.data.length > 0 && (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginTop={3}>
              <Pagination
                onChange={handlePageChange}
                page={paginationProps.pageNumber + 1}
                count={Math.ceil(data.count / paginationProps.pageSize)}
                sx={{ justifySelf: 'center' }}
                size="large"
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default UserBooksList;
