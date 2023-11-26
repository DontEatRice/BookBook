import { Grid, Box } from '@mui/material';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook, getLibrariesWithBook } from '../../api/book';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import Reviews from '../reviews/Reviews';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import FilledField from '../../components/common/FilledField';
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
  const authorNames = authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');

  return <FilledField label={authors.length > 1 ? 'Autorzy' : 'Autor'} value={authorNames} />;
}

function CategoriesList({ categories }: { categories: BookCategoryViewModelType[] }) {
  const categoriesNames = categories.map((category) => category.name).join(', ');

  return <FilledField label={categories.length > 1 ? 'Kategorie' : 'Kategoria'} value={categoriesNames} />;
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
            <Grid container spacing={1} marginBottom={3} padding={2}>
              <Grid item md={5} xs={12}>
                <img
                  srcSet={`${book.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`}
                  src={`${book.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`}
                  alt={book.title}
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
            {bookLibrariesStatus == 'success' && (
              <Grid container spacing={2} marginBottom={3}>
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
            <Box display={'flex'} flexDirection={'column'}>
              <AddReviewForm book={book}></AddReviewForm>
              {statusReviews == 'loading' && 'Ładowanie opinii...'}
              {statusReviews == 'error' && 'Błąd!'}
              {statusReviews == 'success' && <Reviews book={book} reviews={reviews.data} />}
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
}

export default BookDetails;
