import { Controller, useForm, useWatch } from 'react-hook-form';
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
import { useCallback, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import { uploadImage } from '../../api/image';
import { fileToUploadImage } from '../../utils/utils';
import { Avatar } from '@mui/material';
import { languages } from '../../utils/constants';
import TextInputBox from '../../components/TextInputBox';

const paginationDefaultRequest = {
  pageNumber: 0,
  pageSize: 100000,
};

function AdminBookForm() {
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
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

  const watchCoverPicture = useWatch({
    control,
    name: 'coverPicture',
  });

  const file = useMemo(() => {
    if (watchCoverPicture instanceof FileList && watchCoverPicture.length > 0) {
      const picture = watchCoverPicture.item(0);
      if (picture !== null) {
        setFileUrl(URL.createObjectURL(picture));
        return picture;
      }
    }
    setFileUrl(undefined);
    return null;
  }, [watchCoverPicture]);

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onError: console.error,
  });

  const postBookMutation = useMutation({
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
  const onSubmit = useCallback(
    async (data: AddBookType) => {
      if (data.coverPicture) {
        const uploadImageType = await fileToUploadImage(data.coverPicture);
        const response = await uploadImageMutation.mutateAsync(uploadImageType);
        data.coverPictureUrl = response;
      }
      postBookMutation.mutate(data);
    },
    [postBookMutation, uploadImageMutation]
  );

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
              <Box
                component="label"
                htmlFor="upload-photo"
                sx={{ width: '100%', display: 'inline-flex', mb: 2 }}>
                <input
                  style={{ display: 'none' }}
                  id="upload-photo"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  {...register('coverPicture')}
                />
                <Button variant="contained" component="span">
                  Wstaw zdjęcie (opcjonalnie)
                </Button>
                {file !== null && <span>{file.name}</span>}
              </Box>
              {fileUrl !== null && (
                <Avatar
                  src={fileUrl}
                  alt="Zdjęcie autora"
                  sx={{ width: 250, height: 250, marginBottom: 2 }}
                />
              )}
              {errors.coverPicture != undefined && (
                <Typography color={'error'}>{errors.coverPicture.message}</Typography>
              )}
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
              <TextInputBox errors={errors} field="description" register={register} label="Opis" rows={4} />
              <Controller
                control={control}
                name="language"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <Autocomplete
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
              <NumberInputField errors={errors} field="pageCount" register={register} label="Ilość stron" />
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
