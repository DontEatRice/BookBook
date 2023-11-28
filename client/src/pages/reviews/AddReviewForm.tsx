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
import useAlert from '../../utils/alerts/useAlert';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ApiResponseError } from '../../utils/utils';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

function AddReviewForm({ book }: { book: BookViewModelType }) {
  const [addError, setAddError] = useState<string | null>(null);
  const { handleError } = useAlert();
  const theme = useTheme();
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
    <Box marginBottom={2}>
      {addError && (
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
          <Typography>{addError}</Typography>
        </Paper>
      )}
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