import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import LoginRequest, { LoginRequestType } from '../../models/LoginRequest';
import { useForm } from 'react-hook-form';
import TextInputField from '../TextInputField';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';

type LoginFormProps = {
  onSubmit: (data: LoginRequestType) => void;
  sx?: SxProps<Theme>;
  loading?: boolean;
};

function LoginForm({ onSubmit, sx, loading = false }: LoginFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequestType>({
    resolver: zodResolver(LoginRequest),
  });

  return (
    <Box sx={sx}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          errors={errors}
          field="email"
          label="E-mail"
          register={register}
          additionalProps={{ variant: 'filled', type: 'email' }}
        />
        <TextInputField
          errors={errors}
          field="password"
          label="Hasło"
          register={register}
          additionalProps={{ variant: 'filled', type: 'password' }}
        />
        <Button type="submit" fullWidth={true} variant="contained" color="secondary" disabled={loading}>
          Zaloguj się
        </Button>
      </form>
    </Box>
  );
}

export default LoginForm;
