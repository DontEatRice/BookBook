import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import AddAuthor, { AddAuthorType } from '../../models/AddAuthor';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextInputField from '../../components/TextInputField';
import { useMutation } from 'react-query';
import { postAuthor } from '../../api/author';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import NumberInputField from '../../components/NumberInputField';

function AdminAuthorForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAuthorType>({
    resolver: zodResolver(AddAuthor),
  });
  const mutation = useMutation({
    mutationFn: postAuthor,
    onSuccess: () => {
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit = useCallback(
    (data: AddAuthorType) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <Box sx={{ mt: 2 }}>
      <form style={{ display: 'flex', justifyContent: 'center' }} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ width: { xs: '100%', sm: '85%', md: '65%' }, textAlign: 'center' }}>
          <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
            <TextInputField errors={errors} field="firstName" label="Imię" register={register} />
            <TextInputField errors={errors} field="lastName" label="Nazwisko/Nazwiska" register={register} />
            <NumberInputField errors={errors} field='birthYear' label='Rok urodzenia' register={register} />
            <Button type="submit" variant="contained">
              Zapisz
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default AdminAuthorForm;
