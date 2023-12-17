import { SxProps, Theme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextInputField from '../common/TextInputField';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RegisterUser, { RegisterUserType } from '../../models/RegisterUser';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Checkbox } from '@mui/material';

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
  const [displayAddressForm, setDisplayAddressForm] = useState(true);
  const handleDisplayAddressFormChange = (value: boolean) => {
    setDisplayAddressForm(value);
    if (value == false) {
      unregister('street');
      unregister('number');
      unregister('apartment');
      unregister('postalCode');
      unregister('city');
    }
  };
  const [fileContent, setFileContent] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    unregister,
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
          <Avatar src={fileContent ?? undefined} sx={{ width: 250, height: 250 }} />
          {errors.avatarPicture != undefined && (
            <Typography color={'error'}>{errors.avatarPicture.message}</Typography>
          )}
          <Button component="label" variant="contained" disabled={loading} startIcon={<CloudUploadIcon />}>
            Wstaw zdjęcie profilowe
            <VisuallyHiddenInput
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              {...register('avatarPicture')}
            />
          </Button>
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
        <Box alignItems={'center'} textAlign={'center'}>
          <Typography>Chcesz podać swój adres?</Typography>
          <Checkbox
            checked={displayAddressForm}
            onChange={() => handleDisplayAddressFormChange(!displayAddressForm)}
          />
        </Box>
        {displayAddressForm && (
          <>
            <TextInputField
              errors={errors}
              field="street"
              register={register}
              label="Ulica"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="number"
              register={register}
              label="Numer"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="apartment"
              register={register}
              label="Numer lokalu"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="city"
              register={register}
              label="Miasto"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="postalCode"
              register={register}
              label="Kod pocztowy"
              additionalProps={{ variant: 'filled' }}
            />
          </>
        )}
        <Button type="submit" fullWidth={true} variant="contained" color="secondary" disabled={loading}>
          Zarejestruj się
        </Button>
      </form>
    </Box>
  );
}

export default RegisterForm;
