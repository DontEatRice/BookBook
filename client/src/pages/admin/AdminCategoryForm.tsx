import { useForm } from 'react-hook-form';
import BookCategoryViewModel, { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation } from 'react-query';
import { postCategory } from '../../api/category';
import { redirect } from 'react-router-dom';
function AdminCategoryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookCategoryViewModelType>({
    resolver: zodResolver(BookCategoryViewModel),
  });
  const mutation = useMutation({
    mutationFn: postCategory,
    onSuccess: () => {
      redirect('..');
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit = (data: BookCategoryViewModelType) => {
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
            <TextField
              id="outlined-error-helper-text"
              label="Nazwa kategorii"
              {...register('name')}
              error={errors.name != undefined}
              helperText={errors.name?.message}
              sx={{ width: '100%', mb: 2 }}
            />
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
