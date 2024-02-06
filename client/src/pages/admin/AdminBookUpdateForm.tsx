import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { updateBook } from '../../api/book';
import { getBook } from '../../api/book';
import { getCategories } from '../../api/category';
import { getAuthors } from '../../api/author';
import { getPublishers } from '../../api/publisher';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { ApiResponseError, fileToUploadImage, imgUrl } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';
import UpdateBook, { UpdateBookType } from '../../models/UpdateBook';
import { languages } from '../../utils/constants';
import { NumberInputField2 } from '../../components/common/NumberInputField';
import { TextInputBox2 } from '../../components/common/TextInputBox';
import { TextInputField2 } from '../../components/common/TextInputField';
import { BookViewModelType } from '../../models/BookViewModel';
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import { PublisherViewModelType } from '../../models/PublisherViewModel';
import LoadingTypography from '../../components/common/LoadingTypography';
import Typography from '@mui/material/Typography';
import { uploadImage } from '../../api/image';
import { BookCoverImg } from '../../components/common/Img';

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 100000,
};

function UpdateBookForm({
  bookData,
  authors,
  bookCategories,
  publishers,
}: {
  bookData: BookViewModelType;
  authors: AuthorViewModelType[];
  bookCategories: BookCategoryViewModelType[];
  publishers: PublisherViewModelType[];
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleError } = useAlert();
  const { showSuccess } = useAlert();

  const {
    handleSubmit,
    control,
    setError,
    register,
    formState: { errors },
  } = useForm<UpdateBookType>({
    resolver: zodResolver(UpdateBook),
    defaultValues: {
      ...bookData,
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: (_, { book: { title } }) => {
      showSuccess({ message: `Książka o tytule '${title}' została zaktualizowana`, title: 'Sukces' });
      queryClient.invalidateQueries(['books']);
      navigate('..');
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'BOOK_ALREADY_ADDED') {
        setError('isbn', { message: 'Podany ISBN jest już zajęty' }, { shouldFocus: true });
      } else {
        handleError(err);
      }
    },
  });
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const watchAvatarPicture = useWatch({
    control,
    name: 'coverPicture',
  });

  const file = useMemo(() => {
    if (watchAvatarPicture instanceof FileList && watchAvatarPicture.length > 0) {
      const picture = watchAvatarPicture.item(0);
      if (picture !== null) {
        setFileUrl(URL.createObjectURL(picture));
        return picture;
      }
    }
    setFileUrl(undefined);
    return null;
  }, [watchAvatarPicture]);

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
  });

  const onSubmit = async (updatedBook: UpdateBookType) => {
    if (updatedBook.coverPicture) {
      const uploadImageType = await fileToUploadImage(updatedBook.coverPicture);
      const response = await uploadImageMutation.mutateAsync(uploadImageType);
      updatedBook.coverPictureUrl = response;
    }
    updateBookMutation.mutate({ id: bookData.id, book: updatedBook });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          width: { xs: '100%', sm: '85%', md: '65%' },
          textAlign: 'center',
        }}>
        <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
          <Box component="label" htmlFor="upload-photo" sx={{ width: '100%', display: 'inline-flex', mb: 2 }}>
            <input
              style={{ display: 'none' }}
              id="upload-photo"
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              {...register('coverPicture')}
            />
            <Button variant="contained" component="span">
              Zmień zdjęcie
            </Button>
            {file && <span>{file.name}</span>}
          </Box>
          <Box height="400px" width="275px" mb={2} mt={2} ml={'auto'} mr={'auto'}>
            <BookCoverImg
              src={fileUrl ?? imgUrl(bookData.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
              alt={'Okładka książki'}
            />
          </Box>
          {errors.coverPicture != undefined && <span>{errors.coverPicture.message}</span>}
          <TextInputField2 field="isbn" control={control} label="ISBN" />
          <TextInputField2 control={control} field="title" label="Tytuł" />
          <NumberInputField2 field="yearPublished" control={control} label="Rok wydania" />
          <Controller
            control={control}
            name="authors"
            render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
              <Autocomplete
                {...rest}
                multiple
                sx={{ width: '100%', mb: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={authors}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                getOptionLabel={(author) => author.firstName + ' ' + author.lastName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Autorzy"
                    placeholder="Szukaj autora"
                    helperText={error?.message}
                    error={error != undefined}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="bookCategories"
            render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
              <Autocomplete
                {...rest}
                multiple
                sx={{ width: '100%', mb: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={bookCategories}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                getOptionLabel={(category) => category.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kategorie"
                    placeholder="Szukaj kategorii"
                    helperText={error?.message}
                    error={error != undefined}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="publisher"
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                sx={{ width: '100%', mb: 2 }}
                options={publishers}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                }}
                getOptionLabel={(publisher) => publisher.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Wydawca"
                    placeholder="Szukaj wydawcy"
                    helperText={error?.message}
                    error={error != undefined}
                  />
                )}
              />
            )}
          />
          <TextInputBox2 field="description" control={control} label="Opis" rows={4} />
          <Controller
            control={control}
            name="language"
            render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
              <Autocomplete
                {...rest}
                sx={{ width: '100%', mb: 2 }}
                options={languages}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                getOptionLabel={(language) => language}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Język"
                    placeholder="Szukaj języków"
                    helperText={error?.message}
                    error={error != undefined}
                  />
                )}
              />
            )}
          />
          <NumberInputField2 field="pageCount" control={control} label="Ilość stron" />
          <Stack direction="row" spacing={2} justifyContent={'center'}>
            <Button component={Link} to={'..'}>
              Anuluj
            </Button>
            <Button type="submit" variant="contained">
              Zapisz
            </Button>
          </Stack>
        </Paper>
      </Box>
    </form>
  );
}

function AdminBookUpdateForm() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { data, status } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: () => getBook(params.bookId + ''),
  });

  const { data: categoriesData, status: categoriesStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(paginationDefaultRequest),
  });
  const { data: authorsData, status: authorsStatus } = useQuery({
    queryKey: ['authors'],
    queryFn: () => getAuthors(paginationDefaultRequest),
  });
  const { data: publishersData, status: publishersStatus } = useQuery({
    queryKey: ['publishers'],
    queryFn: () => getPublishers(paginationDefaultRequest),
  });

  useEffect(() => {
    setIsLoading(
      categoriesStatus == 'loading' ||
        authorsStatus == 'loading' ||
        publishersStatus == 'loading' ||
        status == 'loading'
    );
  }, [authorsStatus, categoriesStatus, publishersStatus, status]);

  useEffect(() => {
    setIsError(
      categoriesStatus == 'error' ||
        authorsStatus == 'error' ||
        publishersStatus == 'error' ||
        status == 'error'
    );
  }, [authorsStatus, categoriesStatus, publishersStatus, status]);

  if (isLoading) {
    return <LoadingTypography />;
  } else if (isError) {
    return (
      <Typography variant="h4" color={'error'}>
        Wystąpił błąd przy pobieraniu danych
      </Typography>
    );
  } else {
    return (
      <Box sx={{ mt: 2 }}>
        {status == 'success' &&
          categoriesStatus == 'success' &&
          authorsStatus == 'success' &&
          publishersStatus == 'success' && (
            <UpdateBookForm
              authors={authorsData.data}
              bookCategories={categoriesData.data}
              publishers={publishersData.data}
              bookData={data}
            />
          )}
      </Box>
    );
  }
}

export default AdminBookUpdateForm;
