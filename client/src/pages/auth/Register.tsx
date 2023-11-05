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
import { fileToUploadImage } from '../../utils/utils';

function Register() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: register,
    onSuccess: () => navigation('/login'),
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
