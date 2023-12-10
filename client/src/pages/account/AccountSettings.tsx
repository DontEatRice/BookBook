import Box from '@mui/material/Box';
import { useAuth } from '../../utils/auth/useAuth';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { UserDetailViewModelType } from '../../models/user/UserDetailViewModel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { myAccount, updateMyAccount } from '../../api/account';
import LoadingTypography from '../../components/common/LoadingTypography';
import { Controller, useForm } from 'react-hook-form';
import UpdateMyAccount, { UpdateMyAccountType } from '../../models/user/UpdateMyAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInputField, { TextInputField2 } from '../../components/common/TextInputField';
import Avatar from '@mui/material/Avatar';
import useAlert from '../../utils/alerts/useAlert';
import { getLibraries } from '../../api/library';
import { Autocomplete, Checkbox, TextField, Typography } from '@mui/material';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { useState } from 'react';

function AccountSettingsForm({
  data,
  onSubmit,
  libraries,
}: {
  data: UserDetailViewModelType;
  onSubmit: (newUser: UpdateMyAccountType, picture?: File) => void;
  libraries: LibraryViewModelType[];
}) {
  const [displayAddressForm, setDisplayAddressForm] = useState(data.address !== null);
  const handleDisplayAddressFormChange = (value: boolean) => {
    setDisplayAddressForm(value);
  };
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdateMyAccountType>({
    resolver: zodResolver(UpdateMyAccount),
    defaultValues: {
      ...data,
      library: data.libraryId ? libraries.find((x) => x.id == data.libraryId) : null,
      street: data.address ? data.address.street : undefined,
      number: data.address ? data.address.number : undefined,
      apartment: data.address ? data.address.apartment : undefined,
      postalCode: data.address ? data.address.postalCode : undefined,
      city: data.address ? data.address.city : undefined,
    },
  });

  const handleFormSubmit = (updated: UpdateMyAccountType) => {
    onSubmit(updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack direction="column" alignItems="center" spacing={2} mb={2} mt={2}>
        <Avatar src={data.avatarImageUrl ?? undefined} sx={{ width: 250, height: 250 }} />
        <TextInputField2
          control={control}
          field="name"
          label="Nazwa użytkownika"
          additionalProps={{ variant: 'filled' }}
        />
        <TextInputField2
          control={control}
          field="aboutMe"
          label="O mnie"
          additionalProps={{ variant: 'filled' }}
        />
        <Controller
          control={control}
          name="library"
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              sx={{ width: '100%', mb: 2 }}
              options={libraries}
              isOptionEqualToValue={(option, value) => option.id == value.id}
              onChange={(_, newValue) => {
                field.onChange(newValue);
              }}
              getOptionLabel={(library) => library.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Moja biblioteka"
                  placeholder="Szukaj bibliotek"
                  helperText={error?.message}
                  error={error != undefined}
                  variant="filled"
                />
              )}
            />
          )}
        />
        <Box alignItems={'center'} textAlign={'center'}>
          <Typography>Chcesz podać swój adres?</Typography>
          <Checkbox
            checked={displayAddressForm}
            onClick={() => handleDisplayAddressFormChange(!displayAddressForm)}
            {...register('includeAddress')}
          />
        </Box>
        {displayAddressForm && (
          <>
            <TextInputField
              errors={errors}
              field="street"
              register={register}
              label="Ulica"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="number"
              register={register}
              label="Numer"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="apartment"
              register={register}
              label="Numer lokalu"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="city"
              register={register}
              label="Miasto"
              additionalProps={{ variant: 'filled' }}
            />
            <TextInputField
              errors={errors}
              field="postalCode"
              register={register}
              label="Kod pocztowy"
              additionalProps={{ variant: 'filled' }}
            />
          </>
        )}
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
  const { data: librariesData, isLoading: loadingLibraries } = useQuery({
    queryKey: ['libraries'],
    queryFn: () => getLibraries({ pageNumber: 0, pageSize: 1000 }),
  });
  const { mutate } = useMutation({
    mutationFn: updateMyAccount,
    onSuccess: (data) => {
      showSuccess({ title: 'Sukces', message: 'Twój profil został zaktualizowany' });
      queryClient.setQueryData(['me'], data);
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
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
  if (isLoading || loadingLibraries || !data || !librariesData) {
    return <LoadingTypography />;
  }

  return (
    <Stack direction="row" justifyContent="center">
      <Box sx={{ width: { xs: '90%', sm: '70%', md: '45%' } }}>
        <AccountSettingsForm data={data} onSubmit={(user) => mutate(user)} libraries={librariesData.data} />
      </Box>
    </Stack>
  );
}

export default AccountSettings;
