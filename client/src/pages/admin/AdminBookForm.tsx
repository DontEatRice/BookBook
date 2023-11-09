import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TextInputField from '../../components/TextInputField';
import AddBook, { AddBookType } from '../../models/AddBook';
import { postBook } from '../../api/book';
import NumberInputField from '../../components/NumberInputField';
import { getCategories } from '../../api/category';
import { getAuthors } from '../../api/author';
import { getPublishers } from '../../api/publisher';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ApiResponseError } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 100000,
};

function AdminBookForm() {
  const navigate = useNavigate();
  const { handleError } = useAlert();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AddBookType>({
    resolver: zodResolver(AddBook),
  });
  const mutation = useMutation({
    mutationFn: postBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      navigate('..');
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'BOOK_ALREADY_ADDED') {
        setError('ISBN', { message: 'Podany ISBN jest już zajęty' }, { shouldFocus: true });
      } else {
        handleError(err);
      }
    },
  });
  const onSubmit: SubmitHandler<AddBookType> = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

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
  if (categoriesStatus == 'loading' || authorsStatus == 'loading' || publishersStatus == 'loading') {
    return <h1>Ładowanie...</h1>;
  } else {
    return (
      <Box sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: { xs: '100%', sm: '85%', md: '65%' },
              textAlign: 'center',
            }}>
            <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
              <TextInputField errors={errors} field="ISBN" register={register} label="ISBN" />
              <TextInputField errors={errors} field="title" register={register} label="Tytuł" />
              <NumberInputField
                errors={errors}
                field="yearPublished"
                register={register}
                label="Rok wydania"
              />
              <Controller
                control={control}
                name="authorsIds"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    sx={{ width: '100%', mb: 2 }}
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
                name="categoriesIds"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    sx={{ width: '100%', mb: 2 }}
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
                name="idPublisher"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <Autocomplete
                    sx={{ width: '100%', mb: 2 }}
                    options={publishersData?.data || []}
                    onChange={(_, newValue) => {
                      onChange(newValue);
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
              <Button type="submit" variant="contained">
                Zapisz
              </Button>
            </Paper>
          </Box>
        </form>
      </Box>
    );
  }
}

export default AdminBookForm;
