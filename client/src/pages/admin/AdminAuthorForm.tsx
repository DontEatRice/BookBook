import Box from '@mui/material/Box';
import { useForm, useWatch } from 'react-hook-form';
import AddAuthor, { AddAuthorType } from '../../models/AddAuthor';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextInputField from '../../components/TextInputField';
import { useMutation } from 'react-query';
import { postAuthor } from '../../api/author';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

function AdminAuthorForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddAuthorType>({
    resolver: zodResolver(AddAuthor),
  });
  const watchAvatarPicture = useWatch({
    control,
    name: 'avatarPicture',
  });
  const fileName = useMemo(() => {
    if (watchAvatarPicture instanceof FileList) {
      return watchAvatarPicture.item(0)?.name;
    }
    return undefined;
  }, [watchAvatarPicture]);
  const mutation = useMutation({
    mutationFn: postAuthor,
    onSuccess: () => {
      // response.headers.has() TODO dodać redirect na nowy obiekt
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit = useCallback(
    (data: AddAuthorType) => {
      mutation.mutate(data);
    },
    [mutation]
  );
  return (
    <Box sx={{ mt: 2 }}>
      <form style={{ display: 'flex', justifyContent: 'center' }} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ width: { xs: '100%', sm: '85%', md: '65%' }, textAlign: 'center' }}>
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
                {...register('avatarPicture')}
              />

              <Button variant="contained" component="span">
                Wstaw zdjęcie (opcjonalnie)
              </Button>
              {fileName && <span>{fileName}</span>}
            </Box>
            {errors.avatarPicture != undefined && <span>{errors.avatarPicture.message}</span>}
            <TextInputField errors={errors} field="firstName" label="Imię" register={register} />
            <TextInputField errors={errors} field="lastName" label="Nazwisko/Nazwiska" register={register} />
            <Button type="submit" variant="contained">
              Zapisz
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default AdminAuthorForm;
