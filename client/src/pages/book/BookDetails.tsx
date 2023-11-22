import { Grid, Box } from '@mui/material';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook } from '../../api/book';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import Reviews from '../reviews/Reviews';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import FilledField from '../../components/FilledField';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { getReviews } from '../../api/review';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddBookToCart from '../../components/reservations/BookLibraryDropdown';
import AddReviewForm from '../reviews/AddReviewForm';

function AuthorsList({ authors }: { authors: AuthorViewModelType[] }) {
  const authorNames = authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');

  return <FilledField label={authors.length > 1 ? 'Autorzy' : 'Autor'} value={authorNames} />;
}

function CategoriesList({ categories }: { categories: BookCategoryViewModelType[] }) {
  const categoriesNames = categories.map((category) => category.name).join(', ');

  return <FilledField label={categories.length > 1 ? 'Kategorie' : 'Kategoria'} value={categoriesNames} />;
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
      book!.doesUserObserve = !book!.doesUserObserve;
    },
  });
  const onClick: SubmitHandler<ToggleBookInUserListType> = (toggleData) => {
    mutation.mutate(toggleData);
  };

  const params = useParams();

  const { data: book, status: statusBook } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: () => getBook(params.bookId + ''),
  });

  const { data: reviews, status: statusReviews } = useQuery({
    queryKey: ['reviews', params.bookId],
    queryFn: () => getReviews(params.bookId +'', { pageNumber: 0, pageSize: 50}), 
  });

  const item = {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'hardcodedImg',
  };

  return (
    <div>
      <Box m={4}>
        {statusBook == 'loading' && 'Ładowanie...'}
        {statusBook == 'error' && 'Błąd!'}
        {statusBook == 'success' && (
          <div>
            <Stack direction="row" justifyContent="space-between" padding={2} marginTop={8} marginBottom={4}>
              <Typography variant="h4">{book.title}</Typography>
              <AuthorizedView roles={['User']}>
                <input type="hidden" {...register('bookId')} value={book.id} />
                {book.doesUserObserve != null && (
                  <Button
                    color={book.doesUserObserve ? 'error' : 'primary'}
                    variant="contained"
                    onClick={handleSubmit(onClick)}
                    endIcon={book.doesUserObserve ? <DeleteOutlineRoundedIcon /> : <StarBorderRoundedIcon />}>
                    {book.doesUserObserve ? 'Przeczytane' : 'Do przeczytania'}
                  </Button>
                )}
              </AuthorizedView>
            </Stack>
            <Grid container spacing={1} marginBottom={3}>
              <Grid item md={5} xs={12}>
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
                    <FilledField label="ISBN" value={book.isbn} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="Rok wydania" value={book.yearPublished + ''} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="Wydawca" value={book.publisher?.name + ''} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <AuthorsList authors={book.authors} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <CategoriesList categories={book.bookCategories} />
                  </div>
                </Box>
              </Grid>
            </Grid>
            <Box>
              <AddBookToCart bookId={params.bookId as string} />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <AddReviewForm book={book}></AddReviewForm>
              {statusReviews == 'loading' && 'Ładowanie opinii...'}
              {statusReviews == 'error' && 'Błąd!'}
              {statusReviews == 'success' && (
                <Reviews book={book} reviews={reviews.data} /> 
              )}
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
}

export default BookDetails;

