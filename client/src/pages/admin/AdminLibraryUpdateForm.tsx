import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TextInputField, { TextInputField2 } from '../../components/TextInputField';
import NumberInputField from '../../components/NumberInputField';
import AddLibrary, { AddLibraryType } from '../../models/AddLibrary';
import { updateLibrary, deleteLibrary, getLibrary } from '../../api/library';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimeInputField from '../../components/TimeInputField';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { useParams } from 'react-router';
import { OpenHoursViewModelType } from '../../models/OpenHoursViewModel';
import { ApiResponseError } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';
import { useTheme } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LibraryViewModel from '../../models/LibraryViewModel';

type LibraryOpenHoursTimePickerParams = {
  fields: [keyof AddLibraryType, keyof AddLibraryType];
  dayName: string;
  control: Control<AddLibraryType>;
  onChange?: (value: boolean) => void;
  data: OpenHoursViewModelType;
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
            <TimeInputField label="Otwarcie" field={fields[0]} control={control} disabled={!open} />
            <TimeInputField label="Zamknięcie" field={fields[1]} control={control} disabled={!open} />
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    // unregister,
    reset,
    getValues,
  } = useForm<AddLibraryType>({
    resolver: zodResolver(LibraryViewModel),
  });

  const { data, status } = useQuery({
    queryKey: ['libraries', params.libraryId],
    queryFn: () => getLibrary(params.libraryId + ''),
    onSuccess: (data) => {
      // const hours = data.openHours;
      reset({
        ...getValues(),
        ...data,
        // fridayCloseTime: timeToDayjs(hours.fridayCloseTime),
      });
    },
  });

  const updateLibraryMutation = useMutation({
    mutationFn: updateLibrary,
    onSuccess: () => {
      navigate('..');
    },
  });

  const deleteLibraryMutation = useMutation({
    mutationFn: deleteLibrary,
    onSuccess: () => {
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

  const onSubmit = (data: AddLibraryType) => {
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
              <Accordion sx={{ width: '100%', mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="generalInfo-content"
                  id="generalInfo-header">
                  <Typography>Informacje ogólne</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%', mb: 2 }}>
                  <TextInputField2 control={control} field="name" label="Nazwa" />
                  <NumberInputField
                    errors={errors}
                    field="hireTime"
                    register={register}
                    label="Czas wypożyczenia"
                  />
                  <NumberInputField
                    errors={errors}
                    field="reservationTime"
                    register={register}
                    label="Czas rezerwacji"
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%', mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography>Adres</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%', mb: 2 }}>
                  <TextInputField2 control={control} field="address.street" label="Ulica" />
                  <TextInputField2 control={control} field="address.number" label="Numer" />
                  <TextInputField2 field="address.apartment" label="Numer lokalu" control={control} />
                  <TextInputField2 control={control} field="address.city" label="Miasto" />
                  <TextInputField2 field="address.postalCode" label="Kod pocztowy" control={control} />
                  <TextInputField2
                    control={control}
                    field="address.additionalInfo"
                    label="Informacje dodatkowe"
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%', mb: 2 }} expanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography>Godziny otwarcia</Typography>
                </AccordionSummary>
                {/* <AccordionDetails sx={{ width: '100%', mb: 2 }}>
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
                </AccordionDetails> */}
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
