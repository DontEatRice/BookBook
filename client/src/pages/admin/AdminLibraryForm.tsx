import { Control, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TextInputField from '../../components/TextInputField';
import NumberInputField from '../../components/NumberInputField';
import AddLibrary, { AddLibraryType } from '../../models/AddLibrary';
import { postLibrary } from '../../api/library';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimeInputField from '../../components/TimeInputField';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useCallback, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';

type LibraryOpenHoursTimePickerParams = {
  fields: [keyof AddLibraryType, keyof AddLibraryType];
  dayName: string;
  control: Control<AddLibraryType>;
  onChange?: (value: boolean) => void;
};

function LibraryOpenHoursTimePicker({
  fields,
  dayName,
  control,
  onChange,
}: LibraryOpenHoursTimePickerParams) {
  const [open, setOpen] = useState(true);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);
      if (onChange != undefined) {
        onChange(value);
      }
    },
    [onChange]
  );
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

function AdminLibraryForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    unregister,
  } = useForm<AddLibraryType>({
    resolver: zodResolver(AddLibrary),
  });
  const mutation = useMutation({
    mutationFn: postLibrary,
    onSuccess: () => {
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit: SubmitHandler<AddLibraryType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Box sx={{ mt: 2 }}>
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
                <TextInputField errors={errors} field="name" register={register} label="Nazwa" />
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
                <TextInputField errors={errors} field="street" register={register} label="Ulica" />
                <TextInputField errors={errors} field="number" register={register} label="Numer" />
                <TextInputField errors={errors} field="apartment" register={register} label="Numer lokalu" />
                <TextInputField errors={errors} field="city" register={register} label="Miasto" />
                <TextInputField errors={errors} field="postalCode" register={register} label="Kod pocztowy" />
                <TextInputField
                  errors={errors}
                  field="additionalInfo"
                  register={register}
                  label="Informacje dodatkowe"
                />
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%', mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography>Godziny otwarcia</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ width: '100%', mb: 2 }}>
                {daysOfWeek.map(({ dayName, closeTimeField, openTimeField }) => (
                  <LibraryOpenHoursTimePicker
                    key={dayName}
                    dayName={dayName}
                    fields={[openTimeField, closeTimeField]}
                    control={control}
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
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Zapisz
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default AdminLibraryForm;
