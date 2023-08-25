import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation } from 'react-query';
import { postPublisher } from '../../api/publisher';
import { useNavigate } from 'react-router-dom';
import AddPublisher, { AddPublisherType } from '../../models/AddPublisher';
import TextInputField from '../../components/TextInputField';
function AdminPublisherForm() {
    const navigate = useNavigate();
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
            navigate('..');
        },
        onError: (e: Error) => {
            console.error(e);
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
                        {/* <TextField
              id="outlined-error-helper-text"
              label="Nazwa wydawcy"
              {...register('name')}
              error={errors.name != undefined}
              helperText={errors.name?.message}
              sx={{ width: '100%', mb: 2 }}
            /> */}
                        <TextInputField errors={errors} field="name" register={register} label="Nazwa wydawcy" />
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