import Box from '@mui/material/Box';
import LoginForm from '../../components/auth/LoginForm';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginAsAdminOrEmployee } from '../../api/auth';
import { useAuth } from '../../utils/auth/useAuth';
import useAlert from '../../utils/alerts/useAlert';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme } from '@mui/material/styles';
import { ApiResponseError } from '../../utils/utils';
import AdminLoginForm from '../../components/auth/AdminLoginForm';

function AdminLogin() {
  const { login: setAccessToken } = useAuth();
  const theme = useTheme();
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleError } = useAlert();
  const loginMutation = useMutation({
    mutationFn: loginAsAdminOrEmployee,
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      navigate('/admin');
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
          <AdminLoginForm
            onSubmit={(data) => loginMutation.mutate(data)}
            sx={{ mt: 2, mb: 2 }}
            loading={loginMutation.isLoading}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default AdminLogin;
