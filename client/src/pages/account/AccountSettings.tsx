import Box from '@mui/material/Box';
import { useAuth } from '../../utils/auth/useAuth';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { UserDetailViewModelType } from '../../models/user/UserDetailViewModel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { myAccount, updateMyAccount } from '../../api/account';
import LoadingTypography from '../../components/common/LoadingTypography';
import { Controller, useForm, useWatch } from 'react-hook-form';
import UpdateMyAccount, { UpdateMyAccountType } from '../../models/user/UpdateMyAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInputField, { TextInputField2 } from '../../components/common/TextInputField';
import Avatar from '@mui/material/Avatar';
import useAlert from '../../utils/alerts/useAlert';
import { getLibraries } from '../../api/library';
import { Autocomplete, Checkbox, TextField, Typography } from '@mui/material';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { useMemo, useState } from 'react';
import { fileToUploadImage, imgUrl } from '../../utils/utils';
import { uploadImage } from '../../api/image';

function AccountSettingsForm({
  data,
  onSubmit,
  libraries,
}: {
  data: UserDetailViewModelType;
  onSubmit: (newUser: UpdateMyAccountType) => void;
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
      aboutMe: data.aboutMe ?? '',
      library: data.libraryId ? libraries.find((x) => x.id == data.libraryId) : null,
      street: data.address?.street ?? undefined,
      number: data.address?.number ?? undefined,
      apartment: data.address?.apartment ?? undefined,
      postalCode: data.address?.postalCode ?? undefined,
      city: data.address?.city ?? undefined,
    },
    reValidateMode: 'onChange',
  });

  const watchAvatarPicture = useWatch({
    control,
    name: 'avatarPicture',
  });

  const fileUrl = useMemo(() => {
    if (watchAvatarPicture instanceof FileList && watchAvatarPicture.length > 0) {
      const picture = watchAvatarPicture.item(0);
      if (picture !== null) {
        return URL.createObjectURL(picture);
      }
    }
    return undefined;
  }, [watchAvatarPicture]);

  const handleFormSubmit = (updated: UpdateMyAccountType) => {
    onSubmit(updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack direction="column" alignItems="center" spacing={2} mb={2} mt={2}>
        <Box component="label" htmlFor="upload-photo" textAlign={'center'} sx={{ width: '100%', mb: 2 }}>
          <input
            style={{ display: 'none' }}
            id="upload-photo"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            {...register('avatarPicture')}
          />
          <Button variant="contained" component="span">
            Zmień zdjęcie
          </Button>
        </Box>
        <Avatar src={fileUrl ?? imgUrl(data.avatarImageUrl)} sx={{ width: 250, height: 250 }} />
        {errors.avatarPicture != undefined && (
          <Typography color={'error'}>{errors.avatarPicture.message}</Typography>
        )}
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
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: updateMyAccount,
    onSuccess: (data) => {
      showSuccess({ title: 'Sukces', message: 'Twój profil został zaktualizowany' });
      queryClient.invalidateQueries(['me']);
      queryClient.invalidateQueries(['users', data.id]);
      navigate('/user/' + user?.id);
    },
  });
  const { mutate: uploadImageMutation } = useMutation({
    mutationFn: uploadImage,
  });
  const handleUpdateUser = (newData: UpdateMyAccountType) => {
    if (newData.avatarPicture) {
      fileToUploadImage(newData.avatarPicture).then((model) =>
        uploadImageMutation(model, {
          onSuccess(imageId) {
            newData.avatarImageUrl = imageId;
            updateUserMutation(newData);
          },
        })
      );
    } else {
      updateUserMutation(newData);
    }
  };

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
        <AccountSettingsForm data={data} onSubmit={handleUpdateUser} libraries={librariesData.data} />
      </Box>
    </Stack>
  );
}

export default AccountSettings;
