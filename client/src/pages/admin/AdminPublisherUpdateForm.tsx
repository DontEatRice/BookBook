import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import UpdatePublisher, { UpdatePublisherType } from '../../models/UpdatePublisher';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { updatePublisher } from '../../api/publisher';
import { Link, useNavigate } from 'react-router-dom';
import { getPublisher } from '../../api/publisher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import useAlert from '../../utils/alerts/useAlert';
import TextInputBox from '../../components/common/TextInputBox';
import TextInputField from '../../components/common/TextInputField';

function AdminPublisherForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();
  const { handleError } = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePublisherType>({
    resolver: zodResolver(UpdatePublisher),
  });

  const updatePublisherMutation = useMutation({
    mutationFn: updatePublisher,
    onSuccess: () => {
      queryClient.invalidateQueries(['publishers']);
      navigate('..');
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const { data, status } = useQuery({
    queryKey: ['publishers', params.publisherId],
    queryFn: () => getPublisher(params.publisherId + ''),
  });

  const onSubmit = (data: UpdatePublisherType) => {
    updatePublisherMutation.mutate({ publisher: data, id: params.publisherId! });
  };

  return (
    <Box sx={{ mt: 2 }}>
      {status == 'loading' && 'Ładowanie...'}
      {status == 'error' && 'Błąd!'}
      {status == 'success' && (
        <form style={{ display: 'flex', justifyContent: 'center' }} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { xs: '100%', sm: '85%', md: '65%' }, textAlign: 'center' }}>
            <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
              <TextInputField
                errors={errors}
                field="name"
                label="Nazwa"
                register={register}
                defaultValue={data.name}
              />
              <TextInputBox
                rows={6}
                errors={errors}
                field="description"
                label="Opis"
                register={register}
                defaultValue={data.description + ''}
              />
              <Stack direction="row" spacing={2} justifyContent={'center'}>
                <Button component={Link} to={'..'}>
                  Anuluj
                </Button>
                <Button type="submit" variant="contained">
                  Zapisz
                </Button>
              </Stack>
            </Paper>
          </Box>
        </form>
      )}
    </Box>
  );
}

export default AdminPublisherForm;
