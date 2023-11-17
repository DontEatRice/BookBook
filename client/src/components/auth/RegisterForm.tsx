import { SxProps, Theme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextInputField from '../TextInputField';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RegisterUser, { RegisterUserType } from '../../models/RegisterUser';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type RegisterFormProps = {
  onSubmit: (data: RegisterUserType) => void;
  loading?: boolean;
  sx?: SxProps<Theme>;
};

function RegisterForm({ onSubmit, sx, loading }: RegisterFormProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<RegisterUserType>({
    resolver: zodResolver(RegisterUser),
  });
  const avatarImage = useWatch({
    control,
    name: 'avatarPicture',
  });
  useEffect(() => {
    if (avatarImage instanceof FileList && avatarImage.length > 0) {
      const picture = avatarImage.item(0);
      if (picture !== null) {
        setFileContent(URL.createObjectURL(picture));
        return;
      }
    }
    setFileContent(null);
  }, [avatarImage]);
  return (
    <Box sx={sx}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" alignItems="center" spacing={2} mb={2} mt={2}>
          <Button component="label" variant="contained" disabled={loading} startIcon={<CloudUploadIcon />}>
            Wstaw zdjęcie profilowe
            <VisuallyHiddenInput
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              {...register('avatarPicture')}
            />
          </Button>
          <Avatar src={fileContent ?? undefined} sx={{ width: 250, height: 250 }} />
          {errors.avatarPicture != undefined && (
            <Typography color={'error'}>{errors.avatarPicture.message}</Typography>
          )}
        </Stack>
        <TextInputField
          errors={errors}
          field="name"
          register={register}
          label="Wyświetlana nazwa"
          additionalProps={{ variant: 'filled' }}
        />
        <TextInputField
          errors={errors}
          field="email"
          label="E-mail"
          register={register}
          additionalProps={{ variant: 'filled', type: 'email' }}
        />
        <TextInputField
          errors={errors}
          register={register}
          field="password"
          label="Hasło"
          additionalProps={{ variant: 'filled', type: 'password' }}
        />
        <TextInputField
          errors={errors}
          register={register}
          field="confirm"
          label="Powtórz hasło"
          additionalProps={{ variant: 'filled', type: 'password' }}
        />
        <Button type="submit" fullWidth={true} variant="contained" color="secondary" disabled={loading}>
          Zarejestruj się
        </Button>
      </form>
    </Box>
  );
}

export default RegisterForm;
