import useAlert from '../../utils/alerts/useAlert';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerEmployee } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { ApiResponseError, fileToUploadImage } from '../../utils/utils';
import { uploadImage } from '../../api/image';
import { RegisterEmployeeType } from '../../models/RegisterEmployee';
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RegisterEmployeeForm from '../../components/auth/RegisterEmpoloyeeForm';

function AdminRegisterEmployeeForm() {
  const navigation = useNavigate();
  const theme = useTheme();
  const { handleError } = useAlert();
  const [apiError, setApiError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: registerEmployee,
    onSuccess: () => navigation('/admin'),
    onError: (error) => {
      if (error instanceof ApiResponseError && error.error.code == 'LIBRARY_NOT_FOUND') {
        setApiError('Wybrana biblioteka nie istnieje!');
      } else if (error instanceof ApiResponseError && error.error.code == 'IDENTITY_EXISTS') {
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
    async (data: RegisterEmployeeType) => {
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
          <RegisterEmployeeForm onSubmit={onSubmit} loading={loading} />
        </Box>
      </Stack>
    </Box>
  );
}

export default AdminRegisterEmployeeForm;
