import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useForm, useWatch } from 'react-hook-form';
import UpdateAuthor, { UpdateAuthorType } from '../../models/author/UpdateAuthor';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { updateAuthor } from '../../api/author';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthor } from '../../api/author';
import { useCallback, useMemo, useState } from 'react';
import { uploadImage } from '../../api/image';
import { fileToBase64, imgUrl } from '../../utils/utils';
import UploadImage from '../../models/UploadImage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { NumberInputField2 } from '../../components/common/NumberInputField';
import { TextInputField2 } from '../../components/common/TextInputField';
import { TextInputBox2 } from '../../components/common/TextInputBox';
import useAlert from '../../utils/alerts/useAlert';
import Avatar from '@mui/material/Avatar';

async function fileToUploadImage(file: File) {
  let base64 = await fileToBase64(file);
  base64 = base64.slice(base64.indexOf(',') + 1);
  return UploadImage.parse({
    content: base64,
    contentType: file.type,
    fileName: file.name,
  });
}

function AuthorUpdateForm({
  data,
  onSubmit,
}: {
  data: UpdateAuthorType;
  onSubmit: (updated: UpdateAuthorType) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateAuthorType>({
    resolver: zodResolver(UpdateAuthor),
    defaultValues: {
      ...data,
    },
  });
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
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

  return (
    <form style={{ display: 'flex', justifyContent: 'center' }} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ width: { xs: '100%', sm: '85%', md: '65%' }, textAlign: 'center' }}>
        <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
          <Box component="label" htmlFor="upload-photo" sx={{ width: '100%', display: 'inline-flex', mb: 2 }}>
            <input
              style={{ display: 'none' }}
              id="upload-photo"
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              {...register('avatarPicture')}
            />
            <Button variant="contained" component="span">
              Zmień zdjęcie
            </Button>
            {file && <span>{file.name}</span>}
          </Box>
          <Avatar
            src={fileUrl ?? imgUrl(data.profilePictureUrl)}
            alt="Zdjęcie autora"
            sx={{ width: 250, height: 250, marginBottom: 2, ml: 'auto', mr: 'auto' }}
          />
          {errors.avatarPicture != undefined && <span>{errors.avatarPicture.message}</span>}
          <TextInputField2 field="firstName" label="Imię" control={control} />
          <TextInputField2 control={control} field="lastName" label="Nazwisko/Nazwiska" />
          <NumberInputField2 field="birthYear" label="Rok urodzenia" control={control} />
          <TextInputBox2 field="description" label="Opis/życiorys" control={control} rows={4} />
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

function AdminAuthorUpdateForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();
  const { showSuccess } = useAlert();

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
  });

  const updateAuthorMutation = useMutation({
    mutationFn: updateAuthor,
    onSuccess: (_, { author: { firstName, lastName } }) => {
      queryClient.invalidateQueries(['authors']);
      showSuccess({ title: 'Sukces', message: `${firstName} ${lastName} został zaktualizowany!` });
      navigate('..');
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
        data.profilePictureUrl = response;
      }
      updateAuthorMutation.mutate({ author: data, id: params.authorId! });
    },
    [params.authorId, updateAuthorMutation, uploadImageMutation]
  );

  return (
    <Box sx={{ mt: 2 }}>
      {status == 'loading' && 'Ładowanie...'}
      {status == 'error' && 'Błąd!'}
      {status == 'success' && <AuthorUpdateForm data={data} onSubmit={onSubmit} />}
    </Box>
  );
}

export default AdminAuthorUpdateForm;
