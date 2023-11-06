import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import UpdatePublisher, { UpdatePublisherType } from '../../models/UpdatePublisher';
import { zodResolver } from '@hookform/resolvers/zod';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextInputField from '../../components/TextInputField';
import { updatePublisher, deletePublisher } from '../../api/publisher';
import { useNavigate } from 'react-router-dom';
import { getPublisher } from '../../api/publisher';
import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import TextInputBox from '../../components/TextInputBox';

function AdminPublisherForm() {
  const navigate = useNavigate();
  const params = useParams();

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
      // response.headers.has() TODO dodać redirect na nowy obiekt
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });

  const deletePublisherMutation = useMutation({
    mutationFn: deletePublisher,
    onSuccess: () => {
      navigate('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });

  const { data, status } = useQuery({
    queryKey: ['publishers', params.publisherId],
    queryFn: () => getPublisher(params.publisherId + ''),
  });

  const onSubmit = useCallback(
    async (data: UpdatePublisherType) => {
      updatePublisherMutation.mutate({ publisher: data, id: params.publisherId! });
    },
    [params.publisherId, updatePublisherMutation]
  );

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
                defaultValue={data.description+""}
              />
              <Stack direction="row" spacing={2} justifyContent={'center'}>
                <Button type="submit" variant="contained">
                  Zapisz
                </Button>
                <Button color="error" onClick={() => deletePublisherMutation.mutate(params.publisherId+"")}>
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

export default AdminPublisherForm;