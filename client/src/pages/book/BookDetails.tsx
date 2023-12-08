import { Grid, Box, Rating } from '@mui/material';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { getBook, getLibrariesWithBook } from '../../api/book';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import Reviews from '../reviews/Reviews';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { getReviews } from '../../api/review';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddReviewForm from '../reviews/AddReviewForm';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingTypography from '../../components/common/LoadingTypography';
import LibrariesStack from '../../components/book/LibrariesStack';
import { addToCart } from '../../api/cart';
import useAlert from '../../utils/alerts/useAlert';
import { useCartStore } from '../../store';
import { Link } from 'react-router-dom';

function AuthorsList({ authors }: { authors: AuthorViewModelType[] }) {
  return (
    <Grid item xs>
      <Typography variant="subtitle1">{authors.length > 1 ? 'Autorzy' : 'Autor'}</Typography>
      <Typography variant="h6">
      {authors
        .map((author, i, arr) => {
          const value = author.firstName + " " + author.lastName + (arr.length - 1 === i ? "" : ", ")

          return <Link to={`/authors/${author.id}`} key={author.id} style={{ textDecoration: 'none' }}>{value}</Link>
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
      <Typography variant="h6">
        {categoriesNames}
      </Typography>
    </Grid>
  );
}

function BookDetails() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();
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

  const { data: reviews, status: statusReviews } = useQuery({
    queryKey: ['reviews', params.bookId],
    queryFn: () => getReviews(params.bookId + '', { pageNumber: 0, pageSize: 50 }),
  });

  const { data: bookLibraries, status: bookLibrariesStatus } = useQuery(
    ['booksInLibrary', params.bookId],
    async (context) => {
      if (context.queryKey[1] != '') {
        const bookId = context.queryKey[1] as string;
        return await getLibrariesWithBook(bookId);
      }
      return [];
    }
  );

  const cartStore = useCartStore();
  const handleAddToCart = async (bookId: string, libraryId: string) => {
    try {
      await addToCart({ bookId, libraryId });
      showSuccess({ message: 'Dodano do koszyka!' });
      cartStore.toggleIsChanged();
    } catch (error) {
      const err = error as Error;
      switch (err.message) {
        case 'BOOK_ALREADY_IN_CART':
          showError({ message: 'Książka została już dodana do koszyka' });
          break;
        case 'BOOK_NOT_FOUND':
          showError({ message: 'Książka nie została znaleziona' });
          break;
        case 'LIBRARY_NOT_FOUND':
          showError({ message: 'Biblioteka nie została znaleziona' });
          break;
        default:
          showError({ message: `Wystąpił nieznany błąd: ${err.message}` });
          break;
      }
    }
  };

  return (
    <div>
      <Box mt={4}>
        {statusBook == 'loading' && <LoadingTypography />}
        {statusBook == 'error' && 'Błąd!'}
        {statusBook == 'success' && (
          <Grid container spacing={1} padding={2}>
            <Grid container direction="row" justifyContent="space-between" marginTop={5} marginBottom={2}>
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
            </Grid>
            <Grid item xs={12} direction='row' marginBottom={2} padding={1}>
              <Typography variant="h4">{book.averageRating + " "}
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
                  srcSet={`${book.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`}
                  src={`${book.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`}
                  alt={book.title}
                  width='100%'
                  height="560px"
                  loading="lazy"
                />
              </Grid>
              <Grid item xs={7}>
                  <Grid sx={{ display: 'flex', flexDirection: 'column', padding: 2, marginBottom: 5 }} container spacing={2}>
                    <Grid item>
                      <Typography variant="subtitle1">ISBN</Typography>
                      <Typography variant="h6" width="100%">
                        {book.isbn}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Rok wydania</Typography>
                      <Typography variant="h6">
                        {book.yearPublished}
                      </Typography>
                    </Grid>
                    <AuthorsList authors = {book.authors} />
                    <CategoriesList categories = {book.bookCategories} />
                    <Grid item>
                      <Typography variant="subtitle1">Wydawca</Typography>
                      <Typography variant="h6">
                        {book.publisher?.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Język</Typography>
                      <Typography variant="h6">
                        {book.language}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Ilość stron</Typography>
                      <Typography variant="h6">
                        {book.pageCount}
                      </Typography>
                    </Grid>
                  </Grid>
              </Grid>
              <Grid item xs={12} hidden={book.description == null ? true : false}>
                  <Grid item>
                    <Typography variant="subtitle1">Opis</Typography>
                    <Typography variant="h6">
                      {book.description}
                    </Typography>
                  </Grid>
              </Grid>
            </Grid>
            {bookLibrariesStatus == 'success' && (
              <Grid container spacing={1} marginBottom={3} padding={2}>
                <Grid item xs={5}>
                  <LibrariesStack libraries={bookLibraries} bookId={params.bookId!} />
                </Grid>
                <Grid item xs={7}>
                  <MapContainer
                    id="map"
                    style={{ height: 500, zIndex: 0 }}
                    bounds={[
                      [54, 23],
                      [49, 14],
                    ]}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {bookLibraries.map((library) => (
                      <Marker position={[library.latitude, library.longitude]} key={library.id}>
                        <Popup>
                          <Link to={`/libraries/${library.id}`}>{library.name}</Link>
                          <br />
                          {library.address.street + ' ' + library.address.number}
                          {library.address.apartment == null ? '' : '/'}
                          {library.address.apartment ?? ''}
                          <br /> {library.address.city}
                          <br />
                          <AuthorizedView>
                            <Button onClick={() => handleAddToCart(params.bookId!, library.id)}>
                              Do koszyka
                            </Button>
                          </AuthorizedView>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Grid>
              </Grid>
            )}
            {/* <Box>
              <AddBookToCart bookId={params.bookId as string} />
            </Box> */}
            <Box marginBottom={3} padding={2}>
                {statusReviews == 'loading' && 'Ładowanie opinii...'}
                {statusReviews == 'error' && 'Błąd!'}
                {statusReviews == 'success' && <Reviews book={book} reviews={reviews.data} />}
            </Box>
          </Grid>
        )}
      </Box>
    </div>
  );
}

export default BookDetails;
