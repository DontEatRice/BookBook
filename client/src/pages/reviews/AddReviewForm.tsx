import * as React from 'react';
import { Rating, Box, Paper, Button } from '@mui/material';
import TextInputField from '../../components/common/TextInputField';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReview } from '../../api/review';
import AddReview, { AddReviewType } from '../../models/AddReview';
import { BookViewModelType } from '../../models/BookViewModel';
import TextInputBox from '../../components/common/TextInputBox';

function AddReviewForm({ book }: { book: BookViewModelType }) {
  const [value, setValue] = React.useState<number | null>(0);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddReviewType>({
    resolver: zodResolver(AddReview),
  });
  const mutation = useMutation({
    mutationFn: postReview,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['books', book.id] });
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });
  const onSubmit: SubmitHandler<AddReviewType> = (data) => {
    data.rating = value == null ? 0 : value;
    data.idBook = book.id;
    mutation.mutate(data);
  };

  return (
    <Box marginBottom={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Paper sx={{ p: 2, width: '100%' }} elevation={3}>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(_, newValue) => {
                setValue(newValue);
              }}
            />
            <TextInputField errors={errors} field="title" register={register} label="Tytuł" />
            <TextInputBox
              rows={3}
              errors={errors}
              field="description"
              register={register}
              label="Komentarz"
            />
            <input type="hidden" {...register('idBook')} value={book.id} />
            <input type="hidden" {...register('rating')} value={value + ''} />
            <Button type="submit" variant="contained">
              Dodaj
            </Button>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default AddReviewForm;
