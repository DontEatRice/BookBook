import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postPublisher } from '../../api/publisher';
import { useNavigate } from 'react-router-dom';
import AddPublisher, { AddPublisherType } from '../../models/AddPublisher';
import TextInputField from '../../components/TextInputField';
import useAlert from '../../utils/alerts/useAlert';

function AdminPublisherForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleError } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPublisherType>({
    resolver: zodResolver(AddPublisher),
  });
  const mutation = useMutation({
    mutationFn: postPublisher,
    onSuccess: () => {
      queryClient.invalidateQueries(['publishers']);
      navigate('..');
    },
    onError: (err) => {
      handleError(err);
    },
  });
  const onSubmit: SubmitHandler<AddPublisherType> = (data) => {
    mutation.mutate(data);
  };
  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: { xs: '100%', sm: '85%', md: '65%' },
            textAlign: 'center',
          }}>
          <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
            <TextInputField errors={errors} field="name" register={register} label="Nazwa wydawcy" />
            <TextInputField errors={errors} field="description" register={register} label="Opis" />
            <Button type="submit" variant="contained">
              Zapisz
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default AdminPublisherForm;
