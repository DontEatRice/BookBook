import Box from '@mui/material/Box';
import LoginForm from '../../components/auth/LoginForm';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/auth';
import { useAuth } from '../../utils/auth/useAuth';
import useAlert from '../../utils/alerts/useAlert';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme } from '@mui/material/styles';
import { ApiResponseError } from '../../utils/utils';

function Login() {
  const { login: setAccessToken } = useAuth();
  const theme = useTheme();
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleError } = useAlert();
  const [params] = useSearchParams();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      if (params.has('returnTo')) {
        navigate(params.get('returnTo') ?? '/');
      } else {
        navigate('/');
      }
    },
    onError: async (error) => {
      if (error instanceof ApiResponseError && error.error.code === 'INVALID_CREDENTIALS') {
        setLoginError('Nieprawidłowy login lub hasło!');
      } else {
        handleError(error);
      }
    },
  });
  return (
    <Box width="100%">
      <Stack direction="row" justifyContent="center">
        <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
          {loginError && (
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
              <Typography>{loginError}</Typography>
            </Paper>
          )}
          <LoginForm
            onSubmit={(data) => loginMutation.mutate(data)}
            sx={{ mt: 2, mb: 2 }}
            loading={loginMutation.isLoading}
          />
          <Link to={'/register'}>
            <Button fullWidth={true}>Rejestracja</Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}

export default Login;
