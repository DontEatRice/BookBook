import * as React from 'react';
import { Typography, TableHead, TableBody, Table, Rating, Grid, Box, TableRow, TableContainer, Paper, Avatar, Button, Hidden } from '@mui/material';
import FilledField from '../../components/FilledField';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import StyledTableRow from '../../components/tableComponents/StyledTableRow';
import TextInputField from '../../components/TextInputField';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook } from '../../api/book';
import { useQuery } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import AddBookToCart from '../../components/reservations/BookLibraryDropdown';
import { useEffect, useState } from 'react';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { deleteReview, postReview } from '../../api/review';
import AddReview, { AddReviewType } from '../../models/AddReview';
import { BookViewModelType } from '../../models/BookViewModel';

function AuthorsTable({ authors }: { authors: AuthorViewModelType[] }) {
  const authorNames = authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');

  return <FilledField label={authors.length > 1 ? 'autorzy' : 'autor'} value={authorNames} />;
}

function CategoryTable({ categories }: { categories: BookCategoryViewModelType[] }) {
  const categoriesNames = categories.map((category) => category.name).join(', ');

  return <FilledField label={categories.length > 1 ? 'kategorie' : 'kategoria'} value={categoriesNames} />;
}

function ReviewsTable({ reviews, book }: { reviews: ReviewViewModelType[], book: BookViewModelType }) {
  const theme = useTheme();

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800}}>
    <Table aria-label="customized table">
      <TableHead>
        <TableRow>
          <StyledTableCell>Użytkownik</StyledTableCell>
          <StyledTableCell>Ocena</StyledTableCell>
          <StyledTableCell>Komentarz</StyledTableCell>
          <StyledTableCell>Akcje</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {reviews.map((review) => (
          <StyledTableRow key={review.id}>
            <StyledTableCell >
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>N</Avatar>
              <div>username</div>
            </StyledTableCell>
            <StyledTableCell>
            <Rating
              name="half-rating-read"
              value={review.rating == null ? 0 : review.rating}
              precision={0.25}
              readOnly
            />
            </StyledTableCell>
            <StyledTableCell>
            <Typography variant="h5">{review.title}</Typography>
              {review.description}
            </StyledTableCell>
            <StyledTableCell>
              <Button sx={{ width: 50, height: 40 }} onClick={() => mutation.mutate(review.id)}>
                Usuń
              </Button>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
    <Grid item><ReviewForm book={book}/></Grid>
  </TableContainer>
  );
}

function ReviewForm({ book }: { book: BookViewModelType }) {
  const [value, setValue] = React.useState<number | null>(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddReviewType>({
    resolver: zodResolver(AddReview),
  });
  const mutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit: SubmitHandler<AddReviewType> = (data) => {
    data.rating = value == null ? 0 : value;
    data.idBook = book.id;
    mutation.mutate(data);
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: { xs: '100%', sm: '85%', md: '65%' },
            textAlign: 'left',
          }}>
          <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
            <TextInputField errors={errors} field="title" register={register} label="Tytuł" />
            <TextInputField errors={errors} field="description" register={register} label="Komentarz" />
            <input type="hidden" {...register("idBook")} value={book.id}/>
            <Button type="submit" variant="contained">
              Dodaj
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

function BookDetails() {
  const params = useParams();
  const [bookId, setBookId] = useState<string>('');

  const { data, status } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: () => getBook(params.bookId + ''),
  });

  useEffect(() => {
    if (status === 'success' && data?.id) {
      setBookId(data.id);
    }
  }, [data?.id, status]);

  const item = { img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'hardcodedImg' };

  return (
    <div>
      <Box m={4}>
        {status == 'loading' && 'Ładowanie...'}
        {status == 'error' && 'Błąd!'}
        {status == 'success' && (
          <div>
            <Typography variant="h4" padding={2} marginTop={8} marginBottom={4}>
              {data.title}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={5}>
                <img
                  srcSet={`${item.img}`}
                  src={`${item.img}`}
                  alt={item.title}
                  width="300px"
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
      {AddBookToCart(bookId)}
    </div>
  );

  
}

export default BookDetails;

