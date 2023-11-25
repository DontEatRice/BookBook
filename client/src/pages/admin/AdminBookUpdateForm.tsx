import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteBook, updateBook } from '../../api/book';
import { getBook } from '../../api/book';
import { getCategories } from '../../api/category';
import { getAuthors } from '../../api/author';
import { getPublishers } from '../../api/publisher';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { ApiResponseError } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UpdateBook, { UpdateBookType } from '../../models/UpdateBook';
import { languages } from '../../utils/constants';
import { NumberInputField2 } from '../../components/common/NumberInputField';
import { TextInputBox2 } from '../../components/common/TextInputBox';
import { TextInputField2 } from '../../components/common/TextInputField';

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 100000,
};

const defaultPublisher = { id: '', name: 'Ładowanie...' };

function AdminBookUpdateForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();
  const theme = useTheme();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { handleError } = useAlert();

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateBookType>({
    resolver: zodResolver(UpdateBook),
    defaultValues: {
      authors: [],
      bookCategories: [],
      publisher: defaultPublisher,
      language: 'Polski',
      description: '',
    },
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const updateBookMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
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

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      navigate('..');
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'BOOK_NOT_FOUND') {
        setDeleteError('Ta książka już nie istnieje.');
      } else {
        handleError(err);
      }
    },
  });

  const { data, status } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: () => getBook(params.bookId + ''),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    reset({
      ...data,
      description: data.description ?? '',
    });
  }, [data, reset]);

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

  const onSubmit = (data: UpdateBookType) => {
    updateBookMutation.mutate({ book: data, id: params.bookId! });
  };

  if (categoriesStatus == 'loading' || authorsStatus == 'loading' || publishersStatus == 'loading') {
    return <h1>Ładowanie...</h1>;
  } else {
    return (
      <Box sx={{ mt: 2 }}>
        {deleteError && (
          <Paper
            elevation={7}
            sx={{
              width: '100%',
              padding: 2,
              backgroundColor: theme.palette.error.main,
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}>
            <ErrorOutlineIcon />
            <Typography>{deleteError}</Typography>
          </Paper>
        )}
        {status == 'loading' && 'Ładowanie...'}
        {status == 'error' && 'Błąd!'}
        {status == 'success' && (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: { xs: '100%', sm: '85%', md: '65%' },
                textAlign: 'center',
              }}>
              <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
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
                      options={authorsData?.data || []}
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
                      options={categoriesData?.data || []}
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
                      options={publishersData?.data || [defaultPublisher]}
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
                  <Button type="submit" variant="contained">
                    Zapisz
                  </Button>
                  <Button color="error" onClick={() => deleteBookMutation.mutate(params.bookId + '')}>
                    Usuń
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </form>
        )}
      </Box>
    );
  }
}

export default AdminBookUpdateForm;
