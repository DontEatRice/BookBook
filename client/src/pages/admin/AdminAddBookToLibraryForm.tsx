import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AddBookToLibrary, { AddBookToLibraryType } from '../../models/AddBookToLibrary';
import { addBookToLibrary, getBooksAvailableToAdd } from '../../api/library';
import NumberInputField from '../../components/NumberInputField';

function AdminAddBookToLibraryForm() {
  //na razie ręcznie wpisane (trzeba dodać swój do testów)
  const libraryId = 'A8CD269E-81AC-4C59-B009-1ADC78192109';
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddBookToLibraryType>({
    resolver: zodResolver(AddBookToLibrary),
  });
  const mutation = useMutation({
    mutationFn: addBookToLibrary,
    onSuccess: () => {
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  console.log(errors);
  const onSubmit: SubmitHandler<AddBookToLibraryType> = (data) => {
    console.log(data);
    mutation.mutate(data);
  };
  // !!!!!!!!!!!!!!!!!!!!!!!!
  // biblioteka powinna być brana z claimów Usera
  // !!!!!!!!!!!!!!!!!!!!!!!!
  const { data: availableBooks, status: availableBooksStatus } = useQuery({
    queryKey: ['booksToAdd', libraryId],
    queryFn: ({ queryKey }) => getBooksAvailableToAdd(queryKey[1]),
  });

  if (availableBooksStatus == 'loading') {
    return <h1>Ładowanie...</h1>;
  } else {
    return (
      <Box sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
          <input type="hidden" {...register('libraryId')} value={libraryId} />
          <Box
            sx={{
              width: { xs: '100%', sm: '85%', md: '65%' },
              textAlign: 'center',
            }}>
            <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
              <Controller
                control={control}
                name="bookId"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <Autocomplete
                    sx={{ width: '100%', mb: 2 }}
                    options={availableBooks || []}
                    onChange={(_, newValue) => {
                      onChange(newValue);
                    }}
                    getOptionLabel={(book) =>
                      book.title +
                      ' (' +
                      book.yearPublished +
                      ') ' +
                      book.authors.map((author) => author.lastName).join(', ') +
                      ' [' +
                      book.isbn +
                      ']'
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Dostępne książki"
                        placeholder="Szukaj książki"
                        helperText={error?.message}
                        error={error != undefined}
                      />
                    )}
                  />
                )}
              />
              <NumberInputField errors={errors} field="amount" register={register} label="Ilość" />
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

export default AdminAddBookToLibraryForm;
