import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FilledField from '../../components/FilledField';
import TableContainer from '@mui/material/TableContainer';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import StyledTableRow from '../../components/tableComponents/StyledTableRow';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook } from '../../api/book';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import AddBookToCart from '../../components/reservations/BookLibraryDropdown';
import { useEffect, useState } from 'react';

function AuthorsTable({ authors }: { authors: AuthorViewModelType[] }) {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Autorzy</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((author) => (
            <StyledTableRow key={author.id}>
              <StyledTableCell component="th" scope="row">
                {author.firstName + ' ' + author.lastName}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CategoryTable({ categories }: { categories: BookCategoryViewModelType[] }) {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Kategorie</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <StyledTableRow key={category.id}>
              <StyledTableCell component="th" scope="row">
                {category.name}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BookDetails() {
  const { register, handleSubmit } = useForm<ToggleBookInUserListType>({
    resolver: zodResolver(ToggleBookInUserList),
  });
  const mutation = useMutation({
    mutationFn: toggleBookInUserList,
    onError: (e: Error) => {
      console.log(e);
    },
    onSuccess: () => {
      data!.doesUserObserve = !data!.doesUserObserve;
    },
  });
  const onClick: SubmitHandler<ToggleBookInUserListType> = (toggleData) => {
    mutation.mutate(toggleData);
  };

  const params = useParams();
  const { data, status } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: () => getBook(params.bookId + ''),
  });
  const [bookId, setBookId] = useState<string>('');
  useEffect(() => {
    if (status === 'success' && data?.id) {
      setBookId(data.id);
    }
  }, [data?.id, status]);

  const item = { img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'hardcodedImg' };

  return (
    <div>
      <Box mt={2}>
        {status == 'loading' && 'Ładowanie...'}
        {status == 'error' && 'Błąd!'}
        {status == 'success' && (
          <Grid container spacing={2} direction="column">
            <div>
              <Grid item>
                <img
                  srcSet={`${item.img}`}
                  src={`${item.img}`}
                  alt={item.title}
                  width="300"
                  height="400"
                  loading="lazy"
                />
              </Grid>
              <AuthorizedView roles={['User']}>
                <input type="hidden" {...register('bookId')} value={data.id} />
                {data.doesUserObserve != null && (
                  <Button onClick={handleSubmit(onClick)}>
                    {data.doesUserObserve ? 'Usuń z obserwowanych' : 'Dodaj do obserwowanych'}
                  </Button>
                )}
              </AuthorizedView>
            </div>
            <Grid item>
              <FilledField label="ISBN" value={data.isbn} />
            </Grid>
            <Grid item>
              <FilledField label="Tytuł" value={data.title} />
            </Grid>
            <Grid item>
              <FilledField label="Rok wydania" value={data.yearPublished + ''} />
            </Grid>
            <Grid item>
              <FilledField label="Wydawca" value={data.publisher?.name + ''} />
            </Grid>
            <Grid item>
              <CategoryTable categories={data.bookCategories} />
            </Grid>
            <Grid item>
              <AuthorsTable authors={data.authors} />
            </Grid>
          </Grid>
        )}
      </Box>
      {AddBookToCart(bookId)}
    </div>
  );
}

export default BookDetails;
