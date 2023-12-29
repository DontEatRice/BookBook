import { Dialog, Typography, Rating, Avatar, Button, Paper, Grid, Box } from '@mui/material';
import { useState } from 'react';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '../../api/review';
import { BookViewModelType } from '../../models/BookViewModel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ApiResponseError, imgUrl } from '../../utils/utils';
import useAlert from '../../utils/alerts/useAlert';
import UpdateReviewForm from './UpdateReviewForm';
import AuthorizedView from '../../components/auth/AuthorizedView';
import { useAuth } from '../../utils/auth/useAuth';
import { Link } from 'react-router-dom';

function ReviewPaper({ review, book }: { review: ReviewViewModelType; book: BookViewModelType }) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { handleError } = useAlert();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      queryClient.invalidateQueries({ queryKey: ['books', book.id] });
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
    <Paper key={review.id} elevation={2} sx={{ padding: 2, width: '75%', mb: 2 }}>
      <Grid container>
        <Grid container direction={'row'} wrap="nowrap">
          <Grid item xs={1} minHeight={56} minWidth={56}>
            <Link to={'/user/' + review.user.id}>
              <Avatar
                src={imgUrl(review.user.avatarImageUrl, '/autor-szablon.jpg')}
                sx={{ bgcolor: theme.palette.secondary.main, width: 56, height: 56 }}
              />
            </Link>
          </Grid>
          <Grid item xs={6} marginLeft={2}>
            <Typography variant="h5">{review.title}</Typography>
            <Link to={'/user/' + review.user.id}>
              <Typography sx={{ '&:hover': { textDecorationLine: 'underline' } }} marginBottom={2}>
                {review.user.name}
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={5}>
            <Box display="flex" justifyContent="flex-end">
              <Rating
                name="half-rating-read"
                value={review.rating == null ? 0 : review.rating}
                precision={1}
                readOnly
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography marginLeft={1}>{review.description}</Typography>
        </Grid>
        {deleteError && (
          <Paper
            elevation={7}
            sx={{
              width: '100%',
              padding: 2,
              backgroundColor: theme.palette.error.main,
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              mt: 1,
            }}>
            <ErrorOutlineIcon />
            <Typography>{deleteError}</Typography>
          </Paper>
        )}
        <AuthorizedView roles={['User']}>
          {review.user.id === user?.id && (
            <Grid item marginTop={1}>
              <Button sx={{ width: 50, height: 40 }} onClick={() => mutation.mutate(review.id)}>
                Usuń
              </Button>
              <Button sx={{ width: 50, height: 40 }} onClick={handleOpen}>
                Edytuj
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <UpdateReviewForm review={review} book={book} handleClose={handleClose} />
              </Dialog>
            </Grid>
          )}
        </AuthorizedView>
      </Grid>
    </Paper>
  );
}

export default ReviewPaper;
