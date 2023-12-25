import { Grid, Box, Stack, Rating, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { getBook } from '../../api/book';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import Reviews from '../reviews/ReviewsStack';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { getCriticReviews, getReviews } from '../../api/review';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import 'leaflet/dist/leaflet.css';
import LoadingTypography from '../../components/common/LoadingTypography';
import LibrariesStack from '../../components/book/LibrariesStack';
import { Link } from 'react-router-dom';
import { PaginationRequest } from '../../utils/constants';
import { Pagination } from '@mui/material';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { imgUrl } from '../../utils/utils';
import AddReviewForm from '../reviews/AddReviewForm';
import { useAuth } from '../../utils/auth/useAuth';

function AuthorsList({ authors }: { authors: AuthorViewModelType[] }) {
  return (
    <Grid item xs>
      <Typography variant="subtitle1">{authors.length > 1 ? 'Autorzy' : 'Autor'}</Typography>
      <Typography variant="h6">
        {authors.map((author, i, arr) => {
          const value = author.firstName + ' ' + author.lastName + (arr.length - 1 === i ? '' : ', ');

          return (
            <Link to={`/authors/${author.id}`} key={author.id} style={{ textDecoration: 'none' }}>
              {value}
            </Link>
          );
        })}
      </Typography>
    </Grid>
  );
}

function CategoriesList({ categories }: { categories: BookCategoryViewModelType[] }) {
  const categoriesNames = categories.map((category) => category.name).join(', ');

  return (
    <Grid item xs>
      <Typography variant="subtitle1">{categories.length > 1 ? 'Kategorie' : 'Kategoria'}</Typography>
      <Typography variant="h6">{categoriesNames}</Typography>
    </Grid>
  );
}

function BookDetails() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<ToggleBookInUserListType>({
    resolver: zodResolver(ToggleBookInUserList),
  });
  const mutation = useMutation({
    mutationFn: toggleBookInUserList,
    onSuccess: () => {
      book!.doesUserObserve = !book!.doesUserObserve;
      queryClient.refetchQueries(['getUserBooks']);
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

  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [criticPaginationProps, setCriticPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });

  const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    setPaginationProps({
      ...paginationProps,
      pageNumber: newPage - 1,
    });
  };

  const handleCriticPageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    setCriticPaginationProps({
      ...paginationProps,
      pageNumber: newPage - 1,
    });
  };

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (_e: SyntheticEvent, tabIndex: number) => {
    setCurrentTabIndex(tabIndex);
  };

  const { data: reviews, status: statusReviews } = useQuery({
    queryKey: ['reviews', params.bookId ?? '', paginationProps.pageNumber],
    queryFn: () => getReviews(params.bookId + '', { ...paginationProps }),
  });

  const { data: criticReviews, status: statusCriticReviews } = useQuery({
    queryKey: ['criticReviews', params.bookId ?? '', criticPaginationProps.pageNumber],
    queryFn: () => getCriticReviews(params.bookId + '', { ...criticPaginationProps }),
  });

  return (
    <div>
      <Box mt={4}>
        {statusBook == 'loading' && <LoadingTypography />}
        {statusBook == 'error' && 'Błąd!'}
        {statusBook == 'success' && (
          <div>
            <Stack direction="row" justifyContent="space-between" padding={2} marginTop={5} marginBottom={0}>
              <Typography variant="h3">{book.title}</Typography>
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
            <Grid container spacing={1} marginBottom={3} padding={2}>
              <Grid item xs={12} marginBottom={2} padding={1}>
                <Typography variant="h4">
                  {book.averageRating == null ? 0 : book.averageRating}
                  <Rating
                    name="half-rating-read"
                    value={book.averageRating == null ? 0 : book.averageRating}
                    precision={0.25}
                    readOnly
                  />
                </Typography>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <img
                    src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
                    alt={book.title}
                    width="100%"
                    height="560px"
                    loading="lazy"
                  />
                </Grid>
                <Grid item xs={7}>
                  <Grid
                    sx={{ display: 'flex', flexDirection: 'column', padding: 2, marginBottom: 5 }}
                    container
                    spacing={2}>
                    <Grid item>
                      <Typography variant="subtitle1">ISBN</Typography>
                      <Typography variant="h6" width="100%">
                        {book.isbn}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Rok wydania</Typography>
                      <Typography variant="h6">{book.yearPublished}</Typography>
                    </Grid>
                    <AuthorsList authors={book.authors} />
                    <CategoriesList categories={book.bookCategories} />
                    <Grid item>
                      <Typography variant="subtitle1">Wydawca</Typography>
                      <Typography variant="h6">{book.publisher?.name}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Język</Typography>
                      <Typography variant="h6">{book.language}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Ilość stron</Typography>
                      <Typography variant="h6">{book.pageCount}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} hidden={book.description == null ? true : false}>
                  <Grid item>
                    <Typography variant="subtitle1">Opis</Typography>
                    <Typography variant="h6">{book.description}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <LibrariesStack bookId={params.bookId!} />
            <Box marginBottom={3} padding={2} width={'100%'}>
              {(statusReviews == 'loading' || statusCriticReviews === 'loading') && <LoadingTypography />}
              {statusReviews == 'success' && statusCriticReviews == 'success' && (
                <Box>
                  <Tabs value={currentTabIndex} onChange={handleTabChange} centered>
                    <Tab label="Opinie użytkowników" />
                    <Tab label="Opinie krytyków" />
                  </Tabs>
                  {currentTabIndex === 0 && (
                    <Box marginTop={3}>
                      <AuthorizedView roles={['User']}>
                        {reviews.data
                          .concat(criticReviews.data)
                          .filter((review) => review.user.id === user?.id).length === 0 && (
                          <AddReviewForm book={book}></AddReviewForm>
                        )}
                      </AuthorizedView>
                      <Reviews book={book} reviews={reviews.data} />
                      {reviews.data.length > 0 ? (
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginTop={3}>
                          <Pagination
                            onChange={handlePageChange}
                            page={paginationProps.pageNumber + 1}
                            count={Math.ceil(reviews.count / paginationProps.pageSize)}
                            sx={{ justifySelf: 'center' }}
                            size="large"
                            color="primary"
                          />
                        </Box>
                      ) : (
                        <Typography variant="h6" textAlign={'center'}>
                          Brak ocen użytkowników
                        </Typography>
                      )}
                    </Box>
                  )}
                  {currentTabIndex === 1 && (
                    <Box marginTop={3}>
                      <Reviews book={book} reviews={criticReviews.data} />
                      {criticReviews.data.length > 0 ? (
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginTop={3}>
                          <Pagination
                            onChange={handleCriticPageChange}
                            page={criticPaginationProps.pageNumber + 1}
                            count={Math.ceil(criticReviews.count / criticPaginationProps.pageSize)}
                            sx={{ justifySelf: 'center' }}
                            size="large"
                            color="primary"
                          />
                        </Box>
                      ) : (
                        <Typography variant="h6" textAlign={'center'}>
                          Brak ocen krytyków
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
}

export default BookDetails;
