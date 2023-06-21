import { useForm } from 'react-hook-form';
import BookCategoryViewModel, { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
function AdminCategoryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookCategoryViewModelType>({
    resolver: zodResolver(BookCategoryViewModel),
  });
  const onSubmit = (data: BookCategoryViewModelType) => console.log({ data });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id="outlined-error-helper-text"
        label="Nazwa kategorii"
        {...register('name')}
        error={errors.name != undefined}
        helperText={errors.name?.message}
      />
      <Button type="submit">Zapisz</Button>
    </form>
  );
}

export default AdminCategoryForm;
