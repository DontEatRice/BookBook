import { TableHead, TableBody, Table, TableRow, TableContainer, Stack } from '@mui/material';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import { useTheme } from '@mui/material/styles';
import { BookViewModelType } from '../../models/BookViewModel';
import ReviewTableRow from './ReviewTableRow';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import AddReviewForm from './AddReviewForm';
import AuthorizedView from '../../components/auth/AuthorizedView';
import { useAuth } from '../../utils/auth/useAuth';

function Reviews({ book, reviews }: { book: BookViewModelType; reviews: ReviewViewModelType[] }) {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Stack
      sx={{ alignItems: 'center', backgroundColor: theme.palette.background.default, width: 'max' }}>
      <AuthorizedView roles={['User']}>
        {reviews.filter((review => review.userId === user?.id)).length === 0 && 
            <AddReviewForm book={book}></AddReviewForm>
        }
      </AuthorizedView>
          {reviews
            .map((review) => (
              <ReviewTableRow review={review} book={book} key={review.id}></ReviewTableRow>
            ))}
    </Stack>
  );
}

export default Reviews;
