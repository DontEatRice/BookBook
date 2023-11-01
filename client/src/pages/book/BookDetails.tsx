import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook } from '../../api/book';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import { Button, Stack, Typography } from '@mui/material';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import AddBookToCart from '../../components/reservations/BookLibraryDropdown';
import FilledField from '../../components/FilledField';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

function AuthorsTable({ authors }: { authors: AuthorViewModelType[] }) {
  const authorNames = authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');

  return <FilledField label={authors.length > 1 ? 'autorzy' : 'autor'} value={authorNames} />;
}

function CategoryTable({ categories }: { categories: BookCategoryViewModelType[] }) {
  const categoriesNames = categories.map((category) => category.name).join(', ');

  return <FilledField label={categories.length > 1 ? 'kategorie' : 'kategoria'} value={categoriesNames} />;
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

  const item = {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'hardcodedImg',
  };

  return (
    <div>
      <Box m={4}>
        {status == 'loading' && 'Ładowanie...'}
        {status == 'error' && 'Błąd!'}
        {status == 'success' && (
          <div>
            <Stack direction="row" justifyContent="space-between" padding={2} marginTop={8} marginBottom={4}>
              <Typography variant="h4">{data.title}</Typography>
              <AuthorizedView roles={['User']}>
                <input type="hidden" {...register('bookId')} value={data.id} />
                {data.doesUserObserve != null && (
                  <Button
                    color={data.doesUserObserve ? 'error' : 'primary'}
                    variant="contained"
                    onClick={handleSubmit(onClick)}
                    endIcon={data.doesUserObserve ? <DeleteOutlineRoundedIcon /> : <StarBorderRoundedIcon />}>
                    {data.doesUserObserve ? 'Przeczytane' : 'Do przeczytania'}
                  </Button>
                )}
              </AuthorizedView>
            </Stack>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <img
                  srcSet={`${item.img}`}
                  src={`${item.img}`}
                  alt={item.title}
                  width="280px"
                  height="400px"
                  loading="lazy"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="ISBN" value={data.isbn} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="Rok wydania" value={data.yearPublished + ''} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="Wydawca" value={data.publisher?.name + ''} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <AuthorsTable authors={data.authors} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <CategoryTable categories={data.bookCategories} />
                  </div>
                </Box>
              </Grid>
              <Grid></Grid>
            </Grid>
          </div>
        )}
      </Box>
      <AddBookToCart bookId={params.bookId as string} />
    </div>
  );
}

export default BookDetails;

