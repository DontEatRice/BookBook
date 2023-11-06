import * as React from 'react';
import { Rating, Box, Paper, Button } from '@mui/material';
import TextInputField from '../../components/TextInputField';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { updateReview } from '../../api/review';
import { BookViewModelType } from '../../models/BookViewModel';
import UpdateReview, { UpdateReviewType } from '../../models/UpdateReview';
import TextInputBox from '../../components/TextInputBox';

function UpdateReviewForm({
  review,
  book,
  handleClose,
  refetch,
}: {
  review: ReviewViewModelType;
  book: BookViewModelType;
  handleClose: () => void;
  refetch: () => Promise<unknown>;
}) {
  const [value, setValue] = React.useState<number | null>(review.rating);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateReviewType>({
    resolver: zodResolver(UpdateReview),
  });
  const mutation = useMutation({
    mutationFn: updateReview,
    onSuccess: async () => {
      handleClose();
      await refetch();
      window.location.reload();
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit: SubmitHandler<UpdateReviewType> = async (data) => {
    data.rating = value == null ? 0 : value;
    data.idReview = review.id;
    data.idBook = book.id;
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
            <Rating
              name="rating"
              value={value}
              onChange={(_, newValue) => {
                setValue(newValue);
              }}
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
            <input type="hidden" {...register('idReview')} value={review.id} />
            <input type="hidden" {...register('idBook')} value={book.id} />
            <input type="hidden" {...register('rating')} value={value + ''} />
            <Button
              variant="contained"
              type="submit"
              sx={{ margin: 1 }}
              onClick={async () => await refetch()}>
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

