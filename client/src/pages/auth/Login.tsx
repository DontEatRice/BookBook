import Box from '@mui/material/Box';
import LoginForm from '../../components/auth/LoginForm';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/auth';
import { useAuth } from '../../utils/auth/useAuth';
import useAlert from '../../utils/alerts/useAlert';

function Login() {
  const { login: setAccessToken } = useAuth();
  const navigate = useNavigate();
  const { showWarning } = useAlert();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      navigate('/');
    },
    onError: async (error) => {
      if (error instanceof Response) {
        const body = await error.json();
        console.log({ body });
        if (body.code && body.code === 'INVALID_CREDENTIALS') {
          showWarning({ message: 'Niepoprawny email lub hasło!' });
        } else {
          showWarning({ title: 'Błąd', message: 'Wystąpił nieoczekiwany błąd' });
        }
      }
    },
  });
  console.log('login');

  // const onSubmit = useCallback(
  //   async (data: LoginRequestType) => {
  //     setLoading(true);
  //     const result = await loginMutation.mutateAsync(data);
  //     if (result.ok) {
  //       const responseBody = (await result.json()) as { accessToken: string };
  //       setAccessToken(responseBody.accessToken);
  //       navigate('/');
  //       return;
  //     }
  //     const error = (await result.json()) as ErrorResponse;
  //     console.error({ error });
  //     setLoading(false);
  //   },
  //   [loginMutation, navigate, setAccessToken]
  // );
  return (
    <Box width="100%">
      <Stack direction="row" justifyContent="center">
        <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
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
