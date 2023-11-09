import Box from '@mui/material/Box';
import { useForm, useWatch } from 'react-hook-form';
import AddAuthor, { AddAuthorType } from '../../models/AddAuthor';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextInputField from '../../components/TextInputField';
import { postAuthor } from '../../api/author';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import NumberInputField from '../../components/NumberInputField';
import { uploadImage } from '../../api/image';
import { fileToUploadImage } from '../../utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import useAlert from '../../utils/alerts/useAlert';

function AdminAuthorForm() {
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const { showSuccess } = useAlert();
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
  const postAuthorMutation = useMutation({
    mutationFn: postAuthor,
    onSuccess: (_, { firstName, lastName }) => {
      queryClient.invalidateQueries(['authors']);
      showSuccess({ message: `${firstName} ${lastName} został dodany!` });
      navigate('..');
    },
  });
  const onSubmit = useCallback(
    async (data: AddAuthorType) => {
      if (data.avatarPicture) {
        const uploadImageType = await fileToUploadImage(data.avatarPicture);
        const response = await uploadImageMutation.mutateAsync(uploadImageType);
        data.profilePictureUrl = response;
      }
      postAuthorMutation.mutate(data);
    },
    [postAuthorMutation, uploadImageMutation]
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
              {file !== null && <span>{file.name}</span>}
            </Box>
            {fileUrl !== null && (
              <Avatar src={fileUrl} alt="Zdjęcie autora" sx={{ width: 250, height: 250, marginBottom: 2 }} />
            )}
            {errors.avatarPicture != undefined && (
              <Typography color={'error'}>{errors.avatarPicture.message}</Typography>
            )}
            <TextInputField errors={errors} field="firstName" label="Imię" register={register} />
            <TextInputField errors={errors} field="lastName" label="Nazwisko/Nazwiska" register={register} />
            <NumberInputField errors={errors} field="birthYear" label="Rok urodzenia" register={register} />
            <TextInputField errors={errors} field="description" label="Opis/życiorys" register={register} />
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
