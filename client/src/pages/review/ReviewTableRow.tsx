import { Dialog, TextField, Typography, Rating, Avatar, Button } from '@mui/material';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import StyledTableRow from '../../components/tableComponents/StyledTableRow';
import { useState } from 'react';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '../../api/review';
import { BookViewModelType } from '../../models/BookViewModel';
import UpdateReviewForm from '../../pages/review/UpdateReviewForm';

function ReviewTableRow({ review, book }: { review: ReviewViewModelType; book: BookViewModelType }) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ['books', book.id] });
  };

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['books', book.id] });
    },
    onError: (e: Error) => {
      console.error(e);
    },
  });

  return (
    <StyledTableRow>
      <StyledTableCell>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>N</Avatar>
        <div>username</div>
      </StyledTableCell>
      <StyledTableCell>
        <Rating
          name="half-rating-read"
          defaultValue={review.rating == null ? 0 : review.rating}
          precision={1}
          readOnly
        />
      </StyledTableCell>
      <StyledTableCell>
        <Typography variant="h5">
          <TextField
            multiline
            maxRows={2}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
            variant="standard"
            defaultValue={review.title}
          />
        </Typography>
        <TextField
          multiline
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
          defaultValue={review.description}
        />
      </StyledTableCell>
      <StyledTableCell>
        <Button sx={{ width: 50, height: 40 }} onClick={() => mutation.mutate(review.id)}>
          Usuń
        </Button>
        <Button sx={{ width: 50, height: 40 }} onClick={handleOpen}>
          Edytuj
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <UpdateReviewForm review={review} book={book} handleClose={handleClose} />
        </Dialog>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default ReviewTableRow;

