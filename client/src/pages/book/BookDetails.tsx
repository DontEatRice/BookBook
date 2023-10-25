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
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { deleteReview, postReview } from '../../api/review';
import AddReview, { AddReviewType } from '../../models/AddReview';
import NumberInputField from '../../components/NumberInputField';
import { BookViewModelType } from '../../models/BookViewModel';

function AuthorsTable({ authors }: { authors: AuthorViewModelType[] }) {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: 400}}>
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
                    {author.firstName + " " + author.lastName}
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
      <TableContainer component={Paper} sx={{ maxWidth: 400}}>
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
    const { data, status } = useQuery({ queryKey: ['books', params.bookId], queryFn: () => getBook(params.bookId+"") });

    const item = {img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'hardcodedImg'}

    return (
        <Box mt={2}>
            {status == 'loading' && 'Ładowanie...'}
            {status == 'error' && (
              'Błąd!'
            )}
            {status == 'success' && (
                <Grid container spacing={2} direction="column">
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
                    <Grid item><FilledField label="ISBN" value={data.isbn}/></Grid>
                    <Grid item><FilledField label="Tytuł" value={data.title}/></Grid>
                    <Grid item><FilledField label="Rok wydania" value={data.yearPublished+""}/></Grid>
                    <Grid item><FilledField label="Wydawca" value={data.publisher?.name+""}/></Grid>
                    <Grid item><CategoryTable categories = {data.bookCategories}/></Grid>
                    <Grid item><AuthorsTable authors = {data.authors}/></Grid>
                    <Grid item><ReviewsTable reviews = {data.reviews} book = {data} /></Grid>
                </Grid>
            )}
        </Box>
    );
}

export default BookDetails;
