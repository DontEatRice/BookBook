import Box from '@mui/material/Box';
import { useAuth } from '../../utils/auth/useAuth';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { UserDetailViewModelType } from '../../models/user/UserDetailViewModel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { myAccount, updateMyAccount } from '../../api/account';
import LoadingTypography from '../../components/common/LoadingTypography';
import { useForm } from 'react-hook-form';
import UpdateMyAccount, { UpdateMyAccountType } from '../../models/user/UpdateMyAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInputField2 } from '../../components/common/TextInputField';
import Avatar from '@mui/material/Avatar';
import useAlert from '../../utils/alerts/useAlert';

function AccountSettingsForm({
  data,
  onSubmit,
}: {
  data: UserDetailViewModelType;
  onSubmit: (newUser: UpdateMyAccountType, picture?: File) => void;
}) {
  const { control, handleSubmit } = useForm<UpdateMyAccountType>({
    resolver: zodResolver(UpdateMyAccount),
    defaultValues: {
      ...data,
    },
  });

  const handleFormSubmit = (updated: UpdateMyAccountType) => {
    onSubmit(updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack direction="column" alignItems="center" spacing={2} mb={2} mt={2}>
        <Avatar src={data.avatarImageUrl ?? undefined} sx={{ width: 250, height: 250 }} />
        <TextInputField2 control={control} field="name" label="Nazwa użytkownika" />
        <Stack direction={'row'} spacing={1}>
          <Button onClick={() => history.back()}>Powrót</Button>
          <Button type="submit" variant="contained">
            Zapisz
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

function AccountSettings() {
  const { user } = useAuth();
  const { showSuccess } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: myAccount,
  });
  const { mutate } = useMutation({
    mutationFn: updateMyAccount,
    onSuccess: (data) => {
      showSuccess({ title: 'Sukces', message: 'Twój profil został zaktualizowany' });
      queryClient.setQueryData(['me'], data);
      navigate('/user/' + user?.id);
    },
  });
  if (!user) {
    return (
      <Box p={2}>
        <Stack justifyContent="center" alignItems="center">
          <Button
            sx={{ width: { xs: '100%', md: '200px' } }}
            variant="contained"
            component={Link}
            to="/login">
            Zaloguj się
          </Button>
        </Stack>
      </Box>
    );
  }
  if (isLoading || !data) {
    return <LoadingTypography />;
  }

  return (
    <Stack direction="row" justifyContent="center">
      <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
        <AccountSettingsForm data={data} onSubmit={(user) => mutate(user)} />
      </Box>
    </Stack>
  );
}

export default AccountSettings;
