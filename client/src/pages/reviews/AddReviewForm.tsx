import { Rating, Paper, Button, Box } from '@mui/material';
import TextInputField from '../../components/common/TextInputField';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReview } from '../../api/review';
import AddReview, { AddReviewType } from '../../models/AddReview';
import { BookViewModelType } from '../../models/BookViewModel';
import TextInputBox from '../../components/common/TextInputBox';
import useAlert from '../../utils/alerts/useAlert';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ApiResponseError } from '../../utils/utils';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../utils/auth/useAuth';

function AddReviewForm({ book }: { book: BookViewModelType }) {
  const [addError, setAddError] = useState<string | null>(null);
  const { handleError } = useAlert();
  const theme = useTheme();
  const [value, setValue] = useState<number | null>(0);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddReviewType>({
    resolver: zodResolver(AddReview),
  });
  const mutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', book.id]);
      queryClient.invalidateQueries(['criticReviews', book.id]);
      queryClient.invalidateQueries(['books', book.id]);
      queryClient.invalidateQueries(['userReviews', user?.id]);
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'USER_REVIEW_ALREADY_EXISTS') {
        setAddError('Twoja opinia dotycząca tej książki już istnieje.');
      } else {
        handleError(err);
      }
    },
  });
  const onSubmit: SubmitHandler<AddReviewType> = (data) => {
    data.rating = value == null ? 0 : value;
    data.idBook = book.id;
    mutation.mutate(data);
  };

  return (
    <Box alignItems={'center'} width={'75%'} marginBottom={2}>
      {addError && (
        <Paper
          elevation={2}
          sx={{
            width: '100%',
            padding: 2,
            backgroundColor: theme.palette.error.main,
            textAlign: 'center',
            display: 'flex',
            mt: 0,
          }}>
          <ErrorOutlineIcon />
          <Typography>{addError}</Typography>
        </Paper>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 2, width: '100%' }} elevation={2}>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue);
            }}
          />
          <TextInputField errors={errors} field="title" register={register} label="Tytuł" />
          <TextInputBox rows={3} errors={errors} field="description" register={register} label="Komentarz" />
          <input type="hidden" {...register('idBook')} value={book.id} />
          <input type="hidden" {...register('rating')} value={value + ''} />
          <Button type="submit" variant="contained">
            Dodaj
          </Button>
        </Paper>
      </form>
    </Box>
  );
}

export default AddReviewForm;
