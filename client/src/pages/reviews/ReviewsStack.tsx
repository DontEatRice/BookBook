import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BookViewModelType } from '../../models/BookViewModel';
import ReviewPaper from './ReviewPaper';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import AddReviewForm from './AddReviewForm';
import AuthorizedView from '../../components/auth/AuthorizedView';
import { useAuth } from '../../utils/auth/useAuth';

function Reviews({ book, reviews }: { book: BookViewModelType; reviews: ReviewViewModelType[] }) {
  const theme = useTheme();
  const { user } = useAuth();

  reviews.sort(function(x, y){ return x.user.id === user?.id ? -1 : y.user.id === user?.id ? 1 : 0; });

  return (
    <Stack
      sx={{ alignItems: 'center', backgroundColor: theme.palette.background.default, width: 'max' }}>
      <AuthorizedView roles={['User']}>
        {reviews.filter((review => review.user.id === user?.id)).length === 0 && 
            <AddReviewForm book={book}></AddReviewForm>
        }
      </AuthorizedView>
          {reviews
            .map((review) => (
              <ReviewPaper review={review} book={book} key={review.id}></ReviewPaper>
            ))}
    </Stack>
  );
}

export default Reviews;
