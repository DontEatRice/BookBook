import Box from '@mui/material/Box';
import { useAuth } from '../../utils/auth/useAuth';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { UserDetailViewModelType } from '../../models/user/UserDetailViewModel';
import { useQuery } from '@tanstack/react-query';
import { myAccount } from '../../api/account';
import LoadingTypography from '../../components/common/LoadingTypography';
import { useForm } from 'react-hook-form';
import UpdateMyAccount, { UpdateMyAccountType } from '../../models/user/UpdateMyAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInputField2 } from '../../components/common/TextInputField';

function SettingsForm({ data }: { data: UserDetailViewModelType }) {
  const { control } = useForm<UpdateMyAccountType>({
    resolver: zodResolver(UpdateMyAccount),
    defaultValues: {
      ...data,
    },
  });
  return (
    <form>
      <TextInputField2 control={control} field="name" label="Nazwa użytkownika" />
    </form>
  );
}

function Settings() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: myAccount,
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

  return <SettingsForm data={data} />;
}

export default Settings;
