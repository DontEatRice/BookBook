import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth/useAuth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ChangePasswordRequest, { ChangePasswordRequestType } from '../../models/ChangePasswordRequest';
import Box from '@mui/material/Box';
import TextInputField from '../../components/TextInputField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../../api/account';

function ChangePassword() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      logout();
      navigate('/');
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordRequestType>({ resolver: zodResolver(ChangePasswordRequest) });

  return (
    <Box>
      <form onSubmit={handleSubmit((data) => console.log({ data }))}>
        <TextInputField
          register={register}
          errors={errors}
          field="oldPassword"
          label="Aktualne hasło"
          additionalProps={{
            type: 'password',
            variant: 'filled',
          }}
        />
        <TextInputField
          register={register}
          errors={errors}
          field="newPassword"
          label="Nowe hasło"
          additionalProps={{
            type: 'password',
            variant: 'filled',
          }}
        />
        <TextInputField
          register={register}
          errors={errors}
          field="confirm"
          label="Powtórz nowe hasło"
          additionalProps={{
            type: 'password',
            variant: 'filled',
          }}
        />
        <Button>Zmień hasło</Button>
      </form>
      <Paper elevation={7} sx={{ padding: 2, backgroundColor: theme.palette.warning.main }}>
        <Typography>
          <WarningAmberIcon /> Po zmianie hasła zostaniesz wylogowany.
        </Typography>
      </Paper>
    </Box>
  );
}

export default ChangePassword;
