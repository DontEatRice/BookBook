import { Rating, Box, Paper, Button } from '@mui/material';
import TextInputField from '../../components/common/TextInputField';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview } from '../../api/review';
import { BookViewModelType } from '../../models/BookViewModel';
import UpdateReview, { UpdateReviewType } from '../../models/UpdateReview';
import TextInputBox from '../../components/common/TextInputBox';

function UpdateReviewForm({
  review,
  book,
  handleClose,
}: {
  review: ReviewViewModelType;
  book: BookViewModelType;
  handleClose: () => void;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateReviewType>({
    resolver: zodResolver(UpdateReview),
    defaultValues: {
      idBook: book.id,
      idReview: review.id,
      rating: review.rating,
    },
  });
  const mutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.refetchQueries(['books', book.id]);
      handleClose();
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit: SubmitHandler<UpdateReviewType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Box sx={{ mt: 0 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 'auto',
            textAlign: 'left',
          }}>
          <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
            <Controller
              control={control}
              name="rating"
              render={({ field: { value, onChange, ref } }) => (
                <Rating
                  ref={ref}
                  value={value}
                  onChange={(_, value) => {
                    onChange(value);
                  }}
                />
              )}
            />
            <TextInputField
              errors={errors}
              field="title"
              register={register}
              label="Tytuł"
              defaultValue={review.title + ''}
            />
            <TextInputBox
              rows={10}
              errors={errors}
              field="description"
              register={register}
              label="Komentarz"
              defaultValue={review.description + ''}
            />

            <Button variant="contained" type="submit" sx={{ margin: 1 }}>
              Uaktualnij
            </Button>
            <Button variant="contained" onClick={() => handleClose()} sx={{ margin: 1 }}>
              Anuluj
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default UpdateReviewForm;
