import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useForm, useWatch } from 'react-hook-form';
import UpdateAuthor, { UpdateAuthorType } from '../../models/UpdateAuthor';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextInputField from '../../components/TextInputField';
import { updateAuthor, deleteAuthor } from '../../api/author';
import { useNavigate } from 'react-router-dom';
import { getAuthor } from '../../api/author';
import { useCallback, useMemo } from 'react';
import NumberInputField from '../../components/NumberInputField';
import { uploadImage } from '../../api/image';
import { fileToBase64 } from '../../utils/utils';
import UploadImage from '../../models/UploadImage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

async function fileToUploadImage(file: File) {
  let base64 = await fileToBase64(file);
  base64 = base64.slice(base64.indexOf(',') + 1);
  return UploadImage.parse({
    content: base64,
    contentType: file.type,
    fileName: file.name,
  });
}

function AdminAuthorForm() {
  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateAuthorType>({
    resolver: zodResolver(UpdateAuthor),
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

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onError: console.error,
  });

  const updateAuthorMutation = useMutation({
    mutationFn: updateAuthor,
    onSuccess: () => {
      // response.headers.has() TODO dodać redirect na nowy obiekt
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });

  const { data, status } = useQuery({
    queryKey: ['authors', params.authorId],
    queryFn: () => getAuthor(params.authorId + ''),
  });

  const onSubmit = useCallback(
    async (data: UpdateAuthorType) => {
      if (data.avatarPicture) {
        const uploadImageType = await fileToUploadImage(data.avatarPicture);
        const response = await uploadImageMutation.mutateAsync(uploadImageType);
        for (const pair of response.headers.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        if (response.ok) {
          data.profilePictureUrl = response.headers.get('location');
        }
      }
      updateAuthorMutation.mutate({ author: data, id: params.authorId! });
    },
    [params.authorId, updateAuthorMutation, uploadImageMutation]
  );

  return (
    <Box sx={{ mt: 2 }}>
      {status == 'loading' && 'Ładowanie...'}
      {status == 'error' && 'Błąd!'}
      {status == 'success' && (
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
              <TextInputField
                errors={errors}
                field="firstName"
                label="Imię"
                register={register}
                defaultValue={data.firstName}
              />
              <TextInputField
                errors={errors}
                field="lastName"
                label="Nazwisko/Nazwiska"
                register={register}
                defaultValue={data.lastName}
              />
              <NumberInputField
                errors={errors}
                field="birthYear"
                label="Rok urodzenia"
                register={register}
                defaultValue={data.birthYear + ''}
              />
              <Stack direction="row" spacing={2} justifyContent={'center'}>
                <Button type="submit" variant="contained">
                  Zapisz
                </Button>
                <Button color="error" onClick={() => deleteAuthorMutation.mutate(params.authorId+"")}>
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

export default AdminAuthorForm;