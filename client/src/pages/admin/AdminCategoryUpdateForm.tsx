import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { editCategory, getCategory } from '../../api/category';
import BookCategoryViewModel, { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInputField2 } from '../../components/common/TextInputField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingTypography from '../../components/common/LoadingTypography';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useAlert from '../../utils/alerts/useAlert';

function CategoryUpdateForm({
  data,
  onSubmit,
}: {
  data: BookCategoryViewModelType;
  onSubmit: (updated: BookCategoryViewModelType) => void;
}) {
  const { control, handleSubmit } = useForm<BookCategoryViewModelType>({
    resolver: zodResolver(BookCategoryViewModel),
    defaultValues: {
      ...data,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          width: { xs: '100%', sm: '85%', md: '65%' },
          textAlign: 'center',
        }}>
        <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
          <TextInputField2 control={control} field="name" label="Nazwa kategorii" />
          <Button type="submit" variant="contained">
            Zapisz
          </Button>
        </Paper>
      </Box>
    </form>
  );
}

function AdminCategoryUpdateForm() {
  const params = useParams();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccess } = useAlert();

  const { data, isLoading } = useQuery({
    queryKey: ['categories', params.categoryId],
    queryFn: () => getCategory(params.categoryId!),
  });
  const { mutate } = useMutation({
    mutationFn: editCategory,
    onSuccess: (_, { body: { name } }) => {
      showSuccess({ title: 'Sukces', message: `Kategoria ${name} została zaktualizowana.` });
      queryClient.invalidateQueries(['categories']);
      navigate('..');
    },
  });

  if (data && !isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        <CategoryUpdateForm
          data={data}
          onSubmit={(updated) => mutate({ id: params.categoryId!, body: updated })}
        />
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingTypography />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography gutterBottom variant="h5" color={theme.palette.error.main}>
        Przepraszamy, wystąpił błąd!
      </Typography>
    </Box>
  );
}

export default AdminCategoryUpdateForm;
