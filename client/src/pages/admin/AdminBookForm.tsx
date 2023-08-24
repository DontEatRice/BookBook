import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import TextInputField from '../../components/TextInputField';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AddBook, { AddBookType } from '../../models/AddBook';
import { postBook } from '../../api/book';
import NumberInputField from '../../components/NumberInputField';
import { getCategories } from '../../api/category';
import { getAuthors } from '../../api/author';

function AdminBookForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<AddBookType>({
        resolver: zodResolver(AddBook),
    });
    const mutation = useMutation({
        mutationFn: postBook,
        onSuccess: () => {
            navigate('..');
        },
        onError: (e: Error) => {
            console.error(e);
        },
    });
    const onSubmit: SubmitHandler<AddBookType> = (data) => {
        console.log(data);
        mutation.mutate(data);
    };

    const publishersData = [
        {
            id: "94390855-4375-4b55-b44a-a09b20d65f40",
            name: "Nowa Era"
        }
    ];

    const { data: categoriesData, status: categoriesStatus } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
    const { data: authorsData, status: authorsStatus } = useQuery({ queryKey: ['authors'], queryFn: getAuthors });
    if (categoriesStatus == 'loading' || authorsStatus == 'loading') {
        return (
            <h1>Ładowanie...</h1>
        )
    }
    else {
        return (
            <Box sx={{ mt: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            width: { xs: '100%', sm: '85%', md: '65%' },
                            textAlign: 'center',
                        }}>
                        <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
                            {/* <TextField
              id="outlined-error-helper-text"
              label="Nazwa kategorii"
              {...register('name')}
              error={errors.name != undefined}
              helperText={errors.name?.message}
              sx={{ width: '100%', mb: 2 }}
            /> */}
                            <TextInputField errors={errors} field="ISBN" register={register} label="ISBN" />
                            <TextInputField errors={errors} field="title" register={register} label="Tytuł" />
                            <NumberInputField errors={errors} field="yearPublished" register={register} label="Rok wydania" />
                            <TextInputField errors={errors} field="coverLink" register={register} label="Link do okładki" />
                            <Controller control={control} name='authorsIds' render={({ field: { onChange, }, fieldState: { error } }) => (
                                <>
                                    <Autocomplete
                                        multiple
                                        sx={{ width: '100%', mb: 2 }}
                                        options={authorsData || []}
                                        onChange={(_, newValue) => {
                                            onChange(newValue);
                                        }}
                                        getOptionLabel={(author) => author.firstName + " " + author.lastName}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Autorzy"
                                                placeholder='Szukaj autora'
                                                helperText={error?.message}
                                                error={error != undefined}
                                            />
                                        )}
                                    />
                                </>
                            )} />
                            <Controller control={control} name='categoriesIds' render={({ field: { onChange, }, fieldState: { error } }) => (
                                <>
                                    <Autocomplete
                                        multiple
                                        sx={{ width: '100%', mb: 2 }}
                                        options={categoriesData || []}
                                        onChange={(_, newValue) => {
                                            onChange(newValue);
                                        }}
                                        getOptionLabel={(category) => category.name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Kategorie"
                                                placeholder='Szukaj kategorii'
                                                helperText={error?.message}
                                                error={error != undefined}
                                            />
                                        )}
                                    />
                                </>
                            )} />
                            <Controller control={control} name='idPublisher' render={({ field: { onChange, }, fieldState: { error } }) => (
                                <>
                                    <Autocomplete
                                        sx={{ width: '100%', mb: 2 }}
                                        options={publishersData || []}
                                        onChange={(_, newValue) => {
                                            onChange(newValue);
                                        }}
                                        getOptionLabel={(publisher) => publisher.name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Wydawca"
                                                placeholder='Szukaj wydawcy'
                                                helperText={error?.message}
                                                error={error != undefined}
                                            />
                                        )}
                                    />
                                </>
                            )} />
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
