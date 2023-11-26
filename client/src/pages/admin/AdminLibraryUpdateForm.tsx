import { Control, Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AddLibraryType } from '../../models/AddLibrary';
import { updateLibrary, deleteLibrary, getLibrary } from '../../api/library';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { useParams } from 'react-router';
import { OpenHoursViewModelType } from '../../models/OpenHoursViewModel';
import { ApiResponseError } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';
import { useTheme } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UpdateLibrary, { UpdateLibraryType } from '../../models/UpdateLibrary';
import { MuiTelInput } from 'mui-tel-input';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { NumberInputField2 } from '../../components/common/NumberInputField';
import { TextInputField2 } from '../../components/common/TextInputField';

type LibraryOpenHoursTimePickerParams = {
  fields: [keyof UpdateLibraryType, keyof UpdateLibraryType];
  dayName: string;
  control: Control<UpdateLibraryType>;
  data: OpenHoursViewModelType;
  onChange: (open: boolean) => void;
};

function LibraryOpenHoursTimePicker({
  fields,
  dayName,
  control,
  onChange,
}: LibraryOpenHoursTimePickerParams) {
  const [open, setOpen] = useState(true);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (onChange != undefined) {
      onChange(value);
    }
  };

  return (
    <Box>
      <Typography variant="h5" textAlign={'left'}>
        {dayName}
      </Typography>
      <Stack
        alignItems={'center'}
        sx={{ width: '100%', mb: 2, minHeight: '60px' }}
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}>
        <Stack direction="row" alignItems="center">
          <Checkbox checked={open} onChange={() => handleOpenChange(!open)} />
          <Typography onClick={() => handleOpenChange(!open)} sx={{ cursor: 'pointer' }}>
            Otwarte?
          </Typography>
        </Stack>
        {open && (
          <>
            <Controller
              control={control}
              name={fields[0]}
              render={({ field }) => (
                <TimePicker
                  format="HH:mm"
                  ampm={false}
                  label={'Otwarcie'}
                  {...field}
                  disabled={!open}
                  value={field.value ? dayjs('2001-11-02T' + field.value) : null}
                  onChange={(value) => field.onChange(value?.format('HH:mm:ss'))}
                />
              )}
            />
            <Controller
              control={control}
              name={fields[1]}
              render={({ field }) => (
                <TimePicker
                  format="HH:mm"
                  ampm={false}
                  label={'Zamknięcie'}
                  {...field}
                  disabled={!open}
                  value={field.value ? dayjs('2001-11-02T' + field.value) : null}
                  onChange={(value) => field.onChange(value?.format('HH:mm:ss'))}
                />
              )}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}

type DayOfWeek = {
  dayName: string;
  openTimeField: keyof AddLibraryType;
  closeTimeField: keyof AddLibraryType;
};

const daysOfWeek: DayOfWeek[] = [
  {
    dayName: 'Poniedziałek',
    openTimeField: 'mondayOpenTime',
    closeTimeField: 'mondayCloseTime',
  },
  {
    dayName: 'Wtorek',
    openTimeField: 'tuesdayOpenTime',
    closeTimeField: 'tuesdayCloseTime',
  },
  {
    dayName: 'Środa',
    openTimeField: 'wednesdayOpenTime',
    closeTimeField: 'wednesdayCloseTime',
  },
  {
    dayName: 'Czwartek',
    openTimeField: 'thursdayOpenTime',
    closeTimeField: 'thursdayCloseTime',
  },
  {
    dayName: 'Piątek',
    openTimeField: 'fridayOpenTime',
    closeTimeField: 'fridayCloseTime',
  },
  {
    dayName: 'Sobota',
    openTimeField: 'saturdayOpenTime',
    closeTimeField: 'saturdayCloseTime',
  },
  {
    dayName: 'Niedziela',
    openTimeField: 'sundayOpenTime',
    closeTimeField: 'sundayCloseTime',
  },
];

function AdminLibraryUpdateForm() {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { handleError } = useAlert();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    unregister,
  } = useForm<UpdateLibraryType>({
    resolver: zodResolver(UpdateLibrary),
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const { data, status } = useQuery({
    queryKey: ['libraries', params.libraryId],
    queryFn: () => getLibrary(params.libraryId + ''),
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const hours = data.openHours;
    reset({
      additionalInfo: data.address.additionalInfo,
      city: data.address.city,
      number: data.address.number,
      postalCode: data.address.postalCode,
      apartment: data.address.apartment,
      street: data.address.street,
      emailAddress: data.emailAddress,
      name: data.name,
      hireTime: data.hireTime,
      phoneNumber: data.phoneNumber,
      reservationTime: data.reservationTime,
      ...hours,
    });
  }, [data, reset]);

  const updateLibraryMutation = useMutation({
    mutationFn: updateLibrary,
    onSuccess: () => {
      queryClient.invalidateQueries(['libraries']);
      navigate('..');
    },
  });

  const deleteLibraryMutation = useMutation({
    mutationFn: deleteLibrary,
    onSuccess: () => {
      queryClient.invalidateQueries(['libraries']);
      navigate('..');
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'LIBRARY_NOT_FOUND') {
        setDeleteError('Ta biblioteka już nie istnieje.');
      } else {
        handleError(err);
      }
    },
  });

  const onSubmit = (data: UpdateLibraryType) => {
    updateLibraryMutation.mutate({ library: data, id: params.libraryId! });
  };
  return (
    <Box sx={{ mt: 2 }}>
      {deleteError && (
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
          <Typography>{deleteError}</Typography>
        </Paper>
      )}
      {status == 'loading' && 'Ładowanie...'}
      {status == 'error' && 'Błąd!'}
      {status == 'success' && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: { xs: '100%', sm: '90%', md: '80%' },
              textAlign: 'center',
            }}>
            <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
              <Accordion sx={{ width: '100%', mb: 2 }} expanded={true}>
                <AccordionSummary aria-controls="generalInfo-content" id="generalInfo-header">
                  <Typography>Informacje ogólne</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%', mb: 2 }}>
                  <TextInputField2 control={control} field="name" label="Nazwa" />
                  <NumberInputField2 control={control} field="hireTime" label="Czas wypożyczenia" />
                  <NumberInputField2 control={control} field="reservationTime" label="Czas rezerwacji" />
                  <TextInputField2 control={control} field="emailAddress" label="Adres e-mail" />
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field, fieldState: { error } }) => (
                      <MuiTelInput
                        defaultCountry="PL"
                        continents={['EU']}
                        sx={{ width: '100%' }}
                        error={error != undefined}
                        helperText={error?.message}
                        {...field}
                      />
                    )}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%', mb: 2 }} expanded={true}>
                <AccordionSummary aria-controls="panel2-content" id="panel2-header">
                  <Typography>Adres</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%', mb: 2 }}>
                  <TextInputField2 control={control} field="street" label="Ulica" />
                  <TextInputField2 control={control} field="number" label="Numer" />
                  <TextInputField2 field="apartment" label="Numer lokalu" control={control} />
                  <TextInputField2 control={control} field="city" label="Miasto" />
                  <TextInputField2 field="postalCode" label="Kod pocztowy" control={control} />
                  <TextInputField2 control={control} field="additionalInfo" label="Informacje dodatkowe" />
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%', mb: 2 }} expanded={true}>
                <AccordionSummary aria-controls="panel3-content" id="panel3-header">
                  <Typography>Godziny otwarcia</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%', mb: 2 }}>
                  {daysOfWeek.map(({ dayName, closeTimeField, openTimeField }) => (
                    <LibraryOpenHoursTimePicker
                      key={dayName}
                      dayName={dayName}
                      fields={[openTimeField, closeTimeField]}
                      control={control}
                      data={data.openHours}
                      onChange={(opened) => {
                        if (!opened) {
                          unregister(closeTimeField);
                          unregister(openTimeField);
                        }
                      }}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
              <Stack direction="row" spacing={2} justifyContent={'center'}>
                <Button type="submit" variant="contained">
                  Zapisz
                </Button>
                <Button color="error" onClick={() => deleteLibraryMutation.mutate(params.libraryId + '')}>
                  Usuń
                </Button>
              </Stack>
            </Paper>
          </Box>
        </form>
      )}
    </Box>
  );
}

export default AdminLibraryUpdateForm;
