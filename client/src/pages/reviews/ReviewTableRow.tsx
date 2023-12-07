import { Dialog, TextField, Typography, Rating, Avatar, Button, Paper } from '@mui/material';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import StyledTableRow from '../../components/tableComponents/StyledTableRow';
import { useState } from 'react';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '../../api/review';
import { BookViewModelType } from '../../models/BookViewModel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ApiResponseError } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';
import UpdateReviewForm from './UpdateReviewForm';

function ReviewTableRow({ review, book }: { review: ReviewViewModelType; book: BookViewModelType }) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { handleError } = useAlert();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', book.id] });
    },
    onError: (err) => {
      if (err instanceof ApiResponseError && err.error.code == 'REVIEW_NOT_FOUND') {
        setDeleteError('Ta opinia już nie istnieje.');
      } else {
        handleError(err);
      }
    },
  });
  return (
    <Paper
      key={review.id}
      elevation={2}
      sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', width: '75%' }}>
      <div>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main, marginRight: 2 }}>N</Avatar>
      </div>
      <div>
        <Typography variant="h4" marginBottom={2}>
          {review.title + 'Tytul'}
        </Typography>
        <Typography>
          {review.description + 'Opis'}
        </Typography>
      </div>
      <div>
        <Rating
          name="half-rating-read"
          value={review.rating == null ? 0 : review.rating}
            precision={1}
            readOnly
        />
      </div>
    </Paper>
    // <StyledTableRow>
    //   <StyledTableCell>
    //     <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>N</Avatar>
    //     <div>username</div>
    //   </StyledTableCell>
    //   <StyledTableCell>
    //     <Rating
    //       name="half-rating-read"
    //       value={review.rating == null ? 0 : review.rating}
    //       precision={1}
    //       readOnly
    //     />
    //   </StyledTableCell>
    //   <StyledTableCell>
    //     <Typography variant="h5">
    //       <TextField
    //         multiline
    //         maxRows={2}
    //         InputProps={{ readOnly: true }}
    //         sx={{ mb: 2 }}
    //         variant="standard"
    //         value={review.title}
    //       />
    //     </Typography>
    //     <TextField multiline InputProps={{ readOnly: true }} sx={{ mb: 2 }} value={review.description} />
    //   </StyledTableCell>
    //   <StyledTableCell>
    //     {deleteError && (
    //       <Paper
    //         elevation={7}
    //         sx={{
    //           width: '100%',
    //           padding: 2,
    //           backgroundColor: theme.palette.error.main,
    //           textAlign: 'center',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           mt: 1,
    //         }}>
    //         <ErrorOutlineIcon />
    //         <Typography>{deleteError}</Typography>
    //       </Paper>
    //     )}
    //     <Button sx={{ width: 50, height: 40 }} onClick={() => mutation.mutate(review.id)}>
    //       Usuń
    //     </Button>
    //     <Button sx={{ width: 50, height: 40 }} onClick={handleOpen}>
    //       Edytuj
    //     </Button>
    //     <Dialog open={open} onClose={handleClose}>
    //       <UpdateReviewForm review={review} book={book} handleClose={handleClose} />
    //     </Dialog>
    //   </StyledTableCell>
    // </StyledTableRow>
  );
}

export default ReviewTableRow;
