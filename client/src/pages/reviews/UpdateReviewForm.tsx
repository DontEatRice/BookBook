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
import useAlert from '../../utils/alerts/useAlert';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ApiResponseError } from '../../utils/utils';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

function UpdateReviewForm({
  review,
  book,
  handleClose,
}: {
  review: ReviewViewModelType;
  book: BookViewModelType;
  handleClose: () => void;
}) {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { handleError } = useAlert();
  const theme = useTheme();
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
      queryClient.invalidateQueries({ queryKey: ['reviews', book.id] });
      queryClient.invalidateQueries({ queryKey: ['books', book.id] });
      if (updateError == null) {
        handleClose();
      }
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'REVIEW_NOT_FOUND') {
        setUpdateError('Ta opinia już nie istnieje.');
      } else {
        handleError(err);
      }
    },
  });
  const onSubmit: SubmitHandler<UpdateReviewType> = (data) => {
    data.rating = data.rating == null ? 0 : data.rating;
    mutation.mutate(data);
  };

  return (
    <Box sx={{ mt: 0 }}>
      {updateError && (
        <Paper
          elevation={7}
          sx={{
            width: '100%',
            padding: 2,
            backgroundColor: theme.palette.error.main,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            mt: 0,
          }}>
          <ErrorOutlineIcon />
          <Typography>{updateError}</Typography>
        </Paper>
      )}
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
                  sx={{ fontSize: '2rem', marginBottom: 2 }}
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
            <Box textAlign={'center'}>
              <Button variant="contained" type="submit" sx={{ margin: 1 }}>
                Uaktualnij
              </Button>
              <Button variant="contained" onClick={() => handleClose()} sx={{ margin: 1 }}>
                Anuluj
              </Button>
            </Box>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}

export default UpdateReviewForm;
