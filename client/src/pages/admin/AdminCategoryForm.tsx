import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCategory } from '../../api/category';
import { useNavigate } from 'react-router-dom';
import AddCategory, { AddCategoryType } from '../../models/AddCategory';
import TextInputField from '../../components/common/TextInputField';
import useAlert from '../../utils/alerts/useAlert';
function AdminCategoryForm() {
  const { showSuccess } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategoryType>({
    resolver: zodResolver(AddCategory),
  });
  const mutation = useMutation({
    mutationFn: postCategory,
    onSuccess: (_, variables) => {
      showSuccess({ message: `Dodano kategorię o nazwie ${variables.name}` });
      queryClient.invalidateQueries(['categories']);
      navigate('..');
    },
  });
  const onSubmit: SubmitHandler<AddCategoryType> = (data) => {
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
            <TextInputField errors={errors} field="name" register={register} label="Nazwa kategorii" />
            <Button type="submit" variant="contained">
              Zapisz
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default AdminCategoryForm;
