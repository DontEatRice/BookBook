import { FieldErrors, SubmitHandler, UseFormRegister, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation } from 'react-query';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';

type LibraryOpenHoursTimePickerParams = {
  register: UseFormRegister<AddLibraryType>;
  errors: FieldErrors<AddLibraryType>;
  fields: [keyof AddLibraryType, keyof AddLibraryType];
  dayName: string;
};

function LibraryOpenHoursTimePicker({ register, errors, fields, dayName }: LibraryOpenHoursTimePickerParams) {
  return (
    <Box>
      <Typography variant="h5" textAlign={'left'}>
        {dayName}
      </Typography>
      <Stack
        alignItems={'center'}
        sx={{ width: '100%', mb: 2 }}
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}>
        <FormControlLabel label="Otwarte?" control={<Checkbox defaultChecked />} />
        <TimeInputField label="Otwarcie" register={register} field={fields[0]} errors={errors} />
        <TimeInputField label="Zamknięcie" register={register} field={fields[1]} errors={errors} />
      </Stack>
    </Box>
  );
}

function AdminLibraryForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    console.log(data);
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
                {/* <Typography gutterBottom>Poniedziałek</Typography> */}
                <Stack
                  alignItems={'center'}
                  sx={{ width: '100%', mb: 2 }}
                  direction="row"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}>
                  <FormControlLabel label="Otwarte?" control={<Checkbox defaultChecked />} />
                  <TimeInputField
                    label="Otwarcie"
                    register={register}
                    field="mondayOpenTime"
                    errors={errors}
                  />
                  <TimeInputField
                    label="Zamknięcie"
                    register={register}
                    field="mondayCloseTime"
                    errors={errors}
                  />
                </Stack>
                <LibraryOpenHoursTimePicker
                  dayName="Poniedziałek"
                  errors={errors}
                  fields={['mondayOpenTime', 'mondayCloseTime']}
                  register={register}
                />
                {/* <Typography gutterBottom>Wtorek</Typography>
                                    <Stack alignItems={'center'} sx={{ width: '100%', mb: 2 }} direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                        <TimeInputField
                                            label="Otwarcie"
                                            register={register}
                                            field='tuesdayOpenTime'
                                            errors={errors}
                                        />
                                        <TimeInputField
                                            label="Zamknięcie"
                                            register={register}
                                            field='tuesdayCloseTime'
                                            errors={errors}
                                        />
                                    </Stack>
                                    <Typography gutterBottom>Środa</Typography>
                                    <Stack alignItems={'center'} sx={{ width: '100%', mb: 2 }} direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                        <TimeInputField
                                            label="Otwarcie"
                                            register={register}
                                            field='wednesdayOpenTime'
                                            errors={errors}
                                        />
                                        <TimeInputField
                                            label="Zamknięcie"
                                            register={register}
                                            field='wednesdayCloseTime'
                                            errors={errors}
                                        />
                                    </Stack>
                                    <Typography gutterBottom>Czwartek</Typography>
                                    <Stack alignItems={'center'} sx={{ width: '100%', mb: 2 }} direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                        <TimeInputField
                                            label="Otwarcie"
                                            register={register}
                                            field='thursdayOpenTime'
                                            errors={errors}
                                        />
                                        <TimeInputField
                                            label="Zamknięcie"
                                            register={register}
                                            field='thursdayCloseTime'
                                            errors={errors}
                                        />
                                    </Stack>
                                    <Typography gutterBottom>Piątek</Typography>
                                    <Stack alignItems={'center'} sx={{ width: '100%', mb: 2 }} direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                        <TimeInputField
                                            label="Otwarcie"
                                            register={register}
                                            field='fridayOpenTime'
                                            errors={errors}
                                        />
                                        <TimeInputField
                                            label="Zamknięcie"
                                            register={register}
                                            field='fridayCloseTime'
                                            errors={errors}
                                        />
                                    </Stack>
                                    <Typography gutterBottom>Sobota</Typography>
                                    <Stack alignItems={'center'} sx={{ width: '100%', mb: 2 }} direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                        <TimeInputField
                                            label="Otwarcie"
                                            register={register}
                                            field='saturdayOpenTime'
                                            errors={errors}
                                        />
                                        <TimeInputField
                                            label="Zamknięcie"
                                            register={register}
                                            field='saturdayCloseTime'
                                            errors={errors}
                                        />
                                    </Stack>
                                    <Typography >Niedziela</Typography>
                                    <Stack alignItems={'center'} sx={{ width: '100%', mb: 2 }} direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                        <TimeInputField
                                            label="Otwarcie"
                                            register={register}
                                            field='sundayOpenTime'
                                            errors={errors}
                                        />
                                        <TimeInputField
                                            label="Zamknięcie"
                                            register={register}
                                            field='sundayCloseTime'
                                            errors={errors}
                                        />
                                    </Stack> */}
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
