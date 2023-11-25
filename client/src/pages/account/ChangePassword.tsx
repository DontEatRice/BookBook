import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth/useAuth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ChangePasswordRequest, { ChangePasswordRequestType } from '../../models/ChangePasswordRequest';
import Box from '@mui/material/Box';
import TextInputField from '../../components/common/TextInputField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../../api/account';
import { ApiResponseError } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';

function ChangePassword() {
  const { user, logout } = useAuth();
  const { handleError } = useAlert();
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ChangePasswordRequestType>({ resolver: zodResolver(ChangePasswordRequest) });
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      logout();
      navigate('/');
    },
    onError: (error) => {
      // TODO jakiś format wprowadzić
      if (error instanceof ApiResponseError && error.error.code === 'INVALID_CREDENTIALS') {
        setValue('oldPassword', '');
        setError('oldPassword', { message: 'Błędne hasło' }, { shouldFocus: true });
      } else {
        handleError(error);
      }
    },
  });

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} mt={2}>
      <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
        <form onSubmit={handleSubmit((data) => changePasswordMutation.mutate(data))}>
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
          <Button
            fullWidth={true}
            variant="contained"
            color="secondary"
            type="submit"
            disabled={changePasswordMutation.isLoading}>
            Zmień hasło
          </Button>
        </form>
        <Paper
          elevation={7}
          sx={{
            width: '100%',
            padding: 2,
            backgroundColor: theme.palette.warning.main,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}>
          <WarningAmberIcon />
          <Typography>Po zmianie hasła zostaniesz wylogowany.</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default ChangePassword;
