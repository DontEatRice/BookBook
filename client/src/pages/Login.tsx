import Box from '@mui/material/Box';
import LoginForm from '../components/LoginForm';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useCallback } from 'react';
import { LoginRequestType } from '../models/LoginRequest';
import { ErrorResponse } from '../utils/constants';
import { useAuth } from '../utils/auth/useAuth';

function Login() {
  const { login: setAccessToken } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: login,
  });

  const onSubmit = useCallback(
    async (data: LoginRequestType) => {
      const result = await loginMutation.mutateAsync(data);
      if (result.ok) {
        const responseBody = (await result.json()) as { accessToken: string };
        setAccessToken(responseBody.accessToken);
        navigate('/');
        return;
      }
      const error = (await result.json()) as ErrorResponse;
      console.log({ error });
    },
    [loginMutation, navigate, setAccessToken]
  );
  return (
    <Box width="100%">
      <Stack direction="row" justifyContent="center">
        <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
          <LoginForm onSubmit={(data) => onSubmit(data)} loginAs="User" sx={{ mt: 2, mb: 2 }} />
          <Link to={'/register'}>
            <Button fullWidth={true}>Rejestracja</Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}

export default Login;
