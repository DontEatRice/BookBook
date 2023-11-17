import Box from '@mui/material/Box';
import RegisterForm from '../../components/auth/RegisterForm';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../api/auth';
import { useCallback, useEffect, useState } from 'react';
import { RegisterUserType } from '../../models/RegisterUser';
import { uploadImage } from '../../api/image';
import { ApiResponseError, fileToUploadImage } from '../../utils/utils';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme } from '@mui/material/styles';
import useAlert from '../../utils/alerts/useAlert';

function Register() {
  const theme = useTheme();
  const { handleError } = useAlert();
  const navigation = useNavigate();
  const [apiError, setApiError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: register,
    onSuccess: () => navigation('/login'),
    onError: (error) => {
      if (error instanceof ApiResponseError && error.error.code == 'IDENTITY_EXISTS') {
        setApiError('Już istnieje konto z podanym adresem e-mail');
      } else {
        handleError(error);
      }
    },
  });
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  const onSubmit = useCallback(
    async (data: RegisterUserType) => {
      if (data.avatarPicture) {
        setLoading(true);
        const response = await uploadImage(await fileToUploadImage(data.avatarPicture));
        setLoading(false);
        data.avatarImageUrl = response ?? undefined;
      }
      mutate(data);
    },
    [mutate]
  );
  return (
    <Box width={'100%'}>
      <Stack direction="row" justifyContent="center">
        <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
          {apiError && (
            <Paper
              elevation={7}
              sx={{
                width: '100%',
                padding: 2,
                backgroundColor: theme.palette.error.main,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
              }}>
              <ErrorOutlineIcon />
              <Typography>{apiError}</Typography>
            </Paper>
          )}
          <RegisterForm onSubmit={onSubmit} loading={loading} />
          <Link to={'../login'}>
            <Button fullWidth={true}>Logowanie</Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}

export default Register;
