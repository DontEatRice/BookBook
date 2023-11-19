import { Grid, Box } from '@mui/material';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook, getLibrariesWithBook } from '../../api/book';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import Reviews from '../../pages/review/Reviews';
import ToggleBookInUserList, { ToggleBookInUserListType } from '../../models/ToggleBookInUserList';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toggleBookInUserList } from '../../api/user';
import AuthorizedView from '../../components/auth/AuthorizedView';
import FilledField from '../../components/FilledField';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddBookToCart from '../../components/reservations/BookLibraryDropdown';
import AddReviewForm from '../review/AddReviewForm';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingTypography from '../../components/common/LoadingTypography';

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

  return (
    <div>
      <Box mt={4}>
        {status == 'loading' && <LoadingTypography />}
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
            <Grid container spacing={1} marginBottom={3} padding={2}>
              <Grid item md={5} xs={12}>
                <img
                  srcSet={`${data.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`}
                  src={`${data.coverPictureUrl ?? '/podstawowa-ksiazka-otwarta.jpg'}`}
                  alt={data.title}
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
                    <AuthorsList authors={data.authors} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <CategoriesList categories={data.bookCategories} />
                  </div>
                </Box>
              </Grid>
            </Grid>
            <Box>
              <AddBookToCart bookId={params.bookId as string} />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <AddReviewForm book={data} />
              <Reviews book={data} />
            </Box>
          </div>
        )}
      </Box>
      {bookLibrariesStatus == 'success' && (
        <MapContainer
          id="map"
          style={{ height: 400 }}
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
                <a href={`/libraries/${library?.id}`}>{library.name}</a> <br />{' '}
                {library.address.street + ' ' + library.address.number}
                {library.address.apartment == null ? '' : '/'}
                {library.address.apartment ?? ''}
                <br /> {library.address.city}
                <Button onClick={() => console.log('aaaa')}>klik</Button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default BookDetails;
